## Goal

1. **Read aloud** (speaker icon in message actions) → high-quality OpenAI TTS (`gpt-4o-mini-tts`) instead of the browser's robotic `speechSynthesis`. Show clearly **what** text is being read and **where** (highlight the active message + a floating playback bar).
2. **Replace the mic / Live Voice button** in every prompt bar with a **voice-to-text dictation** powered by OpenAI **Whisper (`whisper-large-v3`)** that records the user's speech, transcribes it, and inserts the text into that prompt bar — with a live recording animation right inside the input.

> Note on model ids: `openai/gpt-4o-mini-tts-2025-12-15` and `openai/whisper-large-v3` are not OpenAI's published ids. We'll use OpenAI's real endpoints `gpt-4o-mini-tts` (audio/speech) and `whisper-1` (audio/transcriptions), and expose the model id as an env-var constant so it's a one-line swap if you have access to a different snapshot.

## Secret required

Whisper + TTS audio endpoints are not available on OpenRouter. We need:

- **`OPENAI_API_KEY`** — must be added before edge functions can be tested. I'll request it via the secrets tool in build mode.

---

## Backend (2 new edge functions)

### 1. `supabase/functions/tts-speak/index.ts`
- POST `{ text: string, voice?: 'alloy'|'nova'|'shimmer'|... }`
- Calls `https://api.openai.com/v1/audio/speech` with `model: 'gpt-4o-mini-tts'`, `voice`, `format: 'mp3'`.
- Returns raw `audio/mpeg` bytes (stream-through so playback starts fast).
- JWT-verified; rate-limited per user.
- Registered in `supabase/config.toml` with default JWT verification.

### 2. `supabase/functions/stt-transcribe/index.ts`
- POST `multipart/form-data` with `file` (webm/mp3 blob) + optional `language`.
- Calls `https://api.openai.com/v1/audio/transcriptions` with `model: 'whisper-1'`.
- Returns `{ text: string }`.
- JWT-verified.

---

## Frontend — Read Aloud (TTS)

### New hook: `src/hooks/useTtsPlayback.ts`
- Global singleton state: `{ activeId, status: 'idle'|'loading'|'playing'|'paused', currentText, position, duration }`.
- `play(id, text)` → fetches `/functions/v1/tts-speak`, plays through a shared `<audio>` element, cancels any previous playback.
- `stop()`, `toggle(id, text)`.
- Persists chosen voice in `localStorage`.

### `src/components/aichat/MessageBubble.tsx`
- Replace the empty `ActionButton onClick={() => {}}` (line 248) with `toggle(message.id, message.content)`.
- When `activeId === message.id`:
  - Icon swaps `Volume2` → `Pause` (loading → small spinner).
  - Bubble gets a subtle `ring-1 ring-primary/40` + a thin animated progress bar under the actions row showing playback position.

### New component: `src/components/aichat/ReadAloudBar.tsx`
- Fixed bottom-center floating pill (above ChatInput) shown whenever TTS is active.
- Shows: ▶/⏸ button, scrolling/truncated preview of the text being read ("Reading: *Hello! 👋 How can I assist…*"), elapsed/duration, ✕ stop.
- Uses the same `useTtsPlayback` store.
- Mounted once inside `ChatPage`.

This gives the user both **per-message visual feedback** (highlight + progress) and a **persistent indicator** of what's being read.

---

## Frontend — Voice-to-Text (Whisper) in all prompt bars

### New hook: `src/hooks/useVoiceDictation.ts`
- Wraps `MediaRecorder` (`audio/webm;codecs=opus`).
- `start()` → request mic, record, expose live `volumeLevel` (via `AnalyserNode` RMS, 0–1) for animation.
- `stop()` → POST blob to `/functions/v1/stt-transcribe`, return text.
- States: `idle | recording | transcribing | error`.
- Auto-stop after 60s, manual cancel supported.

