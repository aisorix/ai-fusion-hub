# Sorix Agent — Connections & OAuth Settings Page

Goal: give every signed-in user a professional **Connections** page where they can link their own Google, Facebook, LinkedIn, WhatsApp Business, and Telegram accounts to Sorix Agent. Tokens are stored encrypted-at-rest in the existing `user_connections` table (RLS already restricts to `auth.uid() = user_id`), and the Agent's tool functions read them at runtime to act on the user's behalf.

## What the user gets

A new route **`/agent/connections`** (also opened from the Sorix Agent right panel "Connectors" list — clicking a "Soon" chip will now open the connect dialog instead).

For each service:
- Connection status pill (Connected / Not connected / Expired)
- Connected account label (email / page name / phone / @handle)
- "Connect" button → opens a service-specific dialog
- "Disconnect" button → removes the row from `user_connections`
- "Test connection" button → calls a small edge function that pings the provider with the stored token and reports success/failure
- Last-synced timestamp + scopes granted

```text
/agent/connections
┌──────────────────────────────────────────────────┐
│  Connections                                     │
│  Link your accounts so Sorix Agent can act for   │
│  you across email, social, and messaging.        │
├──────────────────────────────────────────────────┤
│  [G] Google (Gmail/Drive/Calendar/YT) ● Connected│
│      user@gmail.com · 6 scopes  [Test][Disconnect]│
│  [f] Facebook Page                ○ Not connected│
│      [Connect]                                   │
│  [in] LinkedIn                    ● Connected    │
│  [W] WhatsApp Business            ○ Not connected│
│  [T] Telegram Bot                 ○ Not connected│
└──────────────────────────────────────────────────┘
```

## Connection methods per service

Each provider has a different real-world flow. We support the right one for each and keep the UI consistent.

| Service | Method | Inputs collected from user | Stored in `user_connections` |
|---|---|---|---|
| Google (Gmail, Drive, Calendar, Docs, Sheets, YouTube) | OAuth 2.0 Authorization Code (popup → callback edge function exchanges code for tokens using server-side `GOOGLE_CLIENT_ID/SECRET`) | Just clicks "Connect with Google" | `access_token`, `refresh_token`, `expires_at`, `scopes`, `external_account_id`=email |
| Facebook Page | Manual paste (Page Access Token, Page ID) — Meta's long-lived page tokens are the cleanest path; full FB Login OAuth can be added later | Page Access Token, Page ID | `access_token`, `metadata.page_id`, `metadata.page_name` |
| LinkedIn | Manual paste (Access Token + Author URN) — LinkedIn OAuth requires app review, so v1 collects token; OAuth upgrade later | Access Token, Author URN (`urn:li:person:...`) | `access_token`, `metadata.author_urn` |
| WhatsApp Business | Manual paste (Permanent Token, Phone Number ID, WABA ID) | Permanent Token, Phone Number ID, WABA ID | `access_token`, `metadata.phone_number_id`, `metadata.waba_id` |
| Telegram Bot | Manual paste (Bot Token from @BotFather) — we then call `getMe` to fetch and store bot username | Bot Token | `access_token`=bot token, `metadata.bot_username` |

All "manual paste" inputs are sent over HTTPS to a single edge function `connection-save` that:
1. Verifies the calling user via `Authorization: Bearer <session.access_token>`.
2. Calls a lightweight verification endpoint on the provider (e.g. `me` / `getMe` / Page info) to confirm the token is real.
3. Upserts a row into `public.user_connections` (one row per `user_id` + `service`).
4. Returns `{ ok, account_label, scopes? }`.

## Google OAuth flow (no user-pasted secrets)

```text
User → "Connect Google"
   → opens popup: https://accounts.google.com/o/oauth2/v2/auth?...&redirect_uri=<edge>/google-oauth-callback
   → Google → redirect_uri with ?code=...
   → edge function `google-oauth-callback`:
        - exchanges code for tokens (uses server secret GOOGLE_CLIENT_SECRET)
        - upserts into user_connections
        - postMessage to opener, then window.close()
   → settings page refetches connection list
```

Scopes requested (single consent screen):
```
openid email profile
https://www.googleapis.com/auth/gmail.modify
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/calendar
https://www.googleapis.com/auth/documents
https://www.googleapis.com/auth/spreadsheets
https://www.googleapis.com/auth/youtube
```

