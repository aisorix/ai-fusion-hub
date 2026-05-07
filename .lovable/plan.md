## Goal

Switch the attachment analysis model in the main chat (and multi-window chat, which uses the same `chatApi`/`chat` edge function) from **GPT-5.4 Nano** to **Google Gemini 2.5 Pro**, and apply a **1x token cost multiplier** whenever attachments are analyzed.

## Current behavior (verified)

- `supabase/functions/chat/index.ts` runs a 2-stage pipeline when the last user message has images or files:
  - Stage 1 analyzer: `ANALYZER_MODEL = 'openai/gpt-5.4-nano'`
  - Stage 2 responder: user's selected model
- `src/hooks/useAIChat.ts` computes `finalMultiplier = activeMultiplier` (model multiplier only) and calls `updateTokenUsage(inputTokens, outputTokens, finalMultiplier)`. Attachments do not currently add any extra cost.
- Both `ChatArea` (single chat) and `MultiWindowChat` route through the same `chat` edge function, so one change covers both.

## Changes

### 1. Edge function — switch analyzer to Gemini 2.5 Pro

File: `supabase/functions/chat/index.ts`

- Change `const ANALYZER_MODEL = 'openai/gpt-5.4-nano'` → `'google/gemini-2.5-pro'`.
- Update the analysis block heading from "(from GPT-5.4 Nano)" → "(from Gemini 2.5 Pro)".
- Update the comment header (lines 9-11) and the `console.log` strings to reflect Gemini 2.5 Pro.
- Keep the `skipAnalyzer` self-check working (skip if user already selected Gemini 2.5 Pro).
- Keep `max_tokens: 4096` and `stream: false` for the analyzer call.

### 2. Client — apply 1x multiplier when attachments are present

File: `src/hooks/useAIChat.ts`

- After computing `hasAttachments` and `finalMultiplier`, add:
  ```ts
  const ATTACHMENT_ANALYSIS_MULTIPLIER = 1;
  const effectiveMultiplier = hasAttachments
    ? finalMultiplier * ATTACHMENT_ANALYSIS_MULTIPLIER
    : finalMultiplier;
  ```
- Replace every `updateTokenUsage(inputTokens, outputTokens, finalMultiplier)` call (and the cached-response one) with `effectiveMultiplier`.
- Update the existing `console.log` to surface the 1x note when attachments are present.
- Keep `shouldCache = finalMultiplier > 1 && !hasAttachments` (no caching for attachment turns — already correct).

## Out of scope

- Tool pages (Imagine, Deck, Health, Agro, FlowBuilder, Legends, Agent) have their own analysis pipelines and are not affected by this request, which targets "main chatbox & multichatbox".
- No DB / UI / model-list changes. The user-visible selected model (multiplier badge) does not change; the 1x is applied silently to token deduction, matching project memory for silent backend behavior.

## Notes

- `MultiWindowChat` uses the same `chatApi.sendMessageStream` → `chat` edge function, so both flows automatically pick up the Gemini 2.5 Pro analyzer and the 1x cost via the shared hook.
- Keys: `OPENROUTER_API_KEY` already configured; `google/gemini-2.5-pro` is a supported OpenRouter model, no new secrets needed.