// Initiates a Nango Connect OAuth flow for the authenticated user.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createConnectSession } from "../_shared/nango.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...corsHeaders, "Content-Type": "application/json" } });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return json({ ok: false, code: "unauthorized", message: "Not signed in" }, 401);

    const { provider, returnUrl } = await req.json();
    if (!provider || typeof provider !== "string") return json({ ok: false, code: "bad_request", message: "provider required" }, 400);

    // Where Nango sends the browser back. Defaults to the integrations page on aisorix.com.
    const redirectUri = (typeof returnUrl === "string" && returnUrl) || "https://aisorix.com/agent/integrations";

    const { url } = await createConnectSession({
      userId: user.id,
      email: user.email ?? undefined,
      provider,
      redirectUri: `${redirectUri}?connected=${encodeURIComponent(provider)}`,
    });

    // Pre-record a "pending" row keyed on (user, provider) so the UI can reflect intent.
    await supabase.from("user_integrations").upsert({
      user_id: user.id,
      provider,
      nango_connection_id: user.id,
      status: "pending",
      metadata: {},
    }, { onConflict: "user_id,provider" });

    return json({ ok: true, url });
  } catch (e) {
    console.error("nango-connect-start error", e);
    return json({ ok: false, code: "unknown", message: String((e as Error).message ?? e) }, 500);
  }
});
