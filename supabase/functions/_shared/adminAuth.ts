// Shared admin auth helper used by all admin-* edge functions.
import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export type AdminRole = "admin" | "admin_super" | "admin_manager" | "admin_viewer";

export interface AdminContext {
  userId: string;
  email: string;
  roles: AdminRole[];
  service: SupabaseClient;
  ip: string;
  userAgent: string;
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export async function requireAdmin(req: Request): Promise<AdminContext | Response> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return jsonResponse({ error: "Unauthorized" }, 401);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const userClient = createClient(url, anon, { global: { headers: { Authorization: authHeader } } });
  const token = authHeader.replace("Bearer ", "");
  const { data: claims, error } = await userClient.auth.getClaims(token);
  if (error || !claims?.claims) return jsonResponse({ error: "Unauthorized" }, 401);

  const userId = claims.claims.sub as string;
  const email = (claims.claims.email as string) ?? "";
  if (!email.toLowerCase().endsWith("@aisorix.com")) {
    return jsonResponse({ error: "Forbidden: admin email required" }, 403);
  }

  const service = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
  const { data: roleRows } = await service
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);

  const adminSet = new Set(["admin", "admin_super", "admin_manager", "admin_viewer"]);
  const roles = (roleRows ?? []).map((r) => r.role as AdminRole).filter((r) => adminSet.has(r));
  if (roles.length === 0) return jsonResponse({ error: "Forbidden: not an admin" }, 403);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  return { userId, email, roles, service, ip, userAgent };
}

export function canWrite(ctx: AdminContext) {
  return ctx.roles.some((r) => r === "admin" || r === "admin_super" || r === "admin_manager");
}
export function isSuper(ctx: AdminContext) {
  return ctx.roles.some((r) => r === "admin" || r === "admin_super");
}

export async function audit(
  ctx: AdminContext,
  action: string,
  resource: string,
  resource_id: string | null,
  previous_value: unknown = null,
  new_value: unknown = null,
  severity: "info" | "warn" | "high" = "info",
) {
  await ctx.service.from("audit_logs").insert({
    actor_id: ctx.userId,
    actor_email: ctx.email,
    action,
    resource,
    resource_id,
    previous_value,
    new_value,
    ip: ctx.ip,
    user_agent: ctx.userAgent,
    severity,
  });
}
