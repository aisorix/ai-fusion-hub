import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const body = await req.json().catch(() => ({}));
  const { actor, action, resource, severity, from, to, page = 1, pageSize = 50 } = body;

  let q = ctx.service.from("audit_logs").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (actor) q = q.ilike("actor_email", `%${actor}%`);
  if (action) q = q.ilike("action", `%${action}%`);
  if (resource) q = q.eq("resource", resource);
  if (severity) q = q.eq("severity", severity);
  if (from) q = q.gte("created_at", from);
  if (to) q = q.lte("created_at", to);

  const fromIdx = (page - 1) * pageSize;
  q = q.range(fromIdx, fromIdx + pageSize - 1);
  const { data, count, error } = await q;
  if (error) return jsonResponse({ error: error.message }, 500);
  return jsonResponse({ logs: data ?? [], total: count ?? 0, page, pageSize });
});
