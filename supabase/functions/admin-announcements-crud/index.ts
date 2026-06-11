import { corsHeaders, requireAdmin, canWrite, audit, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "list") {
    const { data, error } = await ctx.service.from("announcements").select("*").order("created_at", { ascending: false });
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ announcements: data ?? [] });
  }

  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only role" }, 403);

  if (action === "upsert") {
    const a = body.announcement ?? {};
    let prev = null;
    if (a.id) {
      const { data } = await ctx.service.from("announcements").select("*").eq("id", a.id).maybeSingle();
      prev = data;
    }
    const payload = { ...a, created_by: a.created_by ?? ctx.userId };
    const { data, error } = await ctx.service.from("announcements").upsert(payload).select().single();
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, prev ? "announcement.update" : "announcement.create", "announcements", data.id, prev, data);
    return jsonResponse({ announcement: data });
  }

  if (action === "delete") {
    const { data: prev } = await ctx.service.from("announcements").select("*").eq("id", body.id).maybeSingle();
    const { error } = await ctx.service.from("announcements").delete().eq("id", body.id);
    if (error) return jsonResponse({ error: error.message }, 500);
    await audit(ctx, "announcement.delete", "announcements", body.id, prev, null);
    return jsonResponse({ ok: true });
  }

  return jsonResponse({ error: "Unknown action" }, 400);
});
