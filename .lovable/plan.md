
## Sorix Agent — Autonomous Digital Co-Worker (Master Plan)

This plan turns Sorix Agent into a true autonomous worker: the user types one prompt, the agent plans → calls tools → reports back. Tools include Google Workspace, Gmail, YouTube, Facebook/Instagram, LinkedIn, WhatsApp Cloud, Telegram, and a Python `browser-use` worker for tasks that have no API.

---

## 0. Pre-requisite: Security (do this first)

You pasted **live access tokens, client secrets, and refresh tokens in chat**. Chat history is not a vault — these must be considered leaked.

Action before we ship anything:
1. **Rotate** every credential below in its provider console.
2. Re-issue the rotated values; we'll store them in Lovable Cloud Secrets (never in code, never in the repo, never in the frontend).

Secrets we will register (names only — values entered through the secure secret prompt):

```text
# Google (single OAuth client covers Gmail, Drive, Sheets, Calendar, Docs, YouTube)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REFRESH_TOKEN          # service-account-style "developer" token (your account)
# Per-end-user tokens are stored in DB (see §3), not as secrets.

# Meta (Facebook Page + Instagram Business)
META_PAGE_ACCESS_TOKEN
META_IG_BUSINESS_ACCOUNT_ID

# LinkedIn
LINKEDIN_CLIENT_ID
LINKEDIN_CLIENT_SECRET
LINKEDIN_ACCESS_TOKEN
LINKEDIN_AUTHOR_URN

# WhatsApp Cloud API
WA_PHONE_NUMBER_ID
WA_PERMANENT_TOKEN

# Telegram
TELEGRAM_BOT_TOKEN

# Browser-use Python worker
BROWSER_WORKER_URL            # https URL of the FastAPI worker
BROWSER_WORKER_SECRET         # shared HMAC secret
# OPENROUTER_API_KEY already exists.
```

---

## 1. Fix the immediate runtime error

`Failed to fetch dynamically imported module … ChatPage.tsx` is a stale Vite dep-cache issue (chunk hash `v=61d60115`). It is not a code bug in `ChatPage.tsx`. Fix in implementation phase by:
- Touching `src/pages/ChatPage.tsx` with a no-op change (forces re-bundle), and
- Verifying `vite.config.ts` has no broken `optimizeDeps` entries.

If it persists post-rebuild we'll inspect the Vite error overlay.

---

## 2. Architecture

```text
┌──────────────────────────────────────────────────────────────────┐
│ Browser (React)                                                  │
│  /agent  → CoWorkLayout                                          │
│   • Chat panel  • Task monitor  • Connector panel  • Artifacts   │
└──────────────┬───────────────────────────────────────────────────┘
               │ supabase.functions.invoke('sorix-agent-orchestrator')
               ▼
┌──────────────────────────────────────────────────────────────────┐
│ Supabase Edge Function: sorix-agent-orchestrator                 │
│  Loop: Plan (gpt-5.2) → choose tool → call tool fn → observe →   │
│        repeat (max 12 hops) → final reply (streamed SSE)         │
│                                                                  │
│  Tool registry (all are sibling edge functions):                 │
│   • tool-web-search          (Perplexity / sonar)                │
│   • tool-google-gmail        (send / read / search)              │
│   • tool-google-drive        (list / read / upload)              │
│   • tool-google-sheets       (read / append / update)            │
│   • tool-google-calendar     (create / list events)              │
│   • tool-google-docs         (create / read)                     │
│   • tool-youtube             (upload / list / analytics)         │
│   • tool-meta-facebook       (create post on Page)               │
│   • tool-meta-instagram      (create IG post via Graph)          │
│   • tool-linkedin            (post share, get profile)           │
│   • tool-whatsapp            (send template / text message)      │
│   • tool-telegram            (sendMessage / getUpdates)          │
│   • tool-browser-task        (POST → Python browser-use worker)  │
│   • tool-schedule            (pg_cron job for recurring goals)   │
└──────────────┬───────────────────────────────────────────────────┘
               │ (only for browser tasks)
               ▼
┌──────────────────────────────────────────────────────────────────┐
│ External Python FastAPI worker (you host on Render/Fly/VPS)      │
│  POST /run  { task, headless }                                   │
│   → browser-use Agent + Playwright (local Chromium)              │
│   → LLM via OpenRouter (anthropic/claude-3.5-sonnet)             │
│   → returns { result, screenshots[], steps[] }                   │
│  HMAC-signed using BROWSER_WORKER_SECRET                         │
└──────────────────────────────────────────────────────────────────┘
```

Key principles:
- **One orchestrator, many tools** — adding a service = adding one edge function + one tool spec, no orchestrator changes.
- **Per-user OAuth for Google** (each end-user connects their own Gmail/Drive). The dev tokens you pasted are the **fallback / your-own-account** credentials, used only for testing and for "connect-with-Sorix-account" demo.
- **Connector panel is the single source of truth** for which tools the agent may use for that user. Disconnected = orchestrator hides the tool from the LLM tool list.

