// Server-side proxy to a connected provider via Nango. Never exposes tokens to the client.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { nangoProxy } from "../_shared/nango.ts";

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
    if (!user) return json({ ok: false, code: "unauthorized" }, 401);

    const { provider, method, endpoint, body, query, headers } = await req.json();
    if (!provider || !method || !endpoint) return json({ ok: false, code: "bad_request" }, 400);

    // Confirm the user actually has this integration connected
    const { data: integ } = await supabase
      .from("user_integrations")
      .select("id,status").eq("user_id", user.id).eq("provider", provider).maybeSingle();
    if (!integ || integ.status !== "connected") {
      return json({ ok: false, code: "not_connected", message: `${provider} is not connected` }, 400);
    }

    const result = await nangoProxy({
      provider,
      connectionId: user.id,
      method,
      endpoint,
      body,
      query,
      headers,
    });
    return json({ ok: result.ok, status: result.status, data: result.data }, result.ok ? 200 : 502);
  } catch (e) {
    return json({ ok: false, code: "unknown", message: String((e as Error).message ?? e) }, 500);
  }
});
