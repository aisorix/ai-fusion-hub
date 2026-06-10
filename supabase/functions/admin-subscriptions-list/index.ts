import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(url.searchParams.get("pageSize") ?? "25", 10)));
  const status = url.searchParams.get("status");
  const plan = url.searchParams.get("plan");
  const q = url.searchParams.get("q");

  let query = ctx.service.from("subscriptions").select("*", { count: "exact" }).order("created_at", { ascending: false });
  if (status) query = query.eq("status", status);
  if (plan) query = query.eq("plan_id", plan);

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);
  const { data: subs, count, error } = await query;
  if (error) return jsonResponse({ error: error.message }, 500);

  let filtered = subs ?? [];
  const userIds = filtered.map((s: any) => s.user_id).filter(Boolean);
  let profiles: Record<string, any> = {};
  if (userIds.length) {
    const { data: ps } = await ctx.service.from("profiles").select("user_id, full_name").in("user_id", userIds);
    for (const p of ps ?? []) profiles[p.user_id] = p;
  }
  const rows = filtered.map((s: any) => ({ ...s, full_name: profiles[s.user_id]?.full_name ?? null }));
  const out = q ? rows.filter((r: any) => (r.full_name ?? "").toLowerCase().includes(q.toLowerCase()) || (r.user_id ?? "").includes(q)) : rows;

  return jsonResponse({ rows: out, total: count ?? 0, page, pageSize });
});
