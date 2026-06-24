import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Daily cron-triggered function. Purges any account where the 30-day window has elapsed.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: due, error } = await admin
    .from("account_deletion_requests")
    .select("id, user_id")
    .eq("status", "pending")
    .lte("scheduled_purge_at", new Date().toISOString())
    .limit(100);

  if (error) {
    console.error("purge list error", error);
    return json({ error: error.message }, 500);
  }

  let purged = 0;
  for (const row of due ?? []) {
    const uid = row.user_id as string;
    try {
      await admin.from("project_messages").delete().eq("user_id", uid);
      await admin.from("projects").delete().eq("user_id", uid);
      await admin.from("payment_history").delete().eq("user_id", uid);
      await admin.from("subscriptions").delete().eq("user_id", uid);
      await admin.from("reviews").delete().eq("user_id", uid);
      await admin.from("user_chats").delete().eq("user_id", uid);
      await admin.from("image_generations").delete().eq("user_id", uid);
      await admin.from("video_generations").delete().eq("user_id", uid);
      await admin.from("video_jobs").delete().eq("user_id", uid);
      await admin.from("profiles").delete().eq("user_id", uid);
      await admin.from("user_roles").delete().eq("user_id", uid);

      try {
        const { data: files } = await admin.storage.from("profile-avatars").list(uid);
        if (files?.length) {
          await admin.storage.from("profile-avatars").remove(files.map((f) => `${uid}/${f.name}`));
        }
      } catch (_) { /* ignore */ }

      await admin.auth.admin.deleteUser(uid);

      await admin
        .from("account_deletion_requests")
        .update({ status: "purged", purged_at: new Date().toISOString() })
        .eq("id", row.id);
      purged++;
    } catch (e) {
      console.error("purge user failed", uid, e);
    }
  }

  return json({ checked: due?.length ?? 0, purged }, 200);
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