---

## 3. Database changes (migrations)

```sql
-- Replace cowork_connectors usage to actually store credentials
create table public.user_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  service text not null,            -- 'google','facebook','instagram','linkedin','whatsapp','telegram','youtube'
  status text not null default 'connected',
  access_token text,                -- encrypted at rest by Postgres TDE
  refresh_token text,
  expires_at timestamptz,
  scopes text[],
  external_account_id text,         -- e.g. IG business id, LinkedIn URN, page id
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, service)
);
alter table public.user_connections enable row level security;
create policy "own connections select" on public.user_connections for select using (auth.uid() = user_id);
create policy "own connections write"  on public.user_connections for all    using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Agent run log (for replay + auditing)
create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task_id uuid,
  prompt text not null,
  steps jsonb not null default '[]',     -- [{tool, args, result, ts}]
  status text not null default 'running',-- running|done|error
  result text,
  tokens_used int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.agent_runs enable row level security;
create policy "own runs" on public.agent_runs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Scheduled goals (pg_cron driven)
create table public.agent_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  cron text not null,                    -- '0 9 * * 1'
  prompt text not null,
  enabled boolean not null default true,
  last_run_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.agent_schedules enable row level security;
create policy "own schedules" on public.agent_schedules for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

---

## 4. OAuth flows for end-users (so each user connects their own accounts)

For every social/google service we add a pair of edge functions:

- `oauth-{service}-start`  → returns the provider's auth URL (uses our `*_CLIENT_ID` secret).
- `oauth-{service}-callback` → exchanges code for tokens, upserts into `user_connections`.

Frontend `ConnectorPanel.tsx` is upgraded so each card's button:
1. If `coming_soon` → toast (current behavior).
2. If supported & disconnected → opens `oauth-{service}-start` URL in popup.
3. If connected → "Disconnect" deletes the row.

This uses **your own OAuth apps** (the client ID/secrets you provided), so end-users see "Sign in with Google to AI Sorix" — no shared accounts, no leaked tokens.

WhatsApp / Telegram / Meta Page tokens that you pasted are **org-owned** (your business account), so they stay as global secrets and the agent uses them on behalf of all users (or only when the user has explicitly enabled "use Sorix's WhatsApp number"). This is a UX decision — see §9.

---

## 5. Orchestrator (`supabase/functions/sorix-agent-orchestrator`)

- Streaming SSE response (already pattern in `cowork-agent`).
- Builds tool list from `user_connections` for the current user.
- Calls OpenRouter `gpt-5.2` with OpenAI-style `tools` array.
- Loop:
  ```text
  while not done and hops < 12:
      resp = llm.chat(messages, tools)
      if resp.tool_calls: run each → append role:'tool' result → continue
      else: stream final assistant text → done
  ```
- Each tool call = `supabase.functions.invoke('tool-...', { body, headers: { Authorization }})` so RLS still applies (user identity preserved).
- Persists every step into `agent_runs.steps` so the UI can replay.

---

## 6. Per-tool edge functions (specs)

All follow the same shape: input zod-validated, output `{ ok, data?, error? }`. Examples:

- `tool-google-gmail`
  - actions: `send`, `search`, `read_message`
  - reads `user_connections` where service='google', refreshes token if expired, calls `https://gmail.googleapis.com/gmail/v1/...`.
- `tool-meta-facebook`
  - action: `create_post(message, link?, image_url?)`
  - uses `META_PAGE_ACCESS_TOKEN` against `graph.facebook.com/v21.0/{page_id}/feed`.
- `tool-meta-instagram`
  - action: `publish(image_url, caption)` — two-step Graph API (create container → publish).
- `tool-linkedin`
  - action: `share(text, link?)` — `POST /v2/ugcPosts` with `LINKEDIN_AUTHOR_URN`.
- `tool-whatsapp`
  - action: `send_text(to, body)` — `POST /v21.0/{WA_PHONE_NUMBER_ID}/messages`.
- `tool-telegram`
  - action: `send(chat_id, text)` — direct Bot API (no gateway needed).
- `tool-youtube`
  - action: `upload`, `list_my_videos`, `analytics`.
- `tool-google-drive`, `tool-google-sheets`, `tool-google-calendar`, `tool-google-docs` — same pattern, OAuth-refresh helper shared in `_shared/google.ts`.

---

## 7. Browser automation (Python `browser-use` worker)

