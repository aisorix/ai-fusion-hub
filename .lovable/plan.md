## Goal
Show **Templates** (left) and **Your Creations** (right) as side-by-side tabs under the canvas on `/imagine`. Keep the existing labels exactly — no renaming.

## Changes

### 1. `src/components/imagine/ImagineExplorer.tsx`
- Tab order (left → right):
  1. **Templates** (default active) — `LayoutGrid` icon + count badge → renders `<ImagineTemplates embedded />`
  2. **Your Creations** — `Sparkles` icon → renders `<ImagineHistoryFeed />`
- Tab type: `'templates' | 'creations'`, default `'templates'`.
- Active tab: `text-primary` + primary underline. Inactive: `text-muted-foreground hover:text-foreground`.
- Tab row: `flex items-center gap-6 overflow-x-auto scrollbar-hide`; each button uses `whitespace-nowrap` so both tabs always render side by side.

### 2. `src/pages/ImaginePage.tsx`
- Remove the stacked `<ImagineTemplates />` + spacer + `<ImagineHistoryFeed />` block.
- Replace with a single:
  ```tsx
  <ImagineExplorer
    onSelectHistory={handleHistorySelect}
    refreshHistory={refreshHistory}
    onUseTemplate={handleUseTemplate}
  />
  ```
- Drop unused imports (`ImagineHistoryFeed`, `ImagineTemplates`); add `ImagineExplorer` import.
- Everything else (header, prompt bar, options panel, canvas, slide-in history panel, upgrade modal) stays untouched.

Pure presentation wire-up. No store, API, or generation-logic changes.
