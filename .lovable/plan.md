## Important constraint up front

Lovable projects run **React + Vite on the frontend** and **Deno-based Supabase Edge Functions on the backend**. There is no Python/FastAPI runtime available in this environment, so I cannot literally ship FastAPI + the `browser-use` Python library inside the project.

The good news: every capability in your spec can be delivered with the same architecture using **Deno edge functions** as the "FastAPI replacement" and **Browserless's REST `/function` and `/scrape` endpoints + Playwright over WebSocket from Deno** for web automation. Nango works identically (REST API + secret key, no public key needed). All your secrets, multi-tenant model, OpenRouter routing and UI flows stay exactly the same.

If you specifically need the Python `browser-use` agent (LLM-driven autonomous browsing), that has to live on a server you host outside Lovable (Render/Fly/Railway). I can still wire the frontend + edge functions to call it. Tell me which option you want — I'll proceed with the Deno + Browserless approach by default since it keeps everything inside your Lovable project.

---

## What gets built

### 1. Frontend — Integrations Hub + Command Center

**New route `/agent/integrations`** (replaces today's `/agent/connections` UX with a richer hub).

Cards for: GitHub, Gmail, Google Drive, Google Calendar, Google Docs, Google Sheets, Facebook, Instagram, X/Twitter, LinkedIn, Notion, Canva, WhatsApp, Telegram, Slack (easy to add more).

Each card shows: logo, name, short description, status pill (Connected / Not connected / Expired), last-synced timestamp, Connect / Disconnect button.

**Connect flow (backend-driven, no `@nangohq/frontend`):**
1. Click Connect → frontend calls edge function `nango-connect-start` with `{ provider }`.
2. Edge function uses `NANGO_SECRET_KEY` to create a session token via Nango's REST API (`POST https://api.nango.dev/connect/sessions`) scoped to the user's `auth.uid()` as `end_user.id`.
3. Edge function returns the hosted-auth URL; frontend does `window.location.href = url`.
4. Nango redirects back to `/agent/integrations?connected=<provider>`. The page polls `nango-list-connections` and updates the card to Connected.

**Command Center upgrade** (`src/components/cowork/CommandCenter.tsx`):
- Keep the current chat input and Task Monitor.
- Add a live "Execution Log" stream panel that renders SSE events: `route_decision`, `api_call`, `browser_step` (with screenshot thumbnails when Browserless returns one), `result`, `error`.
- Friendly toasts (Sonner) for rate-limit / timeout / parse errors.

### 2. Backend — Deno edge functions (FastAPI-equivalent)

```text
supabase/functions/
  nango-connect-start/      POST  → returns hosted auth URL for provider
  nango-connect-callback/   GET   → optional, Nango can also redirect straight to /agent/integrations
  nango-list-connections/   GET   → lists user's connections from Nango
  nango-disconnect/         POST  → deletes a connection in Nango
  nango-proxy/              POST  → server-side proxy: { provider, method, endpoint, body } → calls Nango Proxy with stored connection
  agent-router/             POST  → main task router (replaces today's cowork-agent for new flows)
  browserless-run/          POST  → executes a Playwright script on Browserless
```

**`agent-router` logic (the "Hybrid" brain):**
1. Receive `{ prompt, history }` for the authenticated user.
2. Call OpenRouter with a router system prompt + the list of the user's *connected* providers and the available tools (`nango_proxy`, `browserless_run`, `web_search`, plus the existing Telegram/Gmail tools).
3. Stream SSE events back:
   - `{type:"route_decision", path:"api"|"browser", reason}`
   - `{type:"tool_use", name, args}`
   - `{type:"tool_result", name, ok, summary}`
   - `{type:"content", text}` for the final answer
4. Path A (API): call `nango-proxy` internally — never expose access tokens to the browser.
5. Path B (Browser): build a Playwright script (or pass a high-level goal to a small in-function loop) and POST it to `browserless-run`.

**`browserless-run`:**
- Connects to `wss://production-sfo.browserless.io?token=${BROWSERLESS_API_KEY}` using Playwright's Deno-compatible client (or Browserless's REST `/function` endpoint, which is simpler and what I'll use first — it accepts a JS function string and returns the result + optional screenshot).
- Returns `{ data, screenshotUrl?, logs }`.
- Hard timeout 60s, returns structured error on timeout.

### 3. Database

Light additions only — most state lives in Nango itself.

```text
public.user_integrations
  id uuid pk
  user_id uuid not null              -- auth.uid()
  provider text not null             -- 'github','gmail','notion',...
  nango_connection_id text not null  -- == user_id (multi-tenant: one per user per provider)
  status text default 'connected'
  metadata jsonb default '{}'
  created_at, updated_at
  unique(user_id, provider)

RLS: own rows only (select/insert/update/delete where auth.uid() = user_id)
```

The existing `user_connections` table stays for the manual Telegram/Facebook flow already shipped; new providers go through Nango and `user_integrations`.

### 4. Secrets

I'll add (via the secrets tool, you'll be prompted to confirm values):
- `NANGO_SECRET_KEY` = `18db4172-8f9f-4e36-990a-161abd9ac79d`
- `BROWSERLESS_API_KEY` = `2URoVZcDDcq8dMWd44231cdcbd857bca48f3036ed500fd8cc`
- `OPENROUTER_API_KEY` already exists ✅