This **cannot** live inside Supabase edge functions (they're Deno, no Playwright). We deploy a tiny FastAPI service.

Repo: `browser-worker/` (separate deploy, e.g. Render free tier, Fly.io, or your VPS).

```python
# browser-worker/main.py
import os, hmac, hashlib
from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel
from browser_use import Agent, Browser, BrowserConfig
from langchain_openai import ChatOpenAI

app = FastAPI()
SECRET = os.environ["BROWSER_WORKER_SECRET"].encode()

class TaskIn(BaseModel):
    task: str
    headless: bool = True

def verify(sig: str, body: bytes):
    expected = hmac.new(SECRET, body, hashlib.sha256).hexdigest()
    if not hmac.compare_digest(sig, expected):
        raise HTTPException(401, "bad signature")

@app.post("/run")
async def run(payload: TaskIn, x_signature: str = Header(...)):
    verify(x_signature, payload.model_dump_json().encode())

    llm = ChatOpenAI(
        model="anthropic/claude-3.5-sonnet",
        base_url="https://openrouter.ai/api/v1",
        api_key=os.environ["OPENROUTER_API_KEY"],
        default_headers={
            "HTTP-Referer": "https://www.aisorix.com",
            "X-Title": "Sorix Agent",
        },
    )
    browser = Browser(config=BrowserConfig(headless=payload.headless))
    agent = Agent(task=payload.task, llm=llm, browser=browser)
    try:
        history = await agent.run(max_steps=25)
        return {"ok": True, "result": history.final_result(), "steps": len(history.history)}
    except Exception as e:
        return {"ok": False, "error": str(e)}
    finally:
        await browser.close()
```

`requirements.txt`: `fastapi uvicorn browser-use langchain-openai playwright`
Dockerfile installs `playwright install --with-deps chromium`.

Edge-side `tool-browser-task` just:
1. HMAC-signs body with `BROWSER_WORKER_SECRET`.
2. `fetch(BROWSER_WORKER_URL + '/run', { method:'POST', headers:{'X-Signature':sig}, body })`.
3. Returns result to orchestrator.

No "Browserless" anywhere. Local Playwright only.

---

## 8. Scheduling (24/7 autonomy)

- `pg_cron` runs `agent-cron-tick` every minute.
- Function scans `agent_schedules` where the cron expression matches and `enabled=true`, then invokes orchestrator with `prompt` as the user. Updates `last_run_at`.
- UI: a small "Schedules" tab in `/agent` lets the user say "every Monday 9am, summarize my Gmail and post to LinkedIn".

---

## 9. UI changes (frontend)

- `src/components/cowork/ConnectorPanel.tsx` — replace mock toggle with real OAuth popup flow + status from `user_connections`.
- `src/stores/coworkStore.ts` — fetch connectors from DB on mount instead of hard-coded list.
- `src/components/cowork/CoWorkLayout.tsx` — add **Artifacts** side panel (renders code blocks, tables, screenshots returned by tools) and a **Steps timeline** showing each tool call live (already half-implemented in TaskMonitor — extend it).
- New `src/components/cowork/ScheduleManager.tsx` — list/add/delete entries in `agent_schedules`.
- New `src/components/cowork/BrowserPreviewModal.tsx` — shows screenshots returned by `tool-browser-task`.
- Approval mode: when a tool is "destructive" (send email, post to LinkedIn, send WhatsApp), orchestrator pauses and emits `requires_approval` SSE event → existing `ApprovalModal.tsx` fires → user approves → orchestrator resumes. Setting toggle: **Auto-pilot** vs **Co-pilot**.

---

## 10. Implementation phases (ship order)

| Phase | Deliverable | Depends on |
|---|---|---|
| 0 | Rotate leaked secrets, register all secrets in Lovable Cloud | you |
| 1 | DB migrations (§3) + fix ChatPage import error | — |
| 2 | `sorix-agent-orchestrator` skeleton with **2 tools** (web_search, telegram) end-to-end streaming | 1 |
| 3 | Connector panel rewired to `user_connections` + Google OAuth start/callback + Gmail/Drive/Sheets/Calendar/Docs/YouTube tools | 2 |
| 4 | Meta (FB Page + IG), LinkedIn, WhatsApp tools | 2 |
| 5 | Browser-use Python worker repo + `tool-browser-task` edge fn | 2, BROWSER_WORKER_URL provisioned |
| 6 | Co-pilot approval flow + Artifacts panel + Steps timeline | 2 |
| 7 | `agent_schedules` + `pg_cron` 24/7 jobs | 2 |
| 8 | Polish: token-cost display, run history page, error toasts | all |

---

## 11. What I need from you to start

1. Confirm you've **rotated** the leaked tokens. I'll then trigger the secret-prompts in order.
2. Confirm where you'll host the Python `browser-worker` (Render / Fly / VPS) so we know the `BROWSER_WORKER_URL`. If you want, we ship Phases 1–4 + 6–8 first and add browser automation in Phase 5 once the worker is deployed.
3. Approve this plan to begin Phase 1 (DB + ChatPage fix + orchestrator skeleton).
