import { requireAdmin, canWrite, audit, corsHeaders, jsonResponse } from "../_shared/adminAuth.ts";

const VALID_PLANS = ["free", "basic", "pro", "premium", "premium_plus", "max", "enterprise"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only" }, 403);

  try {
    const { userId, plan, status, tokensUsed } = await req.json();
    if (!userId) return jsonResponse({ error: "userId required" }, 400);
    if (plan && !VALID_PLANS.includes(plan)) return jsonResponse({ error: "invalid plan" }, 400);

    const s = ctx.service;
    const { data: prev } = await s.from("subscriptions").select("*").eq("user_id", userId).maybeSingle();

    const patch: Record<string, unknown> = {};
    if (plan) patch.plan_id = plan;
    if (status) patch.status = status;
    if (typeof tokensUsed === "number") patch.tokens_used = tokensUsed;

    let result;
    if (prev) {
      const { data, error } = await s.from("subscriptions").update(patch).eq("user_id", userId).select().maybeSingle();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await s.from("subscriptions").insert({ user_id: userId, ...patch }).select().maybeSingle();
      if (error) throw error;
      result = data;
    }

    await audit(ctx, "user.subscription_update", "user", userId, prev, result, "info");
    return jsonResponse({ ok: true, subscription: result });
  } catch (e) {
    return jsonResponse({ error: (e as Error).message }, 500);
  }
});
