## Problem

`DeckPage.tsx` still renders the old `DeckSlideViewer` during/after generation, so users see:
- Half-rendered real text instead of a clean shimmer generating animation
- The "AI generating" pill awkwardly inline next to a bullet
- No proper editor shell (sidebar, + New, slide nav) — even though all editor components already exist under `src/components/deck/editor/`

The new `DeckEditor`, `DeckEditorSidebar`, `DeckEditorCanvas`, and `DeckGeneratingCard` are built but never mounted.

## Fix

Mount `DeckEditor` as a full-bleed workspace whenever a deck exists or is generating, and remove the old viewer path. Show shimmer cards (no real partial text) while generating.

### 1. `src/pages/DeckPage.tsx`
- Remove `DeckSlideViewer` import and the entire `{(slides.length > 0 || isGenerating) && (...DeckSlideViewer...)}` block inside the scrollable `<main>`.
- When `slides.length > 0 || isGenerating`, render `<DeckEditor>` as a **fixed full-bleed workspace below the header** (`flex-1 min-h-0`) instead of inside the centered max-w-3xl column. This hides the options/templates UI behind the editor (matches Imagine pattern).
- Add `onCreateNew` handler that resets `slides=[]`, `title=''`, scrolls to top so the prompt/options panel reappears.
- Add `onAddAiSlide(prompt, layout, insertAt)` that calls `deckApi.generateSingleSlide(...)` and splices the returned slide into `slides`.
- Keep `DeckActions` toolbar above the editor when not generating.

### 2. `src/components/deck/editor/DeckEditor.tsx`
- During initial generation (`slides.length === 0 && isGenerating`), pass `pending=true` to canvas so it renders `DeckGeneratingCard` (full shimmer) — never real partial text. Already wired; verify behavior.
- Auto-advance `activeIndex` to follow the latest pending placeholder.

### 3. `src/components/deck/editor/DeckGeneratingCard.tsx`
- Move the "✨ AI generating" pill from absolute-positioned over the heading skeleton to a clean top-right corner badge (`absolute top-3 right-3`) so it never collides with text.
- Keep shimmer keyframes for heading, body lines, and image area.

### 4. `src/components/deck/editor/DeckEditorCanvas.tsx`
- Ensure `pending || !slide` branch renders only `DeckGeneratingCard` (no partial heading/bullets bleed through). Already correct; just verify the visibleLines progression driven by `useFakeStreamProgress`.

### 5. Delete unused inline rendering
- Remove `DeckSlideViewer` import from `DeckPage.tsx`. Keep the file for now (used elsewhere? check — if not, leave it dormant).

## Result

When the user clicks Generate:
- Prompt/options panel slides away
- Full editor shell appears with sidebar (shimmer thumbnails) + canvas (large shimmer card with corner "AI generating" badge)
- As slides return from the API, shimmer cards swap to real slides with crossfade
- User can edit text, change layouts, add blank/AI/duplicate slides, or click "+ New" to start over

## Files

- `src/pages/DeckPage.tsx` (edit)
- `src/components/deck/editor/DeckGeneratingCard.tsx` (edit — badge position)
- `src/components/deck/editor/DeckEditor.tsx` (verify auto-follow)
- `src/components/deck/editor/DeckEditorCanvas.tsx` (verify pending branch)
