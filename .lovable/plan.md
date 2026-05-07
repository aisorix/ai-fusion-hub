## Sorix Agent — Production Completion Plan

Build out Sorix Agent in 6 sequential phases. Each phase is independently shippable, tested, and leaves the product in a working state.

---

### Phase 1 — Backend Unification (Tool Layer)
Goal: One agent backend with all tools available. Kill the split-brain between `cowork-agent` (legacy OAuth: Gmail/Telegram/Socials) and `agent-router` (Nango + Browserless).

**Backend work**
- In `supabase/functions/agent-router/index.ts`, import the legacy tool definitions from `_shared/agentTools.ts` and merge them into the tool list passed to OpenRouter.
- Keep Nango proxy + Browserless + custom HTTP as routed paths.
- Add a server-side capability check: each tool descriptor declares which provider it needs (`gmail`, `telegram`, `nango:slack`, etc.). Before exposing a tool to the model, query `user_integrations` / `user_connections` for that user and only include tools they have connected.
- On `tool_call`, dispatch:
  - `gmail.*`, `telegram.*` → existing OAuth handlers from `_shared/agentTools.ts`
  - `nango.*` → `nangoProxy`
  - `web.scrape`, `web.act` → Browserless
  - `http.call` → custom integrations
- Standardize the streaming envelope: `tool_use` (start), `tool_progress` (step), `tool_result` (ok/err with summary), `route_decision`, `content`, `error`.
- Deprecate `cowork-agent` (keep file but route nothing to it; remove after Phase 3 is verified).

**Frontend work**
- `useCoWorkAgent.ts` already calls `agent-router` — no change to URL, only to event handling (Phase 2).

---

### Phase 2 — Real Telemetry (Remove Simulation)
Goal: Task Monitor shows real progress, not `setTimeout` fakes.

- Delete the `for (i; setTimeout 800ms)` simulation loop in `useCoWorkAgent.ts`.
- Create one `CoWorkTask` per `tool_use` event with `steps: []`.
- On each `tool_progress` event `{ task_id, step_label, status, detail }` → push/update step in the matching task.
- On `tool_result` `{ task_id, ok, summary }` → mark task `completed` or `failed` and store `result`.
- Backend emits these events from inside each tool handler (one per logical sub-step: "Authenticating", "Fetching", "Parsing", etc.).

---

### Phase 3 — Persistence (Tasks + Conversation Reload)
Goal: Refresh-safe state.

**DB (migration)**
- `cowork_tasks` table already exists. Backend writes a row at `tool_use`, updates `steps`/`status` at `tool_progress` / `tool_result`. Frontend subscribes via Supabase Realtime so multiple tabs stay in sync.

**Frontend**
- On `CoWorkPage` mount, load last 50 `cowork_messages` and active/recent `cowork_tasks` for `auth.uid()` into the Zustand store.
- Add a "Clear conversation" action that soft-deletes both.
- Realtime subscription on `cowork_tasks` (filter `user_id=eq.<uid>`) → update store on INSERT/UPDATE.

---

### Phase 4 — Approval Flow for Destructive Actions
Goal: Nothing irreversible (send email, post to socials, delete files, send Telegram message) happens without explicit user approval.

- Tag each tool descriptor with `requires_approval: true | false`.
- When the model calls a destructive tool, the backend emits `approval_request` event with `{ id, tool, args_preview, description }` and **pauses** the tool call (stores pending state in `cowork_tasks.status='blocked'` with the args in `steps`).
- Frontend `ApprovalModal` (already exists) opens, user clicks Approve/Reject.
- Frontend POSTs to a new `agent-approval` edge function with `{ task_id, decision }`.
- That function resumes by either executing the tool (server-side, using stored args) or marking the task `failed` and emitting a follow-up assistant message: "Cancelled by user."

---

### Phase 5 — Attachments + Voice
Goal: The `+` button and Mic on the Command Center actually work.

**Attachments**
- Create storage bucket `cowork-uploads` (private) with RLS: `auth.uid() = (storage.foldername(name))[1]::uuid`.
- On file pick in `CommandCenter.tsx`, upload to `cowork-uploads/<uid>/<uuid>-<filename>`, get signed URL, attach to outgoing message payload as `attachments: [{ url, mime, name, size }]`.
- Backend forwards attachments to vision-capable models (Gemini 2.5 Pro) for images, and to `lib/fileParser` equivalent (port to Deno) for PDFs/DOCX/TXT — parsed text is appended to the user message as context.

**Voice**
- Wire `useSpeechRecognition` to the existing Mic button in `CommandCenter`. Toggle recording, append transcript to the textarea on stop. Visual-only mic stays as fallback when API unsupported.

---

### Phase 6 — Smart Clipboard + Polish
- `SmartClipboard.tsx` currently is a UI shell. Wire it: on detected URL/email/code in clipboard, surface "Use this with Sorix Agent?" chip → prefill prompt with a templated action ("Summarize this URL", "Draft a reply to…").
- Empty-state action cards (2x2 grid) → each card triggers a templated prompt + auto-selects the relevant connector if missing (deep-link to `/agent/integrations`).
- Final pass: error toasts use the existing `ERROR_TOASTS` map; remove any remaining `console.error` noise; add loading skeletons for first message render.

---

### Technical Notes
- **No new tables needed** — `cowork_tasks`, `cowork_messages`, `user_integrations`, `user_connections` already exist with correct RLS.
- **Realtime**: `ALTER PUBLICATION supabase_realtime ADD TABLE public.cowork_tasks;` (one-line migration).
- **Edge functions to add**: `agent-approval` (Phase 4). Edge functions to modify: `agent-router` (Phases 1, 2, 4, 5).
- **Storage**: one new bucket `cowork-uploads` (Phase 5).
- **Frontend files most touched**: `src/hooks/useCoWorkAgent.ts`, `src/pages/CoWorkPage.tsx`, `src/components/cowork/CommandCenter.tsx`, `src/components/cowork/TaskMonitor.tsx`, `src/components/cowork/ApprovalModal.tsx`, `src/components/cowork/SmartClipboard.tsx`.
- **Streaming event contract** (single source of truth, used by all phases):
  ```text
  data: {"type":"route_decision","path":"api|browser","reason":"..."}
  data: {"type":"tool_use","task_id":"<uuid>","tool":"gmail.send","description":"..."}
  data: {"type":"tool_progress","task_id":"<uuid>","label":"Authenticating","status":"done"}
  data: {"type":"approval_request","task_id":"<uuid>","tool":"gmail.send","args_preview":{...}}
  data: {"type":"tool_result","task_id":"<uuid>","ok":true,"summary":"Sent to alice@..."}
  data: {"type":"content","text":"..."}
  data: {"type":"error","code":"rate_limit","message":"..."}
  ```

---

### UX Principles Applied Throughout
- Silent backend (per project memory) — no info toasts for routing, only error toasts.
- Task Monitor is the single source of truth for "what is the agent doing right now."
- Approval modal is blocking and explicit; never auto-dismiss.
- Empty state guides first-time users into a connected workflow within 2 clicks.

---

### Suggested execution order
Phase 1 → Phase 2 → Phase 3 (ship checkpoint: agent works end-to-end with real telemetry and persistence) → Phase 4 (safety) → Phase 5 (capability) → Phase 6 (polish).

Approve to start with **Phase 1** (Backend Unification).