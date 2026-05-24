# Sorix Deck — Post-Generation Editor + Live Generation Animation

After a deck is generated, switch into a professional **editor workspace** (reference image 1) with sidebar, inline editing, manual + AI slide insertion, image regeneration, and a **"+ New"** pill (image 2). During generation, show a **live, streaming-style animation** inside the active slide (image 3) instead of a static skeleton list.

## 1. Editor layout (after slides exist)

```text
┌──────────────────────────────────────────────────────────┐
│ Header  Sorix Deck    [+ New ▾]   [Theme]   [History]    │
├────────┬─────────────────────────────────────────────────┤
│Sidebar │  Active slide canvas (large, themed)            │
│[🎞][≣] │                                                 │
│[+ New▾]│  • Click any text → inline edit                 │
│┌──────┐│  • Hover image → Regenerate / Replace / Prompt  │
││ 1 🖼 ││  • Hover bullet list → + Add point / × delete  │
│├──────┤│  • Layout switcher in canvas toolbar            │
││ 2 🖼 ││                                                 │
│└──────┘│                                                 │
└────────┴─────────────────────────────────────────────────┘
```

## 2. New components (`src/components/deck/editor/`)

- **`DeckEditor.tsx`** — workspace shell. Props: `slides`, `setSlides`, `activeIndex`, `setActiveIndex`, `title`, `theme`, `setTheme`, `isGenerating`, `generatingIndex`, `onCreateNew`, `onOpenHistory`. Keyboard: ↑/↓ switch, Del removes (Undo toast).
- **`DeckEditorSidebar.tsx`** — 240px rail (drawer on mobile). Two tabs: **Slides** (thumb strip — each thumb is `DeckSlideCard` scaled with `transform: scale(0.18)` in a 16:9 frame; numbered badge bottom-left) and **Outline** (numbered headings; drag to reorder via framer-motion `Reorder.Group`). Footer: **+ New ▾** pill (image 2 style: white pill, gradient chevron-split button, AI chip inside the chevron section).
- **`DeckEditorCanvas.tsx`** — renders the active slide large, reusing `DeckSlideCard` with editable affordances forced on. Small floating toolbar above: layout switch (split / text-only / full-image), duplicate, delete.
- **`DeckCreateNewButton.tsx`** — pill from image 2: white background, dark text, `+ New`, then divider, chevron with subtle `AI` chip (`bg-primary/10 text-primary text-[10px] px-1.5 rounded`). Dropdown items: *Blank deck*, *From prompt*, *From template*.
- **`DeckAddSlideMenu.tsx`** — popover used by sidebar footer. Items: *Blank slide*, *With AI prompt…*, *Duplicate current*, *Choose layout…*.
- **`DeckAiSlidePromptDialog.tsx`** — small modal: `react-textarea-autosize` ("Describe this slide…"), layout picker, Generate. Calls single-slide endpoint.

All components: semantic tokens (`bg-card/60`, `border-border/60`, `text-foreground`), rounded-2xl, framer-motion transitions, mobile-first.

## 3. Live generation animation (reference image 3)

Replace `DeckSlideViewer`'s skeleton list (during generation) with an **inline streaming preview** inside the editor canvas:

- The editor mounts **immediately** when generation starts with placeholder slides (`Array.from({length: slideCount}, ...)`).
- Each placeholder shows:
  - Header line with `bg-muted` shimmer.
  - Body lines stream in one-by-one with a typewriter cadence (CSS `@keyframes` width 0→100%, 350ms per line, staggered).
  - Small pill badge floating inline: `✨ AI generating` (gradient `bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm`, animated dot/pulse).
  - Image area shows a soft animated gradient sweep (Tailwind `animate-pulse` + custom `@keyframes shimmer` gradient stripe moving left→right).
- Sidebar thumbnails for not-yet-generated slides show the same shimmer + a tiny "AI generating" chip overlay.
- When the API response arrives, slides swap in with a framer-motion `AnimatePresence` crossfade per slide.
- The **active slide** during generation auto-follows the latest completed slide (`generatingIndex`).

