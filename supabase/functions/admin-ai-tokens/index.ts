import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const url = new URL(req.url);
  const days = Math.min(90, Math.max(1, parseInt(url.searchParams.get("days") ?? "30", 10)));
  const sinceIso = new Date(Date.now() - days * 86400_000).toISOString();

  const { data: events } = await ctx.service
    .from("ai_events")
    .select("user_id, model, tokens_in, tokens_out, created_at")
    .gte("created_at", sinceIso)
    .limit(50000);

  const perDay: Record<string, number> = {};
  const perUser: Record<string, number> = {};
  const perModel: Record<string, number> = {};
  for (const e of events ?? []) {
    const tot = (e.tokens_in ?? 0) + (e.tokens_out ?? 0);
    const day = (e.created_at as string).slice(0, 10);
    perDay[day] = (perDay[day] ?? 0) + tot;
    if (e.user_id) perUser[e.user_id] = (perUser[e.user_id] ?? 0) + tot;
    const m = e.model ?? "unknown";
    perModel[m] = (perModel[m] ?? 0) + tot;
  }

  const topUserIds = Object.entries(perUser).sort((a, b) => b[1] - a[1]).slice(0, 20).map(([id]) => id);
  let userMap: Record<string, any> = {};
  if (topUserIds.length) {
    const { data: profs } = await ctx.service.from("profiles").select("user_id, full_name").in("user_id", topUserIds);
    for (const p of profs ?? []) userMap[p.user_id] = p;
  }
  const topUsers = topUserIds.map((id) => ({
    user_id: id, tokens: perUser[id], full_name: userMap[id]?.full_name ?? null,
  }));

  const series = Object.entries(perDay).sort().map(([day, tokens]) => ({ day, tokens }));
  const models = Object.entries(perModel).map(([model, tokens]) => ({ model, tokens })).sort((a, b) => b.tokens - a.tokens);

  return jsonResponse({ series, models, topUsers });
});
