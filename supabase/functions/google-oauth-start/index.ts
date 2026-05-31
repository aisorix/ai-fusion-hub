// Starts Google OAuth for a specific Sorix service (gmail/drive/calendar/docs/sheets).
// Validates user JWT (passed as ?token=) and redirects to Google's consent screen
// requesting only the scopes that service needs (least-privilege).
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

const BASE_SCOPES = ["openid", "email", "profile"];

const DEFAULT_SCOPES_FOR_SERVICE: Record<string, string[]> = {
  google_gmail: [...BASE_SCOPES, "https://www.googleapis.com/auth/gmail.modify"],
  google_drive: [...BASE_SCOPES, "https://www.googleapis.com/auth/drive"],
  google_calendar: [...BASE_SCOPES, "https://www.googleapis.com/auth/calendar"],
  google_docs: [
    ...BASE_SCOPES,
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive.file",
  ],
  google_sheets: [
    ...BASE_SCOPES,
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
  ],
};

async function signState(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const userToken = url.searchParams.get("token");
    const service = url.searchParams.get("service") || "google_gmail";
    if (!userToken) return new Response("Missing token", { status: 400 });
    if (!ALLOWED_SERVICES.has(service)) return new Response("Invalid service", { status: 400 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${userToken}` } } },
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return new Response("Unauthorized", { status: 401 });

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const secret = Deno.env.get("INTERNAL_WEBHOOK_SECRET");
    if (!secret) return new Response("Server misconfiguration: signing secret missing", { status: 500 });
    if (!clientId) return new Response("GOOGLE_CLIENT_ID not configured", { status: 500 });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI") || `${supabaseUrl}/functions/v1/google-oauth-callback`;

    // Scopes from query (?scopes=space+joined) or sensible defaults
    const scopesParam = url.searchParams.get("scopes");
    const scopes = scopesParam ? scopesParam.split(/\s+/).filter(Boolean) : DEFAULT_SCOPES_FOR_SERVICE[service];

    // Capture the opener origin so the callback's postMessage can target it specifically
    // (avoids leaking OAuth result data to arbitrary windows via "*").
    const originParam = url.searchParams.get("origin") || req.headers.get("origin") || req.headers.get("referer") || "";
    let openerOrigin = "";
    try { if (originParam) openerOrigin = new URL(originParam).origin; } catch { openerOrigin = ""; }

    // state = base64({uid, service, ts, origin}).sig
    const payload = JSON.stringify({ uid: user.id, service, ts: Date.now(), origin: openerOrigin });
    const payloadB64 = btoa(payload);
    const sig = await signState(payloadB64, secret);
    const state = `${payloadB64}.${sig}`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: scopes.join(" "),
      access_type: "offline",
      prompt: "consent",
      include_granted_scopes: "true",
      state,
    });

    return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`, 302);
  } catch (e) {
    return new Response(`Error: ${(e as Error).message}`, { status: 500 });
  }
});
