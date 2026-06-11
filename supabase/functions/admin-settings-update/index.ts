import { corsHeaders, requireAdmin, canWrite, audit, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only role" }, 403);

  const { key, value } = await req.json();
  if (!key) return jsonResponse({ error: "key required" }, 400);

  const { data: prev } = await ctx.service.from("system_settings").select("*").eq("key", key).maybeSingle();
  const { data, error } = await ctx.service.from("system_settings")
    .upsert({ key, value, updated_by: ctx.userId, updated_at: new Date().toISOString() })
    .select().single();
  if (error) return jsonResponse({ error: error.message }, 500);
  await audit(ctx, "settings.update", "system_settings", key, prev?.value ?? null, value);
  return jsonResponse({ setting: data });
});
