import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const url = new URL(req.url);
  const days = Math.min(90, Math.max(1, parseInt(url.searchParams.get("days") ?? "30", 10)));
  const sinceIso = new Date(Date.now() - days * 86400_000).toISOString();

  const { data: events, error } = await ctx.service
    .from("ai_events")
    .select("feature, model, status, tokens_in, tokens_out, latency_ms, created_at, user_id")
    .gte("created_at", sinceIso)
    .limit(50000);
  if (error) return jsonResponse({ error: error.message }, 500);

  const byFeature: Record<string, any> = {};
  const byModel: Record<string, any> = {};
  const byDay: Record<string, any> = {};
  const userSet = new Set<string>();

  for (const e of events ?? []) {
    const f = e.feature ?? "unknown";
    byFeature[f] ??= { feature: f, calls: 0, errors: 0, tokens: 0, users: new Set() };
    byFeature[f].calls++;
    if (e.status !== "success") byFeature[f].errors++;
    byFeature[f].tokens += (e.tokens_in ?? 0) + (e.tokens_out ?? 0);
    if (e.user_id) byFeature[f].users.add(e.user_id);

    const m = e.model ?? "unknown";
    byModel[m] ??= { model: m, calls: 0, tokens: 0 };
    byModel[m].calls++;
    byModel[m].tokens += (e.tokens_in ?? 0) + (e.tokens_out ?? 0);

    const day = (e.created_at as string).slice(0, 10);
    byDay[day] ??= { day, calls: 0, tokens: 0, errors: 0 };
    byDay[day].calls++;
    byDay[day].tokens += (e.tokens_in ?? 0) + (e.tokens_out ?? 0);
    if (e.status !== "success") byDay[day].errors++;

    if (e.user_id) userSet.add(e.user_id);
  }

  const features = Object.values(byFeature).map((f: any) => ({
    feature: f.feature, calls: f.calls, errors: f.errors,
    error_rate: f.calls ? +(f.errors / f.calls * 100).toFixed(2) : 0,
    tokens: f.tokens, users: f.users.size,
    avg_tokens: f.calls ? Math.round(f.tokens / f.calls) : 0,
  }));
  const models = Object.values(byModel);
  const series = Object.values(byDay).sort((a: any, b: any) => a.day.localeCompare(b.day));

  return jsonResponse({
    range_days: days,
    totals: {
      calls: events?.length ?? 0,
      tokens: features.reduce((s: number, f: any) => s + f.tokens, 0),
      errors: features.reduce((s: number, f: any) => s + f.errors, 0),
      unique_users: userSet.size,
    },
    features, models, series,
  });
});
