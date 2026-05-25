# Voice + Mobile Polish — Final Plan

## 1. Read Aloud (TTS) — fix playback + add word highlight + speed/voice controls

**Hook `src/hooks/useTtsPlayback.ts`** (rewrite)
- Create the `<audio>` element synchronously in the click handler (before any `await`) to preserve the iOS user-gesture chain.
- Add `speed` (0.75× / 1× / 1.25× / 1.5× / 2×, persisted), live-applied via `audio.playbackRate`.
- Add live voice switching (Nova, Alloy, Shimmer, Echo, Fable, Onyx, Sage, Coral). Changing voice mid-read seamlessly restarts the current passage.
- Compute **word-level timings** heuristically: split text into words, weight each by `chars + 1`, distribute across audio `duration / speed`. On `timeupdate` expose `activeWordIndex`.
- Clean markdown noise (code fences, links, asterisks) before TTS.
- All errors surface via Sonner toast.

**Floating bar `src/components/aichat/ReadAloudBar.tsx`** (rewrite)
- Compact pill with Play/Pause, "Reading: …" preview, progress bar, elapsed/duration.
- New **Speed** popover and **Voice** popover (icons + labels, current selection checkmark).
- Stop button on the right.

**Message `src/components/aichat/MessageBubble.tsx`**
- When the active TTS target matches this message, render a subtle highlight panel beneath the markdown:
  - "Reading aloud" kicker.
  - Each word wrapped in a span; active word gets `bg-primary/20 text-primary font-semibold rounded`, past words dimmed, future words normal.
  - Active word auto-scrolls into view (`scrollIntoView({block:'nearest'})`).

## 2. Voice-to-Text (Whisper STT) — mobile fixes

**Hook `src/hooks/useVoiceDictation.ts`**
- Cycle through MediaRecorder MIME candidates including **`audio/mp4`** and **`audio/mp4;codecs=mp4a.40.2`** for iOS Safari.
- Filename extension follows the chosen MIME (`.m4a` / `.webm` / `.ogg`) so OpenAI Whisper accepts it.
- Lower drop threshold from 1200 → 600 bytes so short utterances aren't lost.
- Sonner toasts for `NotAllowedError`, `NotFoundError`, no-MediaRecorder, transcription failures, and an empty transcript hint.

`VoiceDictationButton.tsx` already shows the recording waveform / Transcribing… pill — no change needed.

## 3. Sorix Imagine — mobile polish + model rename

**`src/components/imagine/ImagineModelSelector.tsx`**
- First entry → `displayName: "Riverflow V2"`, `shortName: "Riverflow V2"`, `modelId: "sourceful/riverflow-v2-standard-preview"`. Stays default.

**`src/components/imagine/ImagineOptionsPanel.tsx`**
- Row order swap: **Output Format first**, then Aspect, then Resolution, then Number of Outputs.
- Format options reordered: **PNG (Recommended)**, WebP, JPG.
- On mobile (`<sm`), the whole panel collapses into a **single tap-to-open trigger** ("Image Settings · WebP · 1:1 · 1K · ×1") that opens a slide-up bottom sheet with the same controls at 48px touch height. Restores the dropdown UX from the previous build.

**`src/pages/ImaginePage.tsx`**
- Default `format` changes from `'webp'` → `'png'` to match the new recommended ordering.

## 4. Sorix Deck — mobile polish + image model picker

**Image-model row** — `src/pages/DeckPage.tsx` + small new component
- Add `deckImageModel` state defaulting to the Imagine "Riverflow V2".
- Render an "Image model" row directly under the existing Image Style row (reuses `ImagineModelSelector` UI for consistency).
- Thread `imageModel.modelId` through `deckApi.generate` → edge function.

**`src/services/deckApi.ts`** — add `imageModel?: string` to `DeckGenerateExtras`.

**`supabase/functions/deck-generate/index.ts`** — accept `imageModel` from the request body; if present, use it instead of the hardcoded `black-forest-labs/flux.2-klein-4b` when calling OpenRouter (default kept as fallback).

**Mobile editor polish**
- `DeckEditor.tsx`: convert the FAB-style "Slides" pill into a sticky compact top bar on `<md` with `Menu`, "Slide N/M", and a compact "+ New" trigger; sidebar drawer width widens to 78vw with backdrop blur and swipe-to-close.
- `DeckEditorCanvas.tsx`: padding reduces to `p-2.5` on mobile, layout switcher becomes a 3-icon segmented row with no labels under `sm`, canvas wrapper uses `h-[calc(100dvh-7rem)]` so the slide always fits.
- `DeckPage.tsx` toolbar (Undo/Redo · Theme · Create New): wraps better on small viewports — "Create New One" collapses to a `+ New` icon-only button on `<sm`, Theme picker moves into a `…` overflow menu on `<sm` so the top bar never overflows.

## Files touched

**Rewrite:** `src/hooks/useTtsPlayback.ts`, `src/hooks/useVoiceDictation.ts`, `src/components/aichat/ReadAloudBar.tsx`
**Edit:** `src/components/aichat/MessageBubble.tsx`, `src/components/imagine/ImagineModelSelector.tsx`, `src/components/imagine/ImagineOptionsPanel.tsx`, `src/pages/ImaginePage.tsx`, `src/pages/DeckPage.tsx`, `src/services/deckApi.ts`, `src/components/deck/editor/DeckEditor.tsx`, `src/components/deck/editor/DeckEditorCanvas.tsx`, `supabase/functions/deck-generate/index.ts`

No new dependencies. After approval I'll implement in one pass and verify playback, dictation on a mobile viewport, and the Deck/Imagine mobile layouts.