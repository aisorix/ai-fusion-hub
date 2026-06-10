import { corsHeaders, requireAdmin, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const { data: subs } = await ctx.service.from("subscriptions").select("plan_id, status, amount, currency, billing_cycle, created_at");
  const { data: payments } = await ctx.service.from("payment_history").select("amount, currency, status, payment_method, created_at").order("created_at", { ascending: false }).limit(5000);

  const activeSubs = (subs ?? []).filter((s: any) => s.status === "active");
  let mrr = 0;
  const planDist: Record<string, number> = {};
  for (const s of activeSubs) {
    const monthly = s.billing_cycle === "yearly" ? Number(s.amount) / 12 : Number(s.amount);
    mrr += monthly || 0;
    planDist[s.plan_id ?? "unknown"] = (planDist[s.plan_id ?? "unknown"] ?? 0) + 1;
  }
  const arr = mrr * 12;
  const arpu = activeSubs.length ? mrr / activeSubs.length : 0;

  // MRR trend (last 12 months) from sub created_at
  const months: Record<string, number> = {};
  for (let i = 11; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i);
    months[d.toISOString().slice(0, 7)] = 0;
  }
  for (const s of subs ?? []) {
    const m = (s.created_at as string).slice(0, 7);
    if (m in months) {
      const monthly = s.billing_cycle === "yearly" ? Number(s.amount) / 12 : Number(s.amount);
      months[m] += monthly || 0;
    }
  }
  const mrrTrend = Object.entries(months).map(([month, value]) => ({ month, value: Math.round(value) }));

  const payMethods: Record<string, number> = {};
  let refundTotal = 0, paidTotal = 0;
  for (const p of payments ?? []) {
    payMethods[p.payment_method ?? "unknown"] = (payMethods[p.payment_method ?? "unknown"] ?? 0) + 1;
    if (p.status === "refunded") refundTotal += Number(p.amount) || 0;
    if (p.status === "completed" || p.status === "paid") paidTotal += Number(p.amount) || 0;
  }

  const churnTotal = (subs ?? []).filter((s: any) => s.status === "cancelled" || s.status === "canceled").length;
  const churnRate = subs?.length ? +(churnTotal / subs.length * 100).toFixed(2) : 0;

  return jsonResponse({
    kpis: {
      mrr: Math.round(mrr), arr: Math.round(arr), arpu: +arpu.toFixed(2),
      active_subscriptions: activeSubs.length,
      total_paid: Math.round(paidTotal),
      refunded: Math.round(refundTotal),
      churn_rate: churnRate,
    },
    mrrTrend,
    planDistribution: Object.entries(planDist).map(([plan, count]) => ({ plan, count })),
    paymentMethods: Object.entries(payMethods).map(([method, count]) => ({ method, count })),
  });
});
