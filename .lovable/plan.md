# Fix: LLM model selector not working in Sorix Agent

## Problem

On `/agent`, picking a model from the dropdown (Gemini, Claude, GPT-5, Llama) has no effect. Every request still goes to a hardcoded model, which is currently failing and producing the "AI returned an unexpected response" error shown in the screenshot.

## Root cause

- `src/hooks/useCoWorkAgent.ts` correctly POSTs `{ messages, model: selectedModel }` to the `agent-router` edge function.
- `supabase/functions/agent-router/index.ts` only destructures `messages` from the request body — `model` is dropped on the floor.
- It then calls `openrouterChatWithFallback(...)` from `supabase/functions/_shared/openrouter.ts`, which hardcodes `PRIMARY_MODEL = "anthropic/claude-4.5-sonnet"` and falls back to `google/gemini-2.5-pro`. The user's selection never reaches OpenRouter.
- `anthropic/claude-4.5-sonnet` is also a deprecated/retired slug on OpenRouter, which is why even a simple "hello" returns the unexpected-response error.

## Fix

### 1. `supabase/functions/_shared/openrouter.ts`

- Update `openrouterChatWithFallback` to accept an optional `preferredModel` argument.
- Use `preferredModel ?? PRIMARY_MODEL` for the first attempt.
- Update `PRIMARY_MODEL` to a current valid slug (`anthropic/claude-sonnet-4`) so the default also works.

### 2. `supabase/functions/agent-router/index.ts`

- Read `model` from the request body alongside `messages`.
- Pass it through: `openrouterChatWithFallback({ messages: convo, tools: TOOLS, tool_choice: "auto", max_tokens: 2048 }, model)`.
- Keep the existing 429 / 5xx fallback to `google/gemini-2.5-pro`.

### 3. `src/components/cowork/CommandCenter.tsx`

- The model list currently includes `anthropic/claude-sonnet-4`, `openai/gpt-5-mini`, `google/gemini-2.5-pro`, `meta-llama/llama-3.3-70b-instruct` — keep these but verify slugs match OpenRouter's current catalog. No code change needed beyond confirming the IDs.

## Verification

1. Open `/agent`, select each model in turn, send "hello".
2. Confirm a normal reply (no warning banner) for each selection.
3. Check edge function logs to confirm the requested model slug is the one sent to OpenRouter.

No DB changes. No UI changes beyond what's already in place.