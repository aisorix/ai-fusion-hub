## Status: Most of this is already done — but there's one critical bug

I checked your project and found that **everything you asked for already exists**, but there is a **typo in your secret name** that is silently breaking Google OAuth. That is almost certainly why Gmail / Drive / Calendar won't connect.

---

### What already exists

**Secrets configured:**
- `GOOGLE_CLIENT_ID` ✅
- `GOOGLE_CLIENT_SECTRET` ⚠️ **TYPO** — should be `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI` ✅
- `INTERNAL_WEBHOOK_SECRET` ✅ (used to sign OAuth state)
- `SUPABASE_SERVICE_ROLE_KEY` ✅

**Edge functions deployed:**
- `supabase/functions/google-oauth-start/index.ts` — validates user JWT, signs state, redirects to Google's consent screen with scopes for Gmail, Drive, Calendar, Docs, Sheets, YouTube ✅
- `supabase/functions/google-oauth-callback/index.ts` — verifies state, exchanges code for tokens, fetches user email, upserts into `user_connections` table ✅

**Database:** `user_connections` table exists with proper RLS, columns for `access_token`, `refresh_token`, `expires_at`, `scopes`, `external_account_id`, `metadata`, `status`. ✅

**Frontend:** `ConnectDialog.tsx` opens the popup to `google-oauth-start` and listens for `postMessage` results. ✅

---

### The actual bug

The secret is named **`GOOGLE_CLIENT_SECTRET`** (missing an `R`). Both edge functions read `Deno.env.get("GOOGLE_CLIENT_SECRET")` (correct spelling), so they receive `undefined` and the Google token exchange fails with `invalid_client`.

This explains exactly why connections never complete and integrations don't show as "connected."

---

### Plan (once approved)

1. **Add the correctly named secret** `GOOGLE_CLIENT_SECRET` (you'll paste the same value you used for the misspelled one).
2. **Delete the misspelled secret** `GOOGLE_CLIENT_SECTRET` to avoid future confusion.
3. **Verify** by:
   - Redeploying `google-oauth-start` and `google-oauth-callback` (they pick up the new env var automatically on next invocation).
   - Hitting "Connect Google" from the Connections page and confirming the row lands in `user_connections` with `status = 'connected'`.
4. **Sanity-check** the Google Cloud Console authorized redirect URI matches exactly:
   `https://flqwpuixevufwxfktdxg.supabase.co/functions/v1/google-oauth-callback`

No new code, no new tables, no new functions needed — just fix the secret name.

---

### Why I'm NOT creating new edge functions

Creating duplicates would overwrite working code and lose the HMAC-signed state, the multi-scope set, and the `user_connections` upsert logic that's already wired into the rest of your app (`getValidGoogleToken`, agent tools, etc.). Fix the typo instead.

Approve and I'll add the correct secret, remove the typo'd one, redeploy both functions, and confirm the OAuth flow works end-to-end.