# Faster Attachment Analyzer — Switch to GPT-5 mini

Swap the Stage 1 analyzer from `google/gemini-2.5-pro` (slow, top-tier) to `openai/gpt-5-mini` (fast, capable, multimodal). Keep the conditional skip logic so stronger user-selected models still bypass the analyzer entirely. Both the main chatbox and the multi-window chatbox flow through the same `supabase/functions/chat` edge function, so a single backend change covers both surfaces.

## Behavior

| User's selected model | What happens with attachments |
|---|---|
| `openai/gpt-5-mini` | Single call — user model handles it directly (skip analyzer to avoid double work) |
| Weaker / text-only models (gpt-4o-mini, deepseek-chat-v3.1, gemini-2.5-flash-lite, llama-3.x, grok-3-mini, qwen3-coder, perplexity/sonar) | Stage 1: `openai/gpt-5-mini` analyzes attachments → Stage 2: user's selected model writes the answer using that analysis |
| Stronger models (GPT-5, GPT-5.1, GPT-5.2, Claude Sonnet/Opus 4.5, Gemini 2.5 Pro / 3 Flash / 3.1 Pro, Qwen 3 VL / Pro, Grok 4 / 4.1 fast, DeepSeek V3.2, Llama 4 Maverick/Scout, Mistral Large 3, Kimi-K2.5) | No Stage 1. Their own multimodal capability handles the attachments in a single call |

Cost stays at 1x base multiplier (no surcharge). GPT-5 mini is much faster than Gemini 2.5 Pro, so analysis + response latency drops significantly for free/basic users.

## Changes

### 1. `supabase/functions/chat/index.ts` (covers both main chat and multi-window chat)
- `const ANALYZER_MODEL = 'google/gemini-2.5-pro'` → `'openai/gpt-5-mini'`.
- Update header comment from "Google Gemini 2.5 Pro analyzes…" to "OpenAI GPT-5 mini analyzes… (fast multimodal)".
- Update the `## 📎 Attachment Analysis (from Gemini 2.5 Pro)` block label → `## 📎 Attachment Analysis (from GPT-5 mini)`.
- Update the `console.log` "Stage 1" / "Single-stage" lines to reference GPT-5 mini.
- Replace `skipAnalyzer = selectedModel === ANALYZER_MODEL` with a capability check:
  - Define a server-side set `STRONG_MODELS` containing backend IDs already strong enough to handle attachments alone:
    - `openai/gpt-5`, `openai/gpt-5-mini`, `openai/gpt-5-nano`, `openai/gpt-5.1`, `openai/gpt-5.2`
    - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3.1-pro-preview`
    - `anthropic/claude-sonnet-4.5`, `anthropic/claude-opus-4.5`
    - `qwen/qwen3-vl-235b-a22b-instruct`, `qwen/qwen3-235b-a22b-2507`
    - `x-ai/grok-4-fast`, `x-ai/grok-4.1-fast`
    - `deepseek/deepseek-v3.2`, `meta-llama/llama-4-maverick`, `meta-llama/llama-4-scout`, `mistralai/mistral-large-2512`, `moonshotai/kimi-k2.5`
  - `skipAnalyzer = STRONG_MODELS.has(selectedModel)` → these models receive the original multimodal payload untouched.
  - Anything not in the set goes through the GPT-5 mini Stage 1 analyzer first, exactly like the existing two-stage pipeline.
- Lower analyzer `max_tokens` from `4096` → `2048` to further reduce latency (analysis briefs rarely need more, and the responder still gets up to 8192).

### 2. `src/hooks/useAIChat.ts` (main chatbox)
- Update the inline comment + `console.log` describing the pipeline so the message says: `(2-stage: gpt-5-mini analyzer → responder when needed, 1x cost)`.
- Keep `ATTACHMENT_ANALYSIS_MULTIPLIER = 1`. No cost change.

### 3. `src/components/aichat/MultiWindowChat.tsx` (multi-window chatbox)
- No logic change required — multi-window already calls `chatApi.sendMessageStream` → the same `chat` edge function. The new analyzer + skip logic applies automatically to every window in parallel.
- Verification only: confirm each window's `backendModel` is forwarded as `model` to the edge function (it is, via `chatApi`).

## Notes
- No DB or schema changes. No new secrets (uses existing `OPENROUTER_API_KEY`).
- Strong-model list lives only in the edge function so it can be tweaked without a client deploy.
- Expected latency improvement for attachment chats on weaker models: ~50–70% faster than Gemini 2.5 Pro analyzer.
