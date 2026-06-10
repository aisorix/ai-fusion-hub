import { corsHeaders, requireAdmin, canWrite, audit, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  const body = await req.json().catch(() => ({}));
  const op = body?.op ?? "list";

  if (op === "list") {
    const { data, error } = await ctx.service.from("coupons").select("*").order("created_at", { ascending: false });
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ rows: data ?? [] });
  }

  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only role" }, 403);

  if (op === "create") {
    const { code, description, percent_off, amount_off, currency, max_redemptions, expires_at, active } = body;
    if (!code) return jsonResponse({ error: "code required" }, 400);
    const { data, error } = await ctx.service.from("coupons").insert({
      code, description, percent_off, amount_off, currency, max_redemptions, expires_at,
      active: active ?? true, created_by: ctx.userId,
    }).select().single();
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, "coupon.create", "coupons", data.id, null, data);
    return jsonResponse({ coupon: data });
  }
  if (op === "update") {
    const { id, ...rest } = body;
    if (!id) return jsonResponse({ error: "id required" }, 400);
    const { data: prev } = await ctx.service.from("coupons").select("*").eq("id", id).maybeSingle();
    const { data, error } = await ctx.service.from("coupons").update(rest).eq("id", id).select().single();
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, "coupon.update", "coupons", id, prev, data);
    return jsonResponse({ coupon: data });
  }
  if (op === "delete") {
    const { id } = body;
    if (!id) return jsonResponse({ error: "id required" }, 400);
    const { data: prev } = await ctx.service.from("coupons").select("*").eq("id", id).maybeSingle();
    const { error } = await ctx.service.from("coupons").delete().eq("id", id);
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, "coupon.delete", "coupons", id, prev, null, "high");
    return jsonResponse({ ok: true });
  }
  return jsonResponse({ error: "unknown op" }, 400);
});
