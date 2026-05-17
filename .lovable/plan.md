## Goal
Combined plan covering two requests:
1. Rotate the Google OAuth secrets to the new credentials you provided.
2. Split the single "Google" tile on `/agent/connections` into **5 independent service tiles** — Gmail, Drive, Calendar, Docs, Sheets — each with its own Connect / Disconnect button and a polished "All done" success message.

## Part 1 — Update Google OAuth secrets

Update via the secure secrets form (values never enter the codebase):
- `GOOGLE_CLIENT_ID` → `345901867434-1nj30sgn02n77ov5bdtgsnqn4iu6h8jk.apps.googleusercontent.com`
- `GOOGLE_CLIENT_SECRET` → `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`
- `GOOGLE_REDIRECT_URI` → `https://flqwpuixevufwxfktdxg.supabase.co/functions/v1/google-oauth-callback`

The redirect URI already matches what `google-oauth-callback` derives from `SUPABASE_URL`, so no edge function code change is needed for the secret rotation itself. New values apply on next cold start (no redeploy required).

> Action required from you in Google Cloud Console: confirm the same redirect URI is whitelisted on the new OAuth client.

## Part 2 — Split Google into per-service tiles

### Final UI
```
┌─ Gmail ──────┐ ┌─ Drive ──────┐ ┌─ Calendar ──┐
│  [Connect]   │ │  [Connect]   │ │  [Connect]  │
└──────────────┘ └──────────────┘ └─────────────┘
┌─ Docs ───────┐ ┌─ Sheets ─────┐ ┌─ Facebook ──┐ ...
│  [Connect]   │ │  [Connect]   │ │  [Connect]  │
└──────────────┘ └──────────────┘ └─────────────┘
```

Each Google tile triggers the same OAuth popup, but requests **only the scopes that service needs** (least-privilege) and stores its own row in `user_connections` keyed by a granular `service` id.

### Per-service scopes
| Tile | `service` id | Scopes |
|------|--------------|--------|
| Gmail | `google_gmail` | openid, email, profile, `gmail.modify` |
| Drive | `google_drive` | openid, email, profile, `drive` |
| Calendar | `google_calendar` | openid, email, profile, `calendar` |
| Docs | `google_docs` | openid, email, profile, `documents`, `drive.file` |
| Sheets | `google_sheets` | openid, email, profile, `spreadsheets`, `drive.file` |

(YouTube removed — not requested.)

### Files to change

1. **`src/components/connections/connectionConfig.ts`**
   - Replace the single `google` entry with five entries (Gmail, Drive, Calendar, Docs, Sheets).
   - Add `oauthProvider: "google"` and `scopes: string[]` fields to `ServiceConfig`.
   - Update `ServiceId` union accordingly.

2. **`src/components/connections/ConnectDialog.tsx`**
   - When `oauthProvider === "google"`, build start URL with the granular service + scopes:
     `…/google-oauth-start?token=…&service=google_gmail&scopes=<space-joined>`
   - Success toast (Sonner):
     - Title: **"All done — {Label} connected"**
     - Description: `{email} · ready to use in Sorix Agent`
     - Duration 5s.
   - Same toast pattern (without email) for the 4 manual services.

3. **`src/pages/ConnectionsPage.tsx`**
   - One-time info card at top: *"We've split Google into separate services for stronger security. Connect just the ones you need."*
   - Grid already iterates `CONNECTION_SERVICES`, so no structural change.

4. **`supabase/functions/google-oauth-start/index.ts`**
   - Read `service` + `scopes` query params; validate `service` against allowlist (`google_gmail`, `google_drive`, `google_calendar`, `google_docs`, `google_sheets`).
   - Use the provided scope set instead of the hardcoded full list.
   - Sign `service` into the `state` payload alongside `uid` + `ts`.

5. **`supabase/functions/google-oauth-callback/index.ts`**
   - Read `service` from verified state.
   - Upsert into `user_connections` with `service = <granular id>`. The existing `(user_id, service)` unique constraint keeps each tile independent.
   - Success postMessage payload includes `service` and `label` so the dialog can show the right name.

6. **`supabase/functions/_shared/googleTokens.ts`**
   - Update the lookup helper: given a required capability (gmail/drive/calendar/docs/sheets), fetch the matching `google_*` row. Falls back to legacy `google` row if present (for users on the old combined connection).

7. **`supabase/functions/agent-router/index.ts`** *(small touch)*
   - Wherever a Google action is dispatched, call the new helper with the required capability instead of hardcoding `service = "google"`.

### Migration note
Existing rows with `service = "google"` stay in the DB and remain usable as a fallback. The info banner asks users to reconnect each service individually for least-privilege scopes. No SQL migration required — `user_connections.service` is free-text.

### Verification
- Update secrets → open `/agent/connections` → connect Gmail only → expect 1 row `service = google_gmail` with only Gmail-related scopes, and toast: **"All done — Gmail connected"**.
- Repeat for Drive / Calendar / Docs / Sheets independently.
- Disconnect Gmail and confirm Drive stays connected.

No DB migration. No client/types regen.
