import { corsHeaders, requireAdmin, canWrite, audit, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "list") {
    const { data, error } = await ctx.service.from("feature_flags").select("*").order("key");
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ flags: data ?? [] });
  }

  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only role" }, 403);

  if (action === "upsert") {
    const flag = body.flag ?? {};
    const { data: prev } = await ctx.service.from("feature_flags").select("*").eq("key", flag.key).maybeSingle();
    const { data, error } = await ctx.service.from("feature_flags").upsert({ ...flag, updated_by: ctx.userId }, { onConflict: "key" }).select().single();
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, prev ? "flag.update" : "flag.create", "feature_flags", data.id, prev, data);
    return jsonResponse({ flag: data });
  }

  if (action === "delete") {
    const { data: prev } = await ctx.service.from("feature_flags").select("*").eq("id", body.id).maybeSingle();
    const { error } = await ctx.service.from("feature_flags").delete().eq("id", body.id);
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, "flag.delete", "feature_flags", body.id, prev, null, "warn");
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "Unknown action" }, 400);
});
