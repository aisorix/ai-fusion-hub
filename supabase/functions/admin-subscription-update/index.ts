import { corsHeaders, requireAdmin, canWrite, audit, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only role" }, 403);

  const body = await req.json().catch(() => ({}));
  const { id, action, plan_id, status } = body ?? {};
  if (!id || !action) return jsonResponse({ error: "id and action required" }, 400);

  const { data: prev } = await ctx.service.from("subscriptions").select("*").eq("id", id).maybeSingle();
  if (!prev) return jsonResponse({ error: "Subscription not found" }, 404);

  const update: Record<string, unknown> = {};
  if (action === "change_plan" && plan_id) update.plan_id = plan_id;
  if (action === "set_status" && status) update.status = status;
  if (action === "cancel") update.status = "cancelled";

  if (Object.keys(update).length === 0) return jsonResponse({ error: "No-op" }, 400);

  const { data: updated, error } = await ctx.service.from("subscriptions").update(update).eq("id", id).select().single();
  if (error) return jsonResponse({ error: error.message }, 500);

  await audit(ctx, `subscription.${action}`, "subscriptions", id, prev, updated, "high");
  return jsonResponse({ subscription: updated });
});
