import { requireAdmin, corsHeaders, jsonResponse } from "../_shared/adminAuth.ts";

// ISO alpha-2 → country name for display
const COUNTRY_NAMES: Record<string, string> = {
  BD: "Bangladesh", US: "United States", IN: "India", PK: "Pakistan", KR: "South Korea",
  KG: "Kyrgyzstan", SA: "Saudi Arabia", KZ: "Kazakhstan", CA: "Canada", DE: "Germany",
  GB: "United Kingdom", FR: "France", AU: "Australia", JP: "Japan", CN: "China",
  BR: "Brazil", MX: "Mexico", AE: "United Arab Emirates", SG: "Singapore", MY: "Malaysia",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  let from: string | null = null;
  let to: string | null = null;
  try { const body = await req.json(); from = body?.from ?? null; to = body?.to ?? null; } catch {}

  const now = new Date();
  const since = from ? new Date(from) : new Date(now.getTime() - 7 * 24 * 3600 * 1000);
  const until = to ? new Date(to) : now;

  const { data: views } = await ctx.service
    .from("page_views")
    .select("path, source, device, country, session_id, created_at, user_id")
    .gte("created_at", since.toISOString())
    .lte("created_at", until.toISOString())
    .limit(20000);

  const rows = views ?? [];
  const pageViews = rows.length;
  const sessions = new Set(rows.map((r: any) => r.session_id || r.user_id || "_")).size;
  const viewsPerVisit = sessions ? pageViews / sessions : 0;

  // Bounce rate: sessions with 1 view / total sessions
  const sessionViewCount: Record<string, number> = {};
  rows.forEach((r: any) => {
    const sid = r.session_id || r.user_id || "_";
    sessionViewCount[sid] = (sessionViewCount[sid] || 0) + 1;
  });
  const bounces = Object.values(sessionViewCount).filter((c) => c === 1).length;
  const bounceRate = sessions ? (bounces / sessions) * 100 : 0;

  // Visit duration (rough): first→last per session
  const sessionTimes: Record<string, { min: number; max: number }> = {};
  rows.forEach((r: any) => {
    const sid = r.session_id || r.user_id || "_";
    const t = new Date(r.created_at).getTime();
    const cur = sessionTimes[sid];
    if (!cur) sessionTimes[sid] = { min: t, max: t };
    else { sessionTimes[sid] = { min: Math.min(cur.min, t), max: Math.max(cur.max, t) }; }
  });
  let durSum = 0, durN = 0;
  Object.values(sessionTimes).forEach((s) => { const d = s.max - s.min; if (d > 0) { durSum += d; durN++; } });
  const avgSec = durN ? Math.round(durSum / durN / 1000) : 0;
  const visitDuration = `${Math.floor(avgSec / 60)}m ${avgSec % 60}s`;

  // Trend by day
  const trendMap: Record<string, number> = {};
  rows.forEach((r: any) => { const d = r.created_at.slice(0, 10); trendMap[d] = (trendMap[d] || 0) + 1; });
  const trend = Object.entries(trendMap).sort(([a], [b]) => a.localeCompare(b)).map(([date, views]) => ({ date, views }));

  const groupCount = (key: string) => {
    const m: Record<string, number> = {};
    rows.forEach((r: any) => { const v = r[key] || "Unknown"; m[v] = (m[v] || 0) + 1; });
    return Object.entries(m).sort(([, a], [, b]) => b - a).map(([name, count]) => ({ name, count }));
  };

  const bySource = groupCount("source");
  const byPage = groupCount("path");
  const byDevice = groupCount("device");

  // Country: include both page_view + profile country fallback
  const countryCount: Record<string, number> = {};
  rows.forEach((r: any) => { if (r.country) countryCount[r.country] = (countryCount[r.country] || 0) + 1; });
  // Augment with profiles for full coverage on the world map
  const { data: profiles } = await ctx.service.from("profiles").select("country_code");
  (profiles ?? []).forEach((p: any) => {
    const c = (p.country_code || "").toUpperCase();
    if (c) countryCount[c] = (countryCount[c] || 0) + 1;
  });
  const byCountry = Object.entries(countryCount)
    .sort(([, a], [, b]) => b - a)
    .map(([code, count]) => ({ code, name: COUNTRY_NAMES[code] || code, count }));

  return jsonResponse({
    kpis: {
      visitors: sessions,
      pageViews,
      viewsPerVisit,
      visitDuration,
      bounceRate,
    },
    trend,
    bySource,
    byPage,
    byDevice,
    byCountry,
  });
});
