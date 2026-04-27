## Two-Stage Attachment Pipeline (Gemini Analyzer → User's Model Responder)

### Goal
When a user uploads any file (image, PDF, DOCX, code, data, etc.) in **main chat** or **multi-window chat**:
1. **Stage 1 — Analyzer:** `google/gemini-2.5-pro` reads the attachments and produces a rich, structured analysis (OCR for images, extracted insights, summaries, key data points, code review notes).
2. **Stage 2 — Responder:** The user's **selected model** (GPT-5, Claude, Sonar, Smart Auto resolution, etc.) receives the original user prompt + Gemini's analysis as context, and writes the final visible reply in its own voice/style.

If there are no attachments, behavior is unchanged (single call to selected model).

---

### Why two-stage instead of just routing everything to Gemini
- Today's edge function silently overrides any attachment request to `openai/gpt-4o-mini`, ignoring the user's chosen model. The user expects Claude/GPT-5/Sonar etc. to actually answer them.
- Gemini 2.5 Pro has the strongest multimodal + long-context analysis in the supported set, but the user wants the *response voice* to remain whatever model they picked.
- Two-stage cleanly separates "file understanding" from "answer generation", so even text-only models (Sonar, GPT-5-nano, etc.) can effectively respond about uploaded images/PDFs.

---

### Scope of changes

#### 1. `supabase/functions/chat/index.ts` — server-side two-stage orchestration
Replace the current "force GPT-4o-mini for any attachment" logic with:

- Detect attachments the same way it does today (image_url parts OR `📄 FILE:` / `[Attached` markers in text).
- If attachments are present AND the request's `model` is not already `google/gemini-2.5-pro`:
  1. **Analyzer call (non-streaming)** to OpenRouter with `model: google/gemini-2.5-pro`, passing the full multimodal message array and a dedicated analyzer system prompt:
     > "You are a multimodal analysis engine. Extract every relevant detail from the attached images/files: full OCR text, key data, structure, code logic, tables, charts, named entities, anomalies. Output a structured technical brief in markdown. Do NOT answer the user — only analyze. Be exhaustive but organized."
  2. Take Gemini's returned analysis text and build a **new message array for the responder**:
     - System prompt = current `getSystemPrompt(modelName)`.
     - Prior conversation context (unchanged).
     - The user's original text prompt + an injected `## 📎 Attachment Analysis (from Gemini 2.5 Pro)\n<analysis>` block, replacing the raw image_url parts and raw file dump.
     - This means the responder model receives **text only**, so any model (including text-only ones) can answer.
  3. **Responder call** to OpenRouter with the user's selected `model`, streaming back to the client exactly like today.
- If attachments are present AND user already selected `google/gemini-2.5-pro`: skip stage 1, single direct call (no point analyzing with the same model).
- If no attachments: behavior unchanged.
- Perplexity/sonar models: still go through stage 1 when attachments are present (they can't see images at all today), so this *fixes* attachment support for them too.
- Add a response header `x-analyzer-used: gemini-2.5-pro` for transparency in logs.

Error handling:
- If analyzer call fails (429/402/timeout), fall back gracefully: append a short note `"[Attachment analysis unavailable — responding from filename/context only]"` to the user's text and proceed to the responder. Do not block the user.
- Log analyzer latency and token usage.

#### 2. `src/hooks/useAIChat.ts` — main chat client
- Remove the dead "forced for attachments" comment and keep sending the user's selected `backendModel`. The server now handles the two-stage internally, so the client doesn't need to change models.
- Update the inline log line that says `(forced for attachments)` to simply note `(2-stage: gemini analyzer → <model>)` when `hasAttachments` is true, for clearer console debugging.
- Keep the existing `imageAttachments` multimodal payload construction — server forwards it to Gemini in stage 1.

#### 3. `src/components/aichat/MultiWindowChat.tsx` — multi-window chat
- Same as main chat: each window already sends its own `backendModel`. No structural change needed beyond the log line update, because the server-side two-stage applies uniformly to every window's request.
- Each window will now correctly answer about uploaded files in its own model's voice (Claude window answers as Claude, GPT-5 window as GPT-5, etc.), all powered by a single Gemini analysis per window call.

#### 4. Memory update
- Update `mem://technical/multimodal-model-routing` to record the new two-stage behavior (Gemini 2.5 Pro analyzer + user-selected responder, applied in both main and multi-window chat).

---

### Files touched

| File | Change |
|------|--------|
| `supabase/functions/chat/index.ts` | Add two-stage analyzer→responder pipeline with Gemini 2.5 Pro; remove forced-mini override |
| `src/hooks/useAIChat.ts` | Update log message, remove stale "forced" comment |
| `src/components/aichat/MultiWindowChat.tsx` | Update log message |
| `mem://technical/multimodal-model-routing` | Document new two-stage pattern |

---

### Out of scope (intentionally not changed)
- Cost / token multipliers — the responder model's multiplier still drives billing as today; Gemini analysis cost is absorbed server-side (single non-streaming call, capped tokens).
- Tool-specific endpoints (`agro-analysis`, `health-analysis`, `imagine`, `deck-generate`, `legends-chat`, `cowork-agent`, etc.) — those have their own pipelines and the user's request was specifically about main chat + multi chat.
- Smart Auto routing logic — unchanged; whatever model Smart Auto resolves to becomes the responder.
- UI — no visible changes; users simply see their selected model produce a great answer about uploaded files.
