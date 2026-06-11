import { corsHeaders, requireAdmin, canWrite, audit, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "list") {
    const { data, error } = await ctx.service.from("prompt_templates").select("*").order("tool");
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ templates: data ?? [] });
  }

  if (action === "versions") {
    const { data, error } = await ctx.service.from("prompt_template_versions")
      .select("*").eq("template_id", body.template_id).order("version", { ascending: false });
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ versions: data ?? [] });
  }

  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only role" }, 403);

  if (action === "update") {
    const { id, body: newBody, model, name } = body;
    const { data: prev } = await ctx.service.from("prompt_templates").select("*").eq("id", id).maybeSingle();
    if (!prev) return jsonResponse({ error: "Not found" }, 404);
    const nextVersion = (prev.current_version ?? 1) + 1;
    await ctx.service.from("prompt_template_versions").insert({
      template_id: id, version: nextVersion, body: newBody, model: model ?? prev.model, created_by: ctx.userId,
    });
    const { data, error } = await ctx.service.from("prompt_templates")
      .update({ body: newBody, model: model ?? prev.model, name: name ?? prev.name, current_version: nextVersion, updated_by: ctx.userId })
      .eq("id", id).select().single();
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, "prompt.update", "prompt_templates", id, prev, data);
    return jsonResponse({ template: data });
  }

  return jsonResponse({ error: "Unknown action" }, 400);
});
