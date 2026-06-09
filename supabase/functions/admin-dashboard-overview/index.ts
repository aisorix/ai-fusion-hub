import { requireAdmin, corsHeaders, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  try {
    const s = ctx.service;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const since30 = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();

    const [
      totalUsers,
      newToday,
      subs,
      ticketsOpen,
      tokensAgg,
      growthRaw,
      recentSignups,
      recentTickets,
      imgCount,
      vidCount,
      deckCount,
      analysisCount,
      agentCount,
    ] = await Promise.all([
      s.from("profiles").select("id", { count: "exact", head: true }),
      s.from("profiles").select("id", { count: "exact", head: true }).gte("created_at", today),
      s.from("subscriptions").select("plan_id, amount, tokens_used, status"),
      s.from("chat_conversations").select("id", { count: "exact", head: true }).in("status", ["waiting", "active"]),
      s.from("subscriptions").select("tokens_used"),
      s.from("profiles").select("created_at").gte("created_at", since30).order("created_at"),
      s.from("profiles").select("user_id, full_name, created_at, country_code").order("created_at", { ascending: false }).limit(10),
      s.from("chat_conversations").select("id, subject, status, priority, created_at, user_id").order("created_at", { ascending: false }).limit(10),
      s.from("image_generations").select("id", { count: "exact", head: true }).gte("created_at", since30),
      s.from("video_jobs").select("id", { count: "exact", head: true }).gte("created_at", since30),
      s.from("presentations").select("id", { count: "exact", head: true }).gte("created_at", since30),
      s.from("analysis_history").select("id", { count: "exact", head: true }).gte("created_at", since30),
      s.from("agent_runs").select("id", { count: "exact", head: true }).gte("created_at", since30),
    ]);

    // Plan distribution + MRR
    const planMap: Record<string, { count: number; revenue: number }> = {};
    let mrr = 0;
    let totalTokens = 0;
    (subs.data ?? []).forEach((row: any) => {
      const p = row.plan_id ?? "free";
      planMap[p] = planMap[p] || { count: 0, revenue: 0 };
      planMap[p].count += 1;
      if (row.status === "active") {
        planMap[p].revenue += Number(row.amount ?? 0);
        mrr += Number(row.amount ?? 0);
      }
    });
    (tokensAgg.data ?? []).forEach((r: any) => (totalTokens += Number(r.tokens_used ?? 0)));

    // 30-day growth (cumulative)
    const byDay: Record<string, number> = {};
    (growthRaw.data ?? []).forEach((r: any) => {
      const d = r.created_at.slice(0, 10);
      byDay[d] = (byDay[d] || 0) + 1;
    });
    const growth = Object.entries(byDay).map(([date, count]) => ({ date, count }));

    const features = [
      { name: "Imagine", count: imgCount.count ?? 0 },
      { name: "Cineshoot", count: vidCount.count ?? 0 },
      { name: "Deck", count: deckCount.count ?? 0 },
      { name: "Health/Agro", count: analysisCount.count ?? 0 },
      { name: "Agent", count: agentCount.count ?? 0 },
    ];

    return jsonResponse({
      kpis: {
        totalUsers: totalUsers.count ?? 0,
        newToday: newToday.count ?? 0,
        mrr,
        totalTokens,
        ticketsOpen: ticketsOpen.count ?? 0,
        activeToday: newToday.count ?? 0,
      },
      planDistribution: Object.entries(planMap).map(([plan, v]) => ({ plan, ...v })),
      growth,
      features,
      recentSignups: recentSignups.data ?? [],
      recentTickets: recentTickets.data ?? [],
    });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
