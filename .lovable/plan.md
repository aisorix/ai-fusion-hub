## Problem

Right now Sorix Agent only **streams plain text** from the LLM. The `cowork-agent` edge function has no tool/function-calling logic, so when you say "send a Telegram message", the model can only reply with copy-paste instructions. The connection tokens you stored are never read or used during a chat turn.

## Goal

When the user types a request like "send a Telegram message to khalid roommate saying ok agent working", the agent should:
1. Detect the intent.
2. Call the matching server-side tool (`telegram_send_message`).
3. Use the user's stored connection token to actually perform the action.
4. Report back "Message sent ✅" with a short confirmation in chat and a Task Monitor entry.

## What gets built

### 1. Tool registry on the edge function (`supabase/functions/cowork-agent/index.ts`)

Rewrite the function to use OpenRouter **function-calling** (tools array) instead of plain streaming. Loop until the model emits a final answer:

```text
user prompt
  -> model decides tool(s)
  -> edge fn runs tool with stored token
  -> tool result fed back to model
  -> model produces final reply (streamed)
```

Tools exposed to the model (all execute server-side using `user_connections` row for `auth.uid()`):

- `telegram_send_message(text, chat_id?, chat_username?)`
- `telegram_list_recent_chats()` — used to resolve names like "khalid roommate" to a chat_id
- `gmail_send_email(to, subject, body)`
- `gmail_list_recent(max?)`
- `drive_list_files(query?)`, `drive_create_doc(title, content)`
- `calendar_create_event(title, start, end, attendees?)`, `calendar_list_upcoming()`
- `facebook_page_post(message, link?)`
- `linkedin_create_post(text)`
- `whatsapp_send_message(to, text)` (template + freeform)
- `web_search(query)` — generic helper so non-connector questions still work

Each tool handler:
1. Reads token from `public.user_connections` (service-role client, scoped by `user_id`).
2. If not connected → returns `{ error: "not_connected", service }` so the model tells the user to open `/agent/connections`.
3. For Google: uses access_token; if expired, calls refresh helper before the API call.
4. For Telegram resolve-by-name: pulls last ~100 updates via `getUpdates`, fuzzy-matches the title against `chat.title` / `chat.first_name + last_name` / `username`. If multiple matches → returns ambiguity list so model asks user to pick.

### 2. Streaming protocol upgrade

Edge function emits SSE events the existing client already understands:
- `{type:"tool_use", tool_name, description, steps}` — when a tool starts (drives Task Monitor card)
- `{type:"content", text}` — final answer tokens
- `{type:"error", message}` — failures

`useCoWorkAgent.ts` already handles all three; only minor tweak: mark the task as `failed` when the final tool result is an error.

### 3. Google token refresh

Add `supabase/functions/_shared/googleTokens.ts` with `getValidGoogleToken(userId)`:
- Reads row, returns access_token if `expires_at > now()+60s`.
- Else POSTs to `https://oauth2.googleapis.com/token` with refresh_token + GOOGLE_CLIENT_ID/SECRET, updates row, returns new token.

Used by all Google tool handlers (Gmail, Drive, Calendar, Docs, Sheets, YouTube).

### 4. System prompt rewrite

New prompt makes execution behaviour explicit:

> You are Sorix Agent. You DO things, you don't describe them. When the user asks you to send/post/create/schedule something, IMMEDIATELY call the appropriate tool. Never tell the user to copy-paste, open an app, or do it themselves — that's your job. If a required service isn't connected, briefly tell them to open Connections, don't lecture about security. After a tool succeeds, reply in 1–2 short sentences confirming what you did. Match the user's language (English/Bangla).

### 5. UI confirmation flow (light)

For destructive/public actions (Facebook post, LinkedIn post, WhatsApp send, Email send), the tool emits a `tool_use` step with `requires_approval: true` so the existing `ApprovalModal` (already in the project) shows the drafted content with **Send** / **Cancel** before the actual API call. Telegram bot messages and internal lookups don't need approval — they execute immediately so the experience feels snappy.

### 6. Empty-state quick prompts

Update `CommandCenter` empty state cards to reflect real capabilities:
- "Send a Telegram message to …"
- "Email my team a summary of …"
- "Post on my Facebook Page about …"
- "Schedule a meeting tomorrow 3pm with …"

## Files to change / add

```text
supabase/functions/cowork-agent/index.ts          (rewrite: tool-calling loop)
supabase/functions/_shared/googleTokens.ts        (new: refresh helper)
supabase/functions/_shared/agentTools.ts          (new: tool definitions + executors)
src/hooks/useCoWorkAgent.ts                       (small: handle requires_approval + failed state)
src/components/cowork/CommandCenter.tsx           (empty-state prompts)
```

No DB schema changes needed — `user_connections` already has everything.

## Out of scope (stays "coming soon")

- Browser automation (needs headless browser infra) — will surface as "I can't drive a real browser yet, but I can post directly via API."
- Instagram, TikTok, YouTube uploads (need extra OAuth scopes + Meta app review).

## Result for the user

Typing **"sent message on telegram khalid roommate to ok agent working"** will:
1. Show a Task Monitor card "Sending Telegram message" with steps Resolve recipient → Send.
2. Actually deliver the message via your connected bot.
3. Reply "Sent to Khalid Roommate ✅" — no copy-paste instructions.

Approve to implement.