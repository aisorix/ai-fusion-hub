import { corsHeaders, requireAdmin, audit, jsonResponse } from "../_shared/adminAuth.ts";

const ALLOWED = [
  "OPENAI_API_KEY","OPENROUTER_API_KEY","LOVABLE_API_KEY",
  "GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","GOOGLE_REDIRECT_URI",
  "INTERNAL_WEBHOOK_SECRET","SUPABASE_SERVICE_ROLE_KEY",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const { data: audits } = await ctx.service.from("secret_audit").select("secret_name, action, created_at").order("created_at", { ascending: false });
  const lastRotated: Record<string, string> = {};
  for (const a of audits ?? []) {
    if (a.action === "rotated" && !lastRotated[a.secret_name]) lastRotated[a.secret_name] = a.created_at;
  }

  const items = ALLOWED.map((name) => ({
    name,
    present: !!Deno.env.get(name),
    last_rotated: lastRotated[name] ?? null,
  }));

  await ctx.service.from("secret_audit").insert(
    ALLOWED.map((n) => ({ secret_name: n, action: "viewed_presence", actor_id: ctx.userId, actor_email: ctx.email }))
  );

  return jsonResponse({ secrets: items });
});
