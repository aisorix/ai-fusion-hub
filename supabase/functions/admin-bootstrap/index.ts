// Idempotently seeds the company owner admin account: support@aisorix.com
// Safe to call from the public admin login page on mount.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OWNER_EMAIL = "support@aisorix.com";
const OWNER_PASSWORD = "Unicorn-10Trillion$-Company-aisorix";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );

  try {
    // Check if owner already exists by listing users (filtered)
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    if (listErr) throw listErr;
    let owner = list.users.find((u) => u.email?.toLowerCase() === OWNER_EMAIL);

    if (!owner) {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email: OWNER_EMAIL,
        password: OWNER_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: "AI Sorix Owner" },
      });
      if (createErr) throw createErr;
      owner = created.user!;
    }

    // Ensure SUPER_ADMIN role
    const { error: roleErr } = await admin
      .from("user_roles")
      .upsert(
        { user_id: owner.id, role: "admin_super" },
        { onConflict: "user_id,role", ignoreDuplicates: true },
      );
    if (roleErr && !String(roleErr.message).includes("duplicate")) throw roleErr;

    return new Response(
      JSON.stringify({ ok: true, seeded: true, email: OWNER_EMAIL }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
