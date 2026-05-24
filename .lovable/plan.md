# Sorix Deck — Pro Dropdown Controls

Add the seven new controls visible in the reference screenshots to Sorix Deck, all built on a single, professional dropdown primitive so the panel feels consistent (no mixed shadcn/native styles).

## New controls

1. **Format** — `Presentation` (default) · `Webpage` · `Document` · `Social`. 2×2 grid of selectable cards with icon + label and a circular check indicator (matches screenshot 1).
2. **Card size** — `Default (Fluid)` · `Traditional (16:9)` · `Tall (4:3)`. Pill dropdown with frame icon + ratio hint on the right (screenshot 2).
3. **Scenario** — `Auto`, `Teaching Courseware`, `Work Summary`, `Work Plan`, `Project Report`, `Solution`, `Research Report`, `General` (default). Scrollable dropdown (screenshot 4).
4. **Audience (Optional)** — `Auto`, `Students`, `Educator`, `Manager`, `Direct Report`, `Colleague` (screenshot 5).
5. **Tone** — `Neutral` (default), `Professional`, `Educational`, `Casual`, `Friendly`, `Inspirational`, `Humorous` (screenshot 6).
6. **Aspect Ratio** — segmented pill row `16:9` · `4:3` · `1:1`, each with a small frame icon (screenshot 3).
7. **Additional instructions (Optional)** — multi-line textarea (autosize, max ~5 rows) with placeholder "Add any additional requirements to make AI results better match your needs." (screenshot 3).

## UI / Component plan

- **New shared primitive**: `src/components/deck/DeckDropdown.tsx`
  - Generic `<DeckDropdown<T>>` with: `label`, `value`, `options[{ id, label, hint?, icon? }]`, `onChange`, optional `leadingIcon`, `placeholder`.
  - Visual: full-width pill button, `h-10 rounded-xl border border-border/60 bg-card/60 hover:bg-card`, leading icon (primary tint), label text, chevron right. Matches the look already used by `DeckLanguageSelector` but full-width and with a top label row.
  - Popover: framer-motion fade/slide (same timing as `DeckLanguageSelector`), `rounded-xl border bg-popover shadow-xl z-[100]`, max-h with scroll, check icon on active item, optional right-aligned hint (e.g. `Fluid`, `16:9`, `4:3`).
  - Outside-click + Escape to close. Keyboard up/down/enter navigation.
  - Used by Card size, Scenario, Audience, Tone (all share identical styling).

- **New `DeckFormatPicker.tsx`**: 2×2 grid of square cards (icon top, label bottom), selected card gets `border-primary bg-primary/5 text-primary` plus a filled check circle in the top-left, matching screenshot 1. Icons: `Presentation`, `Globe`, `FileText`, `Smartphone`.

- **New `DeckAspectRatioPicker.tsx`**: Segmented pill row, three options with small frame icon + ratio label. Active = `border-primary bg-primary/10 text-primary`.

- **New `DeckAdvancedPanel.tsx`** (single card that wraps the new controls so the layout looks like screenshots 1–6):
  ```
  ┌─ Format ──────────────────────────┐
  │ [Presentation] [Webpage]          │
  │ [Document]     [Social]           │
  │ Card size ▾  Traditional   16:9   │
  ├───────────────────────────────────┤
  │ Scenario ▾   General              │
  │ Audience ▾   Auto    Tone ▾ Neutral│
  │ Aspect Ratio  [16:9][4:3][1:1]    │
  │ Additional instructions           │
  │ [ textarea autosize           ]   │
  └───────────────────────────────────┘
  ```
  - Header row collapsible (chevron at top-right) like screenshot 1, default expanded on desktop, collapsed on mobile.
  - Uses semantic tokens only (`bg-card/60`, `border-border/60`, `text-foreground`, `text-muted-foreground`, `text-primary`).

- **Textarea**: `react-textarea-autosize`, `minRows={2} maxRows={5}`, `rounded-xl border bg-card/60` to match other tool prompt bars (per project memory).

## DeckPage integration

`src/pages/DeckPage.tsx`:
- New state: `format` ('presentation' default), `cardSize` ('traditional'), `scenario` ('general'), `audience` ('auto'), `tone` ('neutral'), `aspectRatio` ('16:9'), `additionalInstructions` ('').
- Render `<DeckAdvancedPanel ... />` immediately after the existing Slides/Language/Image-style options card, before `DeckTextContentCard`.
- Pass new fields into `deckApi.generate(...)` via an options object (extend the existing positional call to accept an object for new params to avoid a long signature).

## Service + Edge function

- **`src/services/deckApi.ts`**: extend `generate()` to accept `{ format, cardSize, scenario, audience, tone, aspectRatio, additionalInstructions }` and include them in the request body.
- **`supabase/functions/deck-generate/index.ts`**: read the new fields, append them as guidance lines to the system prompt only when not `auto`/empty (e.g. `Scenario: Project Report`, `Audience: Students`, `Tone: Professional`, `Additional instructions: ...`). `aspectRatio` and `cardSize` are passed through into the returned deck metadata so the viewer can later honor them — no slide-rendering changes in this scope.

## Out of scope

- No changes to slide rendering, slideshow, export, or pricing.
- No changes to theme/text-content/art-style components.
- `format` other than `presentation` is wired into state and the request body, but actually rendering Webpage / Document / Social outputs is a follow-up.

## Files

- new: `src/components/deck/DeckDropdown.tsx`
- new: `src/components/deck/DeckFormatPicker.tsx`
- new: `src/components/deck/DeckAspectRatioPicker.tsx`
- new: `src/components/deck/DeckAdvancedPanel.tsx`
- edit: `src/components/deck/index.tsx` (exports)
- edit: `src/pages/DeckPage.tsx` (state + render)
- edit: `src/services/deckApi.ts` (params)
- edit: `supabase/functions/deck-generate/index.ts` (prompt guidance)