Implementation:
- New `DeckGeneratingCard.tsx` renders the streaming card given a theme + index.
- New CSS keyframes added to `src/index.css`: `@keyframes deck-shimmer` (background-position) and `@keyframes deck-line-in` (width 0→100%).
- A small `useFakeStreamProgress(slideCount, isGenerating)` hook drives line-by-line reveal until the real slide replaces it.

## 4. Inline editing upgrades (`DeckSlideCard.tsx`)

- Heading/bullets already click-to-edit. Add:
  - **+ Add point** dashed row at end of bullet list (on hover).
  - **× delete** on hover of each bullet row.
  - **Image overlay** (top-right): Regenerate · Replace… (file → base64 → `slide.image_url`) · Edit prompt (modal, then regenerate).
  - Editable mode flag so the canvas can force-show edit affordances even without hover (better on mobile).

## 5. "+ New" / "+ Add slide" behavior

- **Header "+ New"** → `handleCreateNew()`: stash current deck → clear `slides` and `title` → return to prompt view → toast with **Undo** (5s).
- **Sidebar footer "+ New ▾"** → `DeckAddSlideMenu`:
  - *Blank slide* → insert empty `text-only` slide at `activeIndex + 1`, renumber.
  - *With AI prompt* → opens `DeckAiSlidePromptDialog` → calls `deckApi.generateSingleSlide` → inserts when done; while pending shows a **generating placeholder card** in the sidebar + canvas (same live animation as §3).
  - *Duplicate current* → clones active slide.
  - *Choose layout…* → quick blank insert with selected layout.

## 6. Single-slide AI generation

**`src/services/deckApi.ts`**
```ts
generateSingleSlide(prompt, { theme, textContent, artStyle, language, layout, slideNumber }): Promise<Slide>
```

**`supabase/functions/deck-generate/index.ts`** — new `mode: 'single'` branch:
- Same auth + token checks (free users: counts as 1 slide; paid: `TOKENS_PER_SLIDE + TOKENS_PER_IMAGE`).
- LLM prompted for ONE slide JSON (same schema), `slide_number` passed through.
- Generates one image via existing Flux call.
- Returns `{ slide, tokensUsed, totalTokensUsed }`.

## 7. `DeckPage.tsx` changes

- New state: `activeSlideIndex`, `previousDeck` (for Undo).
- When `slides.length > 0` OR `isGenerating`, render `<DeckEditor … />` and hide prompt/options panel.
- "Create new" returns to prompt + options view.
- Persist edits to `analysis_history.result_data` via direct supabase update (RLS already filters by `user_id`), debounced 800ms after any slide mutation.

## Technical notes

- Thumbnails use CSS `transform: scale()` so we render `DeckSlideCard` once.
- Mobile: sidebar collapses into a slide-up bottom sheet with a floating "Slides" pill.
- The "AI generating" inline badge in image 3 is a stateless component using semantic tokens; placement is absolute next to the currently-streaming bullet/heading.
- Replace-image flow stays client-side (base64 data URL), matching the existing `image_url` usage — no storage upload needed.

## Files

**New**
- `src/components/deck/editor/DeckEditor.tsx`
- `src/components/deck/editor/DeckEditorSidebar.tsx`
- `src/components/deck/editor/DeckEditorCanvas.tsx`
- `src/components/deck/editor/DeckCreateNewButton.tsx`
- `src/components/deck/editor/DeckAddSlideMenu.tsx`
- `src/components/deck/editor/DeckAiSlidePromptDialog.tsx`
- `src/components/deck/editor/DeckGeneratingCard.tsx`
- `src/components/deck/editor/useFakeStreamProgress.ts`

**Edited**
- `src/pages/DeckPage.tsx` — mount editor, wire "Create new", active index, generating state.
- `src/components/deck/DeckSlideCard.tsx` — add bullet add/delete, image overlay, editable flag.
- `src/components/deck/index.tsx` — exports.
- `src/services/deckApi.ts` — `generateSingleSlide`, `updatePresentation`.
- `src/index.css` — `deck-shimmer` and `deck-line-in` keyframes.
- `supabase/functions/deck-generate/index.ts` — `mode: 'single'` branch.
