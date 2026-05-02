// Starts Google OAuth: validates user JWT (passed as ?token=) and redirects to Google's consent screen.
// Stores user_id signed into the `state` param using INTERNAL_WEBHOOK_SECRET.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/calendar",
  "https://www.googleapis.com/auth/documents",
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/youtube",
];

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
    if (!userToken) return new Response("Missing token", { status: 400 });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: `Bearer ${userToken}` } } },
    );
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return new Response("Unauthorized", { status: 401 });

    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const secret = Deno.env.get("INTERNAL_WEBHOOK_SECRET") || "fallback-secret";
    if (!clientId) return new Response("GOOGLE_CLIENT_ID not configured", { status: 500 });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const redirectUri = `${supabaseUrl}/functions/v1/google-oauth-callback`;

    // state = base64({uid, ts}).sig
    const payload = JSON.stringify({ uid: user.id, ts: Date.now() });
    const payloadB64 = btoa(payload);
    const sig = await signState(payloadB64, secret);
    const state = `${payloadB64}.${sig}`;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: SCOPES.join(" "),
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
