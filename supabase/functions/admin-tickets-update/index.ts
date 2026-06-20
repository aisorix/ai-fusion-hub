import { corsHeaders, requireAdmin, canWrite, audit, jsonResponse } from "../_shared/adminAuth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  const body = await req.json().catch(() => ({}));
  const action = body.action as string;

  if (action === "list") {
    const { status, priority, assignee, search } = body;
    let q = ctx.service.from("chat_conversations").select("*").order("last_message_at", { ascending: false }).limit(200);
    if (status) q = q.eq("status", status);
    if (priority) q = q.eq("priority", priority);
    if (assignee) q = q.eq("assignee_id", assignee);
    if (search) q = q.or(`title.ilike.%${search}%,guest_email.ilike.%${search}%`);
    const { data, error } = await q;
    if (error) return jsonResponse({ error: error.message }, 500);
    return jsonResponse({ tickets: data ?? [] });
  }

  if (action === "get") {
    const { data: conv } = await ctx.service.from("chat_conversations").select("*").eq("id", body.id).maybeSingle();
    const { data: messages } = await ctx.service.from("chat_messages").select("*").eq("conversation_id", body.id).order("created_at");
    const { data: noteRow } = await ctx.service.from("chat_conversation_internal_notes").select("notes").eq("conversation_id", body.id).maybeSingle();
    const ticket = conv ? { ...conv, internal_notes: noteRow?.notes ?? "" } : null;
    return jsonResponse({ ticket, messages: messages ?? [] });
  }

  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden: read-only role" }, 403);

  if (action === "update") {
    const { id, patch } = body;
    const { data: prev } = await ctx.service.from("chat_conversations").select("*").eq("id", id).maybeSingle();
    const allowed: any = {};
    for (const k of ["status","priority","assignee_id","tags","title"]) {
      if (k in patch) allowed[k] = patch[k];
    }
    let updated: any = prev;
    if (Object.keys(allowed).length > 0) {
      const { data, error } = await ctx.service.from("chat_conversations").update(allowed).eq("id", id).select().single();
      if (error) return jsonResponse({ error: error.message }, 500);
      updated = data;
    }
    if ("internal_notes" in patch) {
      const notes = typeof patch.internal_notes === "string" ? patch.internal_notes : "";
      const { error: noteErr } = await ctx.service
        .from("chat_conversation_internal_notes")
        .upsert({ conversation_id: id, notes, updated_at: new Date().toISOString() }, { onConflict: "conversation_id" });
      if (noteErr) return jsonResponse({ error: noteErr.message }, 500);
      updated = { ...(updated ?? {}), internal_notes: notes };
    }
    await audit(ctx, "ticket.update", "chat_conversations", id, prev, updated);
    return jsonResponse({ ticket: updated });
  }


  if (action === "reply") {
    const { id, content } = body;
    const { data, error } = await ctx.service.from("chat_messages").insert({
      conversation_id: id, sender_id: ctx.userId, sender_type: "employee", content, is_read: true,
    }).select().single();
    if (error) return jsonResponse({ error: error.message }, 500);
    await ctx.service.from("chat_conversations").update({ last_message_at: new Date().toISOString() }).eq("id", id);
    await audit(ctx, "ticket.reply", "chat_messages", data.id, null, { conversation_id: id });
    return jsonResponse({ message: data });
  }

  return jsonResponse({ error: "Unknown action" }, 400);
});
