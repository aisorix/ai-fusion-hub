// Disconnects a provider for the authenticated user.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { deleteConnection } from "../_shared/nango.ts";

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

    const { provider } = await req.json();
    if (!provider) return json({ ok: false, code: "bad_request" }, 400);

    await deleteConnection(provider, user.id).catch(() => null);
    await supabase.from("user_integrations").delete().eq("user_id", user.id).eq("provider", provider);
    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, code: "unknown", message: String((e as Error).message ?? e) }, 500);
  }
});
