# Deck Editor: Top Toolbar + Undo/Redo + Theme Switch

Three focused changes to the post-generation editor.

## 1. Move "+ New" to the top toolbar (right corner)

Today `DeckCreateNewButton` lives at the top **and** bottom of `DeckEditorSidebar`. The user wants it out of the sidebar and onto the same top action bar that holds Slideshow / Export PDF / Export PPTX / JSON, anchored to the **right corner**, labeled **"Create New One"**.

**Edits:**
- `DeckCreateNewButton.tsx` — add a `label` prop (default `"New"`) so we can render `"Create New One"` in the toolbar variant while keeping a compact `"New"` style available if needed elsewhere.
- `DeckEditorSidebar.tsx` — remove both `DeckCreateNewButton` mounts (top tab row + bottom footer). Keep only the tabs and add-slide controls.
- `DeckPage.tsx` — in the editor header strip, wrap `DeckActions` + the new button in a single flex row: `<div className="flex items-center justify-between gap-2">` → `DeckActions` on the left, `DeckCreateNewButton` (label `"Create New One"`) on the right. Wire its `onBlank` → `handleCreateNew`, `onFromPrompt` → opens existing AI dialog flow (reuse `DeckAiSlidePromptDialog` lifted into `DeckPage` or expose a callback that resets and focuses the prompt bar — simplest: call `handleCreateNew()` then auto-scroll to prompt).

## 2. Undo / Redo for manual + AI edits

Any change to `slides` (inline text edit, bullet add/remove, image regenerate/replace, blank insert, AI-inserted slide, duplicate, delete, layout change, theme change) should be reversible step-by-step.

**Approach:** lift a small history stack inside `DeckPage.tsx`.

- New state: `history: { slides: Slide[]; theme: DeckTheme }[]` + `historyIndex: number`.
- Wrap the existing `setSlides` and `setSelectedTheme` mutations with a single `commit(nextSlides, nextTheme?)` helper that:
  - Truncates `history` to `historyIndex + 1`,
  - Pushes the new snapshot (cap at ~50 entries, drop oldest),
  - Advances `historyIndex`.
- `undo()` / `redo()` move the index and restore `slides` + `theme` from the snapshot without re-pushing.
- Reset history when a new generation finishes (snapshot becomes index 0) or when `handleCreateNew` runs.

**UI:** add two ghost icon buttons (`Undo2`, `Redo2` from lucide) into the same top toolbar row, left of `DeckActions` (or grouped with it). Disabled state when at start/end of history. Keyboard: `Ctrl/Cmd+Z` = undo, `Ctrl/Cmd+Shift+Z` (or `Ctrl+Y`) = redo, ignored when focus is in inputs/textareas.

Pass `onUndo`, `onRedo`, `canUndo`, `canRedo` down only to the toolbar; internal mutation paths in `DeckEditor` already funnel through `onSlidesChange`, so they automatically participate in history.

## 3. Theme switching after generation

After a deck exists, the user wants to change the theme without regenerating.

- Add a compact `DeckThemePicker` trigger into the top toolbar (icon + current theme swatch, opens a small popover with the existing theme grid — reuse `DeckThemePicker` or wrap it in a popover).
- Selecting a theme calls `commit(slides, newTheme)` so it lands in the undo stack alongside content edits.
- `DeckEditor` already receives `theme` as a prop and re-renders slide previews accordingly — no further wiring needed beyond passing the live `selectedTheme`.

## Files touched

- `src/pages/DeckPage.tsx` — toolbar layout, history state + commit helper, undo/redo handlers, keyboard shortcuts, theme popover, wire `setSlides`/`setSelectedTheme` through `commit`.
- `src/components/deck/editor/DeckCreateNewButton.tsx` — `label` prop.
- `src/components/deck/editor/DeckEditorSidebar.tsx` — remove top + bottom `DeckCreateNewButton`; tighten footer.
- (Optional) tiny new wrapper `src/components/deck/editor/DeckThemePopover.tsx` if `DeckThemePicker` doesn't already work in a popover context.

## Out of scope

- No backend changes, no edge-function changes, no export changes.
- History is in-memory only (cleared on route leave) — persistence can come later if requested.
