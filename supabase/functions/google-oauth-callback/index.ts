// Google redirects here with ?code & ?state. Exchanges code for tokens, stores them under
// the per-service connection (google_gmail/google_drive/...) and posts the result back to opener.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_SERVICES = new Set([
  "google_gmail",
  "google_drive",
  "google_calendar",
  "google_docs",
  "google_sheets",
]);

const SERVICE_LABELS: Record<string, string> = {
  google_gmail: "Gmail",
  google_drive: "Google Drive",
  google_calendar: "Google Calendar",
  google_docs: "Google Docs",
  google_sheets: "Google Sheets",
};

async function verifyState(state: string, secret: string): Promise<{ uid: string; ts: number; service?: string; origin?: string } | null> {
  try {
    const [payloadB64, sig] = state.split(".");
    if (!payloadB64 || !sig) return null;
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(payloadB64));
    const expected = Array.from(new Uint8Array(sigBuf)).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (expected !== sig) return null;
    const parsed = JSON.parse(atob(payloadB64));
    if (Date.now() - parsed.ts > 10 * 60 * 1000) return null;
    return parsed;
  } catch { return null; }
}

function htmlResult(ok: boolean, data: Record<string, unknown>, targetOrigin: string) {
  const payload = JSON.stringify({ type: "google_oauth_result", ok, ...data });
  // Only post to the captured opener origin. Fall back to closing without a message
  // if no trusted origin is available — never use "*" which would leak OAuth data.
  const safeOrigin = JSON.stringify(targetOrigin || "");
  const body = `<!doctype html><html><body><script>
    try {
      var target = ${safeOrigin};
      if (window.opener && target) {
        window.opener.postMessage(${payload}, target);
      }
    } catch(e){}
    document.body.innerText = ${ok ? "'Connected. You can close this window.'" : "'Failed: ' + ${JSON.stringify(String(data.error||''))}"};
    setTimeout(function(){ window.close(); }, 800);
  </script></body></html>`;
  return new Response(body, { status: 200, headers: { "Content-Type": "text/html" } });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");
    if (error) return htmlResult(false, { error }, "");
    if (!code || !state) return htmlResult(false, { error: "missing code/state" }, "");

    const secret = Deno.env.get("INTERNAL_WEBHOOK_SECRET");
    if (!secret) return new Response("Server misconfiguration: signing secret missing", { status: 500 });
    const stateData = await verifyState(state, secret);
    if (!stateData) return htmlResult(false, { error: "invalid state" }, "");
    const openerOrigin = stateData.origin || "";

    const service = stateData.service && ALLOWED_SERVICES.has(stateData.service) ? stateData.service : "google_gmail";

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID")!;
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET")!;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI") || `${supabaseUrl}/functions/v1/google-oauth-callback`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code, client_id: clientId, client_secret: clientSecret,
        redirect_uri: redirectUri, grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return htmlResult(false, { error: tokenData.error_description || tokenData.error || "token exchange failed" });

    // Fetch user email
    const meRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const me = await meRes.json();
    const email = me.email || null;

    // Upsert per-service connection row
    const admin = createClient(supabaseUrl, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const expiresAt = new Date(Date.now() + (tokenData.expires_in ?? 3600) * 1000).toISOString();
    const scopes = (tokenData.scope || "").split(" ").filter(Boolean);

    const { error: upErr } = await admin.from("user_connections").upsert({
      user_id: stateData.uid,
      service,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token ?? null,
      expires_at: expiresAt,
      scopes,
      external_account_id: email,
      status: "connected",
      metadata: { name: me.name, picture: me.picture },
      updated_at: new Date().toISOString(),
    }, { onConflict: "user_id,service" });

    if (upErr) return htmlResult(false, { error: upErr.message });
    return htmlResult(true, { email, service, label: SERVICE_LABELS[service] || service });
  } catch (e) {
    return htmlResult(false, { error: (e as Error).message });
  }
});
