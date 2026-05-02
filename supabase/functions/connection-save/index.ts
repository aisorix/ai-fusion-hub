// Saves a manually-entered token (Facebook, LinkedIn, WhatsApp, Telegram).
// Verifies the token against the provider before storing.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

async function verifyAndDescribe(service: string, fields: Record<string, string>): Promise<{ ok: boolean; account_label?: string; metadata?: Record<string, unknown>; error?: string; }> {
  try {
    if (service === "facebook") {
      const { access_token, page_id } = fields;
      if (!access_token || !page_id) return { ok: false, error: "Missing fields" };
      const r = await fetch(`https://graph.facebook.com/v19.0/${encodeURIComponent(page_id)}?fields=id,name&access_token=${encodeURIComponent(access_token)}`);
      const d = await r.json();
      if (!r.ok) return { ok: false, error: d?.error?.message || "Facebook token invalid" };
      return { ok: true, account_label: d.name, metadata: { page_id: d.id, page_name: d.name } };
    }
    if (service === "linkedin") {
      const { access_token, author_urn } = fields;
      if (!access_token || !author_urn) return { ok: false, error: "Missing fields" };
      const r = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${access_token}` } });
      const d = await r.json();
      if (!r.ok) return { ok: false, error: d?.message || "LinkedIn token invalid" };
      return { ok: true, account_label: d.name || author_urn, metadata: { author_urn, name: d.name, email: d.email } };
    }
    if (service === "whatsapp") {
      const { access_token, phone_number_id, waba_id } = fields;
      if (!access_token || !phone_number_id || !waba_id) return { ok: false, error: "Missing fields" };
      const r = await fetch(`https://graph.facebook.com/v19.0/${encodeURIComponent(phone_number_id)}?access_token=${encodeURIComponent(access_token)}`);
      const d = await r.json();
      if (!r.ok) return { ok: false, error: d?.error?.message || "WhatsApp credentials invalid" };
      return { ok: true, account_label: d.display_phone_number || phone_number_id, metadata: { phone_number_id, waba_id, display_phone_number: d.display_phone_number, verified_name: d.verified_name } };
    }
    if (service === "telegram") {
      const { access_token } = fields;
      if (!access_token) return { ok: false, error: "Missing token" };
      const r = await fetch(`https://api.telegram.org/bot${access_token}/getMe`);
      const d = await r.json();
      if (!d.ok) return { ok: false, error: d.description || "Bot token invalid" };
      return { ok: true, account_label: `@${d.result.username}`, metadata: { bot_id: d.result.id, bot_username: d.result.username, bot_name: d.result.first_name } };
    }
    return { ok: false, error: "Unsupported service" };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ ok: false, error: "Unauthorized" }, 401);
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) return json({ ok: false, error: "Unauthorized" }, 401);

    const body = await req.json().catch(() => null);
    const service = String(body?.service || "");
    const fields = (body?.fields || {}) as Record<string, string>;
    if (!["facebook", "linkedin", "whatsapp", "telegram"].includes(service)) {
      return json({ ok: false, error: "Invalid service" }, 400);
    }

    const v = await verifyAndDescribe(service, fields);
    if (!v.ok) return json({ ok: false, error: v.error }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { error: upErr } = await admin.from("user_connections").upsert({
      user_id: user.id,
      service,
      access_token: fields.access_token,
      external_account_id: v.account_label ?? null,
      metadata: v.metadata ?? {},
      status: "connected",
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,service" });
    if (upErr) return json({ ok: false, error: upErr.message }, 500);

    return json({ ok: true, account_label: v.account_label });
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});
