// End-to-end test for the account deletion lifecycle:
//   request → recover → request again → backdate → purge
//
// Run with the project's edge-function test runner. Requires `.env` to expose
// VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY. If SUPABASE_SERVICE_ROLE_KEY
// is also present (only inside the sandbox), the purge step is exercised; otherwise
// it is reported as skipped so the rest of the flow can still be validated.

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

assert(SUPABASE_URL, "VITE_SUPABASE_URL is required");
assert(ANON_KEY, "VITE_SUPABASE_PUBLISHABLE_KEY is required");

const FN = (name: string) => `${SUPABASE_URL}/functions/v1/${name}`;

async function call(name: string, token: string, body?: unknown) {
  const res = await fetch(FN(name), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : "{}",
  });
  const text = await res.text();
  let parsed: any = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = text; }
  return { status: res.status, body: parsed };
}

Deno.test("account-delete lifecycle: request → recover → request → purge", async () => {
  // 1. Create a throwaway user via public signup (auto-confirm is on for this project).
  const email = `e2e-delete-${crypto.randomUUID()}@aisorixtest.local`;
  const password = "Test1234!Aa$";

  const anon = createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: signUp, error: signUpErr } = await anon.auth.signUp({ email, password });
  assertEquals(signUpErr, null, `signup failed: ${signUpErr?.message}`);
  let token = signUp.session?.access_token ?? "";
  const userId = signUp.user?.id ?? "";
  assert(userId, "no user id returned from signup");

  if (!token) {
    // If email confirmation gate is on in this environment, sign in explicitly.
    const { data: signIn, error: signInErr } = await anon.auth.signInWithPassword({ email, password });
    assertEquals(signInErr, null, `signin failed: ${signInErr?.message}`);
    token = signIn.session?.access_token ?? "";
  }
  assert(token, "no access token available for test user");

  const admin = SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } })
    : null;

  try {
    // 2. Request deletion → expect scheduled date ~30 days out.
    const req1 = await call("account-delete-request", token, {
      reason: "Just taking a break",
      details: "e2e test run",
    });
    assertEquals(req1.status, 200, `request failed: ${JSON.stringify(req1.body)}`);
    assert(req1.body?.scheduled_purge_at, "scheduled_purge_at missing");
    const eta = new Date(req1.body.scheduled_purge_at).getTime() - Date.now();
    assert(eta > 29 * 86400_000 && eta < 31 * 86400_000, `eta out of range: ${eta}ms`);

    // 3. Recover → flag cleared on profile.
    const rec = await call("account-delete-recover", token);
    assertEquals(rec.status, 200, `recover failed: ${JSON.stringify(rec.body)}`);
    assertEquals(rec.body?.recovered, true, "recover should report true");

    if (admin) {
      const { data: prof } = await admin
        .from("profiles")
        .select("deletion_scheduled_at")
        .eq("user_id", userId)
        .maybeSingle();
      assertEquals(prof?.deletion_scheduled_at, null, "profile flag should be cleared after recover");
    }

    // 4. Request again so we can fast-forward into a purge.
    const req2 = await call("account-delete-request", token, { reason: "Other" });
    assertEquals(req2.status, 200, `2nd request failed: ${JSON.stringify(req2.body)}`);

    if (!admin) {
      console.warn("[skip] SUPABASE_SERVICE_ROLE_KEY missing — purge step not exercised");
      // Best-effort cleanup via the recover endpoint.
      await call("account-delete-recover", token);
      return;
    }

    // 5. Backdate the pending request so purge picks it up immediately.
    const past = new Date(Date.now() - 60_000).toISOString();
    const { error: upErr } = await admin
      .from("account_deletion_requests")
      .update({ scheduled_purge_at: past })
      .eq("user_id", userId)
      .eq("status", "pending");
    assertEquals(upErr, null, `backdate failed: ${upErr?.message}`);

    // 6. Trigger purge. Service-role call so it doesn't depend on cron.
    const purgeRes = await fetch(FN("account-delete-purge"), {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    const purgeBody = await purgeRes.json().catch(() => null);
    assertEquals(purgeRes.status, 200, `purge http failed: ${JSON.stringify(purgeBody)}`);
    assert((purgeBody?.purged ?? 0) >= 1, `expected at least 1 purged, got ${purgeBody?.purged}`);

    // 7. Confirm hard deletion: auth user gone, profile gone, request marked purged.
    const { data: gone } = await admin.auth.admin.getUserById(userId);
    assertEquals(gone?.user, null, "auth user should be deleted");

    const { data: profAfter } = await admin
      .from("profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    assertEquals(profAfter, null, "profile row should be deleted");

    const { data: reqAfter } = await admin
      .from("account_deletion_requests")
      .select("status, purged_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    assertEquals(reqAfter?.status, "purged", "request row should be marked purged");
    assert(reqAfter?.purged_at, "purged_at timestamp should be set");
  } finally {
    // Defensive cleanup if anything above threw before the purge.
    if (admin) {
      try { await admin.auth.admin.deleteUser(userId); } catch { /* already gone */ }
      try {
        await admin.from("account_deletion_requests").delete().eq("user_id", userId);
      } catch { /* ignore */ }
    }
  }
});
