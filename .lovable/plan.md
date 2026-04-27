## Swap Attachment Analyzer Model: Gemini 2.5 Pro → GPT-5.4 Nano

### Goal
Replace the Stage 1 analyzer model in the two-stage attachment pipeline so uploaded files/images in **main chat** and **multi-window chat** are analyzed by `openai/gpt-5.4-nano` instead of `google/gemini-2.5-pro`. The user's selected model still writes the final response (Stage 2), unchanged.

GPT-5.4 Nano (confirmed on OpenRouter) supports **image + text inputs**, has **400K context**, and is optimized for low-latency extraction tasks — fast and well-suited for the analyzer role.

---

### Scope of changes

#### 1. `supabase/functions/chat/index.ts` — switch analyzer model
- Change the constant:
  ```ts
  const ANALYZER_MODEL = 'openai/gpt-5.4-nano';
  ```
- Update comment marker `// ===== STAGE 1: Gemini 2.5 Pro analyzer =====` → `// ===== STAGE 1: GPT-5.4 Nano analyzer =====`
- Update the injected analysis block label sent to the responder model:
  - From: `## 📎 Attachment Analysis (from Gemini 2.5 Pro)`
  - To: `## 📎 Attachment Analysis (from GPT-5.4 Nano)`
- Update response header for transparency: `x-analyzer-used: gpt-5.4-nano`
- `skipAnalyzer` logic still works automatically — if user selects `openai/gpt-5.4-nano` as responder, Stage 1 is skipped.
- Fallback on analyzer failure: unchanged (graceful "[Attachment analysis unavailable…]" note).

#### 2. `src/hooks/useAIChat.ts` — log message
- Update: `' (2-stage: gemini-2.5-pro analyzer → responder)'` → `' (2-stage: gpt-5.4-nano analyzer → responder)'`

#### 3. `src/components/aichat/MultiWindowChat.tsx` — log message
- Update: `'(server runs 2-stage: gemini-2.5-pro analyzer → ' + modelName + ')'` → `'(server runs 2-stage: gpt-5.4-nano analyzer → ' + modelName + ')'`

#### 4. Memory update
- Update `mem://technical/multimodal-model-routing` to record new analyzer (`openai/gpt-5.4-nano`).

#### 5. Deploy
- Deploy the updated `chat` edge function so the change takes effect immediately.

---

### Files touched

| File | Change |
|------|--------|
| `supabase/functions/chat/index.ts` | Change `ANALYZER_MODEL`, comment, injected label, response header |
| `src/hooks/useAIChat.ts` | Update console log string |
| `src/components/aichat/MultiWindowChat.tsx` | Update console log string |
| `mem://technical/multimodal-model-routing` | Document new analyzer model |

### Out of scope
- Stage 2 responder logic — user's selected model still drives the final reply
- Tool-specific endpoints (agro, health, imagine, deck, legends, cowork) — separate pipelines
- Billing / token multipliers — responder model still drives cost
- UI — no visible changes