// Lists Nango connections for the authenticated user and syncs them to user_integrations.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { nangoFetch } from "../_shared/nango.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

    // Connection IDs in Nango == user.id
    const r = await nangoFetch(`/connection?connectionId=${encodeURIComponent(user.id)}`);
    const j = await r.json();
    const connections = j?.connections ?? [];

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    for (const c of connections) {
      const provider = c.provider_config_key ?? c.provider;
      if (!provider) continue;
      await admin.from("user_integrations").upsert({
        user_id: user.id,
        provider,
        nango_connection_id: user.id,
        status: "connected",
        metadata: { provider_name: c.provider, created: c.created },
      }, { onConflict: "user_id,provider" });
    }

    return json({ ok: true, connections });
  } catch (e) {
    console.error("nango-list-connections error", e);
    return json({ ok: false, code: "unknown", message: String((e as Error).message ?? e) }, 500);
  }
});
