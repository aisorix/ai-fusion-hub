## Goal
Bring Sorix Deck to the same professional layout/UX as Sorix Imagine, and apply 4 targeted UI upgrades the user called out:

1. Imagine-style page chrome (header, prompt bar, tokens pill, options card)
2. Language selector (Auto / English / Bangla / Hindi / Urdu / Arabic / Spanish / French / Chinese / Japanese)
3. Text content picker restyled to match screenshot 7 (boxed card with header)
4. Theme picker shows 3 inline preview cards + "View more" dialog with the full grid (screenshot 8)
5. Templates + Your Creations tabs below, identical pattern to `ImagineExplorer`

## File changes

### `src/pages/DeckPage.tsx` (restructure)
Mirror the structure of `ImaginePage.tsx`:
- Same header (back, gradient icon, "Sorix Deck" / "AI Presentations", History pill in top-right with label on `sm+`).
- `max-w-3xl` centered column, `gap-4 sm:gap-5`, same paddings.
- Order:
  1. `DeckPromptBar` (unchanged behavior; visually already close to Imagine).
  2. Centered tokens/free-slides pill (same chip style as Imagine: `inline-flex rounded-full border bg-card/60 px-2.5 py-1 text-[10.5px]`). Shows either `X/20 free slides used · Y remaining` or `tokens left · est. cost per run`.
  3. New `DeckOptionsPanel` card (one bordered card, `p-3.5 sm:p-5`, `space-y-3.5 sm:space-y-4`) containing in this order:
     - **Slides** row (existing chip selector + Custom input, restyled to fit panel).
     - **Language** row (new selector — see below).
     - **Image style** (existing `DeckArtStylePicker`, moved inside the panel; keep its current visual).
  4. New `DeckTextContentCard` (its own boxed card, matches screenshot 7).
  5. New `DeckThemeShowcase` (inline 3 theme preview cards + "View more" — see below).
  6. `DeckActions` + `DeckSlideViewer` (unchanged).
  7. New `DeckExplorer` tabbed section (Templates / Your Creations).

### New: `src/components/deck/DeckLanguageSelector.tsx`
Pill button styled like screenshot 6 (`Auto` with globe icon + chevron). Opens a small popover/dropdown with: Auto, English, Bangla (বাংলা), Hindi (हिन्दी), Urdu (اردو), Arabic (العربية), Spanish, French, Chinese (中文), Japanese (日本語). Exports `type DeckLanguage`.

Stored on `DeckPage` state and passed to `deckApi.generate(...)`.

### New: `src/components/deck/DeckTextContentCard.tsx`
Replaces visual of `DeckTextContentPicker`. Layout from screenshot 7:
- Outer card: `rounded-2xl border bg-card p-4`.
- Header row: small icon (Lines icon) + `Text content` bold title.
- Sub-label: `Amount of text per card` (`text-xs text-muted-foreground`).
- 4 selectable tiles in `grid-cols-4 gap-2` (Minimal / Concise / Detailed / Extensive). Each tile = rounded card with the existing line-graphic visual + label below. Selected tile = `border-primary bg-primary/5 text-primary`. Reuses the existing `TextContent` type from `DeckTextContentPicker`.

`DeckTextContentPicker.tsx` is kept but no longer imported on the page (left in place to avoid removing exports; we can also drop the export from `index.tsx`).

### Update: `src/components/deck/DeckThemePicker.tsx` → new wrapper `DeckThemeShowcase.tsx`
Inline preview row matching screenshot 8:
- Card container: `rounded-2xl border bg-card p-4`.
- Header: image icon + `Visuals` bold + sub-text `Theme — Use one of our popular themes below or view more`. Right-aligned "View more" pill button (Palette icon).
- Body: `grid-cols-3 gap-3` of 3 large theme cards (default: `dark`, `gamma`, `minimalist`). Each card uses the existing `themes[]` definitions to render a Title / Body & link preview inside the theme background, with a checkmark badge + label below. Selected card gets `border-primary ring-2 ring-primary/30`.
- "View more" opens the existing themes Dialog (reuse current `DeckThemePicker` modal content) — all 22 themes in `grid-cols-2 sm:grid-cols-3 gap-3`.

Implementation: keep `DeckThemePicker.tsx` for the Dialog list, but extract its `themes[]` array into the new file (or export it). The page uses `DeckThemeShowcase` instead of the old pill trigger.

### New: `src/components/deck/DeckExplorer.tsx`
Mirror `ImagineExplorer.tsx` exactly (tab bar with active underline + count):
- Tabs: `Templates` (LayoutGrid icon) and `Your Creations` (Sparkles icon).
- Templates tab → new `DeckTemplates` component with a curated set of starter prompts (e.g. Pitch Deck, Product Launch, Quarterly Review, Course Outline, Conference Keynote, Investor Update, Workshop, Sales Playbook). Each tile is `aspect-[4/5] rounded-2xl` with a gradient background + title + 1-line subtitle. Clicking inserts the prompt into the prompt bar (via a new `injectPrompt`/`injectKey` prop on `DeckPromptBar`, copied from `ImaginePromptBar`).
- Your Creations tab → new `DeckHistoryFeed` (visual twin of `ImagineHistoryFeed`) rendering the existing `historyItems` as a `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4` grid of cards. Each card shows the first slide image (or a theme-colored placeholder if no image) + title + slide count, hover delete button, click → `handleHistoryLoad`.

### Update: `src/components/deck/DeckPromptBar.tsx`
Add the same `injectPrompt` / `injectKey` props pattern used by `ImaginePromptBar` so template tiles can pre-fill the textarea and scroll back to top. No other behavior changes.

### Update: `src/services/deckApi.ts`
Add optional `language` param to `deckApi.generate()` and pass through in the POST body.

### Update: `supabase/functions/deck-generate/index.ts`
Accept `language` from the request body; when set and not `"auto"`, append `"Write all slide headings and bullet points in {language}."` to the existing system prompt. No other backend logic changes.

### Update: `src/components/deck/index.tsx`
Export `DeckLanguageSelector`, `DeckTextContentCard`, `DeckThemeShowcase`, `DeckExplorer`, `DeckTemplates`, `DeckHistoryFeed`.

## Out of scope
- No changes to slide rendering, slideshow, export logic, or pricing.
- Audience / Tone / Scenario / Additional-instructions fields from screenshot 5 are not added (user only asked for language, text content style, themes, templates/creations).
- The header History panel keeps using the existing `DeckHistory` list component (sidebar).
