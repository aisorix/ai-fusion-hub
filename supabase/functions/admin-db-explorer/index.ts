import { requireAdmin, corsHeaders, jsonResponse } from "../_shared/adminAuth.ts";

// Whitelist of public tables admins may browse.
const TABLES = [
  "agent_runs","agent_schedules","ai_events","analysis_history","announcements","audit_logs",
  "broadcasts","chat_conversations","chat_messages","coupons","cowork_connectors","cowork_messages","cowork_tasks",
  "email_send_log","email_send_state","email_unsubscribe_tokens","feature_flags","feedback_entries",
  "image_generations","page_views","payment_history","payment_intents","presentations","profiles","project_files",
  "project_github","project_messages","projects","prompt_template_versions","prompt_templates","reviews",
  "secret_audit","shared_chat_comments","shared_chat_members","shared_chats","subscriptions","suppressed_emails",
  "system_settings","user_chat_windows","user_chats","user_connections","user_custom_integrations","user_roles",
  "video_generations","video_jobs",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;

  let body: any = {};
  try { body = await req.json(); } catch {}
  const action = body?.action;

  if (action === "list_tables") {
    const results = await Promise.all(TABLES.map(async (name) => {
      const { count } = await ctx.service.from(name).select("*", { count: "exact", head: true });
      return { name, rows: count ?? 0 };
    }));
    return jsonResponse({ tables: results.sort((a, b) => a.name.localeCompare(b.name)) });
  }

  if (action === "read_rows") {
    const table = String(body?.table || "");
    if (!TABLES.includes(table)) return jsonResponse({ error: "Table not allowed" }, 400);
    const limit = Math.min(200, Math.max(1, Number(body?.limit ?? 50)));
    const { data, error } = await ctx.service.from(table).select("*").order("created_at", { ascending: false }).limit(limit);
    if (error) {
      // Some tables don't have created_at, retry without order
      const { data: d2, error: e2 } = await ctx.service.from(table).select("*").limit(limit);
      if (e2) return jsonResponse({ error: e2.message }, 500);
      const columns = d2 && d2.length > 0 ? Object.keys(d2[0]) : [];
      return jsonResponse({ rows: d2 ?? [], columns });
    }
    const columns = data && data.length > 0 ? Object.keys(data[0]) : [];
    return jsonResponse({ rows: data ?? [], columns });
  }

  return jsonResponse({ error: "Unknown action" }, 400);
});
