import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const { data } = await ctx.service.from("feedback_entries").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = data ?? [];

  // NPS: promoters (9-10) - detractors (0-6)
  const npsRows = rows.filter((r: any) => r.nps !== null && r.nps !== undefined);
  const promoters = npsRows.filter((r: any) => r.nps >= 9).length;
  const detractors = npsRows.filter((r: any) => r.nps <= 6).length;
  const passives = npsRows.length - promoters - detractors;
  const nps = npsRows.length ? Math.round(((promoters - detractors) / npsRows.length) * 100) : 0;

  const ratingDist = [1,2,3,4,5].map((r) => ({ rating: r, count: rows.filter((x: any) => x.rating === r).length }));
  const byFeature: Record<string, number> = {};
  for (const r of rows) byFeature[r.feature] = (byFeature[r.feature] ?? 0) + 1;

  return jsonResponse({
    summary: { total: rows.length, nps, promoters, passives, detractors },
    ratingDist,
    byFeature: Object.entries(byFeature).map(([feature, count]) => ({ feature, count })),
    recent: rows.slice(0, 50),
  });
});
