import { requireAdmin, corsHeaders, jsonResponse, audit, canWrite } from "../_shared/adminAuth.ts";

const SITE_NAME = "AI Sorix";
const FROM_DOMAIN = "www.aisorix.com";
const SENDER_DOMAIN = "notify.www.aisorix.com";

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function renderHtml(subject: string, body: string) {
  const safeBody = escapeHtml(body).replace(/\n/g, "<br/>");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#111827;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr><td align="center" style="padding:24px;">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#0891b2,#14b8a6);padding:24px;color:#ffffff;">
          <div style="font-size:20px;font-weight:700;">${SITE_NAME}</div>
        </td></tr>
        <tr><td style="padding:32px 28px;">
          <h1 style="margin:0 0 16px 0;font-size:22px;color:#111827;">${escapeHtml(subject)}</h1>
          <div style="font-size:15px;line-height:1.6;color:#374151;">${safeBody}</div>
        </td></tr>
        <tr><td style="padding:20px 28px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280;">
          Sent by ${SITE_NAME} · <a href="https://${FROM_DOMAIN}" style="color:#0891b2;text-decoration:none;">${FROM_DOMAIN}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const ctx = await requireAdmin(req);
  if (ctx instanceof Response) return ctx;
  if (!canWrite(ctx)) return jsonResponse({ error: "Forbidden" }, 403);

  let body: any;
  try { body = await req.json(); } catch { return jsonResponse({ error: "Invalid JSON" }, 400); }

  const subject = String(body?.subject || "").trim();
  const messageBody = String(body?.body || "").trim();
  const audience = body?.audience ?? { plan: "all" };
  const channels: string[] = Array.isArray(body?.channels) ? body.channels : ["email"];

  if (!subject || subject.length > 200) return jsonResponse({ error: "Invalid subject" }, 400);
  if (!messageBody || messageBody.length > 4000) return jsonResponse({ error: "Invalid body" }, 400);
  if (channels.length === 0) return jsonResponse({ error: "No channels selected" }, 400);

  // 1. Resolve audience
  let userIds: string[] = [];
  let emails: { id: string; email: string }[] = [];

  // Fetch matching user_ids from subscriptions/profiles
  if (audience.plan && audience.plan !== "all") {
    const { data } = await ctx.service.from("subscriptions").select("user_id").eq("plan_id", audience.plan).eq("status", "active");
    userIds = (data ?? []).map((r: any) => r.user_id).filter(Boolean);
  } else {
    const { data } = await ctx.service.from("profiles").select("user_id");
    userIds = (data ?? []).map((r: any) => r.user_id).filter(Boolean);
  }

  // Resolve emails via auth admin
  if (channels.includes("email") && userIds.length > 0) {
    // listUsers paginates; pull pages until we cover all
    let page = 1; const perPage = 1000;
    const allMap: Record<string, string> = {};
    while (true) {
      const { data, error } = await ctx.service.auth.admin.listUsers({ page, perPage });
      if (error) break;
      (data?.users ?? []).forEach((u: any) => { if (u.email) allMap[u.id] = u.email; });
      if (!data || (data.users?.length ?? 0) < perPage) break;
      page++;
      if (page > 50) break; // hard cap
    }
    emails = userIds.map((id) => ({ id, email: allMap[id] })).filter((u) => !!u.email);
  }

  // 2. Insert broadcast row
  const { data: broadcastRow, error: insErr } = await ctx.service.from("broadcasts").insert({
    subject,
    body: messageBody,
    audience,
    channels,
    created_by: ctx.userId,
    created_by_email: ctx.email,
    recipient_count: emails.length || userIds.length,
    status: "pending",
  }).select("id").single();
  if (insErr) return jsonResponse({ error: insErr.message }, 500);

  let sentCount = 0;
  let failedCount = 0;

  // 3. Email channel: enqueue via existing transactional queue
  if (channels.includes("email") && emails.length > 0) {
    const html = renderHtml(subject, messageBody);
    for (const u of emails) {
      const messageId = `broadcast-${broadcastRow.id}-${u.id}`;
      try {
        await ctx.service.from("email_send_log").insert({
          message_id: messageId,
          template_name: "admin_broadcast",
          recipient_email: u.email,
          status: "pending",
        });
        const { error: enqErr } = await ctx.service.rpc("enqueue_email", {
          queue_name: "transactional_emails",
          payload: {
            message_id: messageId,
            to: u.email,
            from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
            sender_domain: SENDER_DOMAIN,
            subject,
            html,
            text: messageBody,
            purpose: "transactional",
            label: "admin_broadcast",
            queued_at: new Date().toISOString(),
          },
        });
        if (enqErr) { failedCount++; } else { sentCount++; }
      } catch {
        failedCount++;
      }
    }
  }

  // 4. In-app channel: insert announcement
  if (channels.includes("in_app")) {
    await ctx.service.from("announcements").insert({
      title: subject,
      message: messageBody,
      active: true,
      starts_at: new Date().toISOString(),
      ends_at: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
    });
  }

  // 5. Update broadcast totals
  await ctx.service.from("broadcasts")
    .update({ sent_count: sentCount, failed_count: failedCount, status: failedCount === 0 ? "sent" : (sentCount > 0 ? "partial" : "failed") })
    .eq("id", broadcastRow.id);

  await audit(ctx, "broadcast.send", "broadcast", broadcastRow.id, null, { subject, channels, recipients: emails.length || userIds.length });

  return jsonResponse({ id: broadcastRow.id, recipients: emails.length || userIds.length, sent: sentCount, failed: failedCount });
});