### Shared UI component: `src/components/voice/VoiceDictationButton.tsx`
- Props: `onTranscript(text: string)`, `disabled`, `size`, `language`.
- Idle: shows `Mic` icon.
- Recording: morphs into a pulsing red dot + 5-bar live waveform driven by `volumeLevel`, with a small **"Listening… 0:07"** timer chip floating above. Click again = stop & transcribe.
- Transcribing: spinner + "Transcribing…" chip.
- Tooltip: "Voice to text" / "ভয়েসকে টেক্সটে".
- Uses semantic tokens (`bg-primary`, `text-destructive`, etc.) — no raw colors.

### Wiring — replace the existing mic / Live Voice mic in **every** prompt bar:
| File | Current behavior | Change |
|---|---|---|
| `src/components/aichat/ChatInput.tsx` (line ~699 mic → `onOpenVoiceMode`) | Opens Live Voice overlay | Render `<VoiceDictationButton onTranscript={(t) => setInput((p) => p ? p + ' ' + t : t)} />` |
| `src/components/aichat/SharedChatInput.tsx` | (if has mic) same swap | same |
| `src/components/deck/DeckPromptBar.tsx` | new — add mic | append `VoiceDictationButton` next to Send |
| `src/components/imagine/ImaginePromptBar.tsx` | same | same |
| `src/components/flowbuilder/FlowPromptBar.tsx` | same | same |
| `src/components/cowork/CommandCenter.tsx` | same | same |
| `src/components/chat/ChatInput.tsx` (support chat) | same | same |
| Deck editor AI slide prompt (`DeckAiSlidePromptDialog.tsx`) | same | same |

### Live Voice Mode (conversational overlay)
- Per the user's request, the mic button now does dictation, so `onOpenVoiceMode` is no longer triggered from prompt bars.
- We'll keep `LiveVoiceOverlay` mounted but unreachable from the input (it can still be opened from Settings later if desired). The 2nd screenshot's "Live Voice Mode" tooltip will be replaced by "Voice to text".

---

## Animations (Motion / Tailwind)

- **Read-aloud progress**: 2px bar under the message actions, `bg-primary` width animates with `currentTime/duration` via `requestAnimationFrame`.
- **Active message glow**: `ring-1 ring-primary/40 transition-shadow duration-300`.
- **Floating ReadAloudBar**: framer-motion `initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}` slide-up from bottom.
- **Recording waveform**: 5 vertical `div`s, heights derived from `volumeLevel` smoothed at 30fps; idle bars use `animate-pulse` at low height.
- **Transcribing**: `Loader2` spin + a subtle shimmer overlay on the textarea (`bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-[shimmer_1.4s_linear_infinite]`).
- All keyframes added to `src/index.css` only if not already defined.

---

## Technical notes (for the engineer)

- TTS streaming uses `Response.body` piped to a `Blob` then `URL.createObjectURL` for `<audio>` — keeps the implementation simple and supported everywhere; can switch to MediaSource later.
- All Whisper requests include `Authorization: Bearer ${session.access_token}` per the project's auth-hardening rule.
- File-size guard on the blob (≤ 20MB) to stay within Whisper's limit.
- Model ids exposed as `TTS_MODEL = 'gpt-4o-mini-tts'` and `STT_MODEL = 'whisper-1'` constants at the top of each function for one-line upgrade if a newer snapshot becomes available.
- No business-logic changes elsewhere; purely additive UI + 2 edge functions.

## Files to create
- `supabase/functions/tts-speak/index.ts`
- `supabase/functions/stt-transcribe/index.ts`
- `src/hooks/useTtsPlayback.ts`
- `src/hooks/useVoiceDictation.ts`
- `src/components/voice/VoiceDictationButton.tsx`
- `src/components/aichat/ReadAloudBar.tsx`

## Files to edit
- `supabase/config.toml` (register new functions if needed)
- `src/components/aichat/MessageBubble.tsx` (Read aloud wiring + progress)
- `src/pages/ChatPage.tsx` (mount `<ReadAloudBar />`)
- `src/components/aichat/ChatInput.tsx`, `SharedChatInput.tsx`, `DeckPromptBar.tsx`, `ImaginePromptBar.tsx`, `FlowPromptBar.tsx`, `CommandCenter.tsx`, `chat/ChatInput.tsx`, `deck/editor/DeckAiSlidePromptDialog.tsx` (swap mic → `VoiceDictationButton`)
- `src/index.css` (shimmer keyframe if missing)