Security note: those two keys are now visible to anyone reading this thread. I strongly recommend rotating them in Nango / Browserless dashboards before production.

### 5. OpenRouter config

All `agent-router` LLM calls use:
```text
POST https://openrouter.ai/api/v1/chat/completions
Headers:
  Authorization: Bearer ${OPENROUTER_API_KEY}
  HTTP-Referer:  https://aisorix.com
  X-Title:       Sorix Agent
Model: anthropic/claude-3.5-sonnet
Fallback (on 5xx / rate limit): google/gemini-2.5-pro
```
(Note: `gemini-2.0-pro-exp-02-05` you listed is an experimental ID that's been deprecated on OpenRouter; `gemini-2.5-pro` is the stable equivalent. Tell me if you'd rather hard-pin the experimental one.)

### 6. Error handling

Each edge function returns:
```json
{ "ok": false, "code": "rate_limit"|"browserless_timeout"|"llm_parse"|"nango_auth"|"unknown", "message": "..." }
```
Frontend maps `code` → friendly Sonner toast (e.g. "GitHub is rate-limiting us, try again in a minute").

---

## Files to add / change

```text
supabase/functions/nango-connect-start/index.ts        (new)
supabase/functions/nango-list-connections/index.ts     (new)
supabase/functions/nango-disconnect/index.ts           (new)
supabase/functions/nango-proxy/index.ts                (new)
supabase/functions/browserless-run/index.ts            (new)
supabase/functions/agent-router/index.ts               (new, SSE stream)
supabase/functions/_shared/nango.ts                    (new helper)
supabase/functions/_shared/openrouter.ts               (new helper, with fallback model logic)

supabase/migrations/<ts>_user_integrations.sql         (new table + RLS)

src/pages/IntegrationsPage.tsx                         (new)
src/components/integrations/IntegrationCard.tsx        (new)
src/components/integrations/integrationsCatalog.ts     (new — list of 15+ providers)
src/hooks/useIntegrations.ts                           (new — list/connect/disconnect)
src/components/cowork/CommandCenter.tsx                (extend with execution-log panel)
src/components/cowork/ExecutionLog.tsx                 (new)
src/hooks/useCoWorkAgent.ts                            (point to agent-router, handle new SSE event types)
src/App.jsx                                            (add /agent/integrations route)
```

No changes to today's manual Telegram/WhatsApp/etc. flow — it keeps working alongside the Nango hub.

---

## Result

- One slick **Integrations** page where the user one-clicks to connect any of 15+ apps (Nango handles OAuth, refresh, scopes).
- A Command Center where typing "summarize my last 5 Gmail threads and post the summary to my Notion 'Daily' page" makes the router pick API path, call Gmail via Nango Proxy, call Notion via Nango Proxy, and stream progress back.
- Typing "go to vercel.com pricing and tell me the Pro plan price" makes the router pick Browser path, run a Playwright script on Browserless, and return the extracted text + screenshot.
- All credentials encrypted at Nango; only short-lived tokens are read server-side per request.

Approve and I'll implement, then ask you for the two secret confirmations and run the migration.