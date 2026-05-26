## 1. Voice model swap (STT + TTS)

Replace the OpenAI Whisper / gpt-4o-mini-tts calls with the requested models via OpenRouter (already used by `imagine`/`chat`).

**STT — `supabase/functions/stt-transcribe/index.ts`**
- Switch provider from `api.openai.com/v1/audio/transcriptions` to OpenRouter audio endpoint using `google/chirp-3`.
- Keep the multipart upload → base64 conversion (OpenRouter accepts audio via `input_audio` content part in chat-completions style). Use chat-completions with `messages: [{ role:'user', content:[{ type:'input_audio', input_audio:{ data, format } }, { type:'text', text:'Transcribe verbatim. Return only the spoken text.' }] }]` and parse `choices[0].message.content`.
- Preserve the 20 MB size check, auth-claim check, language hint (passed in the user text).
- Fallback: if Chirp returns an error or empty text, fall back to OpenAI Whisper so dictation never silently dies.

**TTS — `supabase/functions/tts-speak/index.ts`**
- Switch to OpenRouter model `x-ai/grok-voice-tts-1.0`. Send `{ model, voice, input, response_format:'mp3' }` to OpenRouter's audio/speech proxy (or chat-completions with `modalities:['audio']` and parse `message.audio.data` base64 → return as `audio/mpeg`).
- Keep allowed-voice whitelist and the streaming MP3 response shape so `useTtsPlayback` keeps working unchanged.
- Fallback to `gpt-4o-mini-tts` if Grok returns 4xx/5xx, so Read Aloud always speaks.

No client changes required — both hooks (`useVoiceDictation`, `useTtsPlayback`) talk to these edge functions, so the swap is invisible to the UI.

## 2. Imagine — fix "sometimes no image" reliability

Root causes in `supabase/functions/imagine/index.ts`:
- A single OpenRouter call can return text-only / safety-refusal with no `images[]`, throwing "No image returned from model" and (when `count===1`) failing the whole request.
- Some providers (Riverflow, Flux) intermittently 502 on first try; there is currently no retry.
- The prompt is sent as bare string — for image-only models we lose the user's "details" (aspect/format hints) unless we encode them in the prompt.

Changes:
- Add a **retry-with-backoff wrapper** around `generateOnce` (up to 2 retries on 5xx, 429, or empty image response, 800 ms then 1600 ms).
- If after retries on the **selected** model still no image, **automatically fall back** to `google/gemini-2.5-flash-image` (always available) for that slot and tag the response with `fallbackUsed: true` so the client can show a subtle notice.
- Always forward the **full user prompt verbatim** plus a short directive line appended server-side: `Aspect ratio: <a>. Resolution: <r>. Output format: <fmt>.` — guarantees the model honors the user's details even when they only set them via the panel.
- Improve image extraction: also check `message.content[].image_url.url` when content is a string containing a markdown `![](data:image/...)`.
- Better error surfacing: when all slots fail, return the **first upstream error message** instead of the generic "All image generations failed" so the toast tells the user what happened.

No schema or token-accounting changes.

## 3. Imagine template preview — mobile fix (image #3)

`src/components/imagine/ImagineTemplatePreview.tsx` currently renders a centered modal with `max-h-[90vh]` and a vertical stack on mobile. On narrow screens the image takes the top half and the prompt/actions get clipped (matches the screenshot — actions invisible, content not scrollable enough).

Rework for mobile (≤ md):
- Convert to a **bottom-sheet** with rounded top corners, draggable handle bar, `h-[92dvh]`, snap-to-top on open.
- Image becomes a compact 16:9 hero strip (`h-44`) at the top instead of a half-screen square, so the prompt + meta + action buttons are all visible without scrolling.
- Sticky bottom action bar (`Use Prompt` + `Use as Reference`) pinned with `safe-area-inset-bottom` padding so it never gets cut off.
- Backdrop tap closes; add a visible close pill and a drag-down-to-dismiss gesture via framer-motion `drag="y"` with `dragConstraints`.
- Desktop (≥ md) layout is unchanged.

No new files. Files touched:
- `supabase/functions/stt-transcribe/index.ts`
- `supabase/functions/tts-speak/index.ts`
- `supabase/functions/imagine/index.ts`
- `src/components/imagine/ImagineTemplatePreview.tsx`
