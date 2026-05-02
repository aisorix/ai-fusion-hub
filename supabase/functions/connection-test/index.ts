// Tests a stored connection by pinging the provider.
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

async function ping(service: string, conn: any): Promise<{ ok: boolean; account_label?: string; error?: string }> {
  const token = conn.access_token;
  const meta = conn.metadata || {};
  try {
    if (service === "google") {
      const r = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (!r.ok) return { ok: false, error: d?.error?.message || "token invalid" };
      return { ok: true, account_label: d.email };
    }
    if (service === "facebook") {
      const r = await fetch(`https://graph.facebook.com/v19.0/${meta.page_id}?fields=id,name&access_token=${token}`);
      const d = await r.json();
      if (!r.ok) return { ok: false, error: d?.error?.message };
      return { ok: true, account_label: d.name };
    }
    if (service === "linkedin") {
      const r = await fetch("https://api.linkedin.com/v2/userinfo", { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      if (!r.ok) return { ok: false, error: d?.message };
      return { ok: true, account_label: d.name };
    }
    if (service === "whatsapp") {
      const r = await fetch(`https://graph.facebook.com/v19.0/${meta.phone_number_id}?access_token=${token}`);
      const d = await r.json();
      if (!r.ok) return { ok: false, error: d?.error?.message };
      return { ok: true, account_label: d.display_phone_number };
    }
    if (service === "telegram") {
      const r = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const d = await r.json();
      if (!d.ok) return { ok: false, error: d.description };
      return { ok: true, account_label: `@${d.result.username}` };
    }
    return { ok: false, error: "Unknown service" };
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
    if (!service) return json({ ok: false, error: "Missing service" }, 400);

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: conn, error } = await admin
      .from("user_connections")
      .select("access_token, refresh_token, metadata, expires_at")
      .eq("user_id", user.id)
      .eq("service", service)
      .maybeSingle();
    if (error || !conn) return json({ ok: false, error: "Not connected" }, 404);

    const result = await ping(service, conn);
    return json(result, result.ok ? 200 : 400);
  } catch (e) {
    return json({ ok: false, error: (e as Error).message }, 500);
  }
});