A second edge function `google-token-refresh` is called on-demand by tool functions when `expires_at < now()` and uses the stored `refresh_token`.

## Files to add / change

**New**
- `src/pages/ConnectionsPage.tsx` — route `/agent/connections`, lists all services, dialogs.
- `src/components/connections/ConnectionCard.tsx` — single service row.
- `src/components/connections/ConnectDialog.tsx` — generic dialog; renders OAuth button OR token form based on service config.
- `src/components/connections/connectionConfig.ts` — per-service metadata (label, icon, fields, scopes, help text, link to where to find the token).
- `src/hooks/useConnections.ts` — fetch/insert/delete on `user_connections`, real-time subscription.
- `supabase/functions/google-oauth-start/index.ts` — builds the Google auth URL with state.
- `supabase/functions/google-oauth-callback/index.ts` — exchanges code, stores tokens, posts message back.
- `supabase/functions/google-token-refresh/index.ts` — internal helper for tool functions.
- `supabase/functions/connection-save/index.ts` — verifies + upserts manual-paste tokens.
- `supabase/functions/connection-test/index.ts` — pings the provider with the stored token and returns ok/fail.

**Edited**
- `src/App.jsx` (or router file) — register `/agent/connections` (protected route).
- `src/components/cowork/CoWorkLayout.tsx` / `ConnectorPanel.tsx` — replace "Soon" chips with real status pulled from `user_connections`; clicking a connector opens `ConnectDialog` instead of toasting "Coming soon"; add a "Manage all" link to `/agent/connections`.
- `src/components/aichat/SettingsModal.tsx` — add a new tab **Connections** that links to `/agent/connections` (so it's also discoverable from the global settings).
- `src/stores/coworkStore.ts` — drop the local `connectors` array; derive from DB hook.
- `supabase/config.toml` — add the 5 new functions with `verify_jwt = true` for `connection-save` / `connection-test` and `verify_jwt = false` for `google-oauth-callback` (Google calls it without a JWT).

## Secrets to add (one-time, via secret prompt — never in code)

Already present: `GITHUB_CLIENT_ID/SECRET`, `OPENROUTER_API_KEY`.
Will request:
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_OAUTH_REDIRECT_URL` (= `https://flqwpuixevufwxfktdxg.supabase.co/functions/v1/google-oauth-callback`)

For Facebook / LinkedIn / WhatsApp / Telegram **no app-level secret is needed in v1** — each user supplies their own token. (You previously pasted tokens in chat: those must be rotated and then entered through the new UI by the account owner; we will not hardcode them.)

## Security

- Tokens never touch the browser after submission — sent only over HTTPS to the edge function and stored server-side.
- `user_connections` already has correct RLS (`auth.uid() = user_id` for select/insert/update/delete); we will rely on it.
- All edge functions that read/write tokens require the user's JWT and use it to derive `user_id` (no trust of client-supplied IDs).
- The OAuth callback function validates a signed `state` parameter that includes the user id + a 10-minute TTL HMAC (signed with `INTERNAL_WEBHOOK_SECRET`, already present).
- "Test connection" returns only `{ ok, account_label }` — never the token.
- Disconnect deletes the row immediately; tool functions that try to use a missing connection return a structured error so the Agent can ask the user to reconnect.

## How the Agent uses the connections (existing `cowork-agent` integration)

The orchestrator's tool definitions (`gmail_send`, `drive_upload`, `fb_post`, `linkedin_post`, `wa_send`, `telegram_send`, ...) will, on each invocation:
1. Read the user's row from `user_connections` for that service.
2. If absent → return `{ error: "not_connected", service }` so the Agent replies "Please connect <service> in /agent/connections first."
3. If Google and `expires_at < now()` → call `google-token-refresh` and update the row.
4. Make the actual provider API call with the freshest token.

This keeps tokens out of the LLM context entirely.

## Out of scope for this step (tracked for later)

- Full Facebook Login / LinkedIn OAuth flows (require Meta/LinkedIn app review).
- Per-connection scope downgrade UI.
- Multi-account per service (v1 = one account per user per service; the table's lack of a uniqueness constraint will be tightened with `unique (user_id, service)` in a small follow-up migration).

## Approval needed

After you approve, I will:
1. Run a tiny migration to add `unique (user_id, service)` on `user_connections`.
2. Prompt you for the 3 Google secrets.
3. Build the page, dialogs, hook, and 5 edge functions exactly as listed above.
