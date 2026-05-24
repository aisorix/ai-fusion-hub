## Goal
Remove the mobile collapse/dropdown behavior on the Image settings panel. Always show the full panel (aspect, format, resolution, count) like the expanded screenshot — on every viewport.

## Change
**`src/components/imagine/ImagineOptionsPanel.tsx`**
- Drop the `useIsMobile` import and the `openMobile` state.
- Remove the mobile-only collapsible header button (Settings2 + summary + chevron).
- Always render the settings rows; remove the `{expanded && ...}` wrapper and its `mt-3.5` mobile spacing.
- Keep the panel padding (`p-3.5 sm:p-5`), spacing (`space-y-3.5 sm:space-y-4`), and the `grid-cols-2` aspect/format layout that already works on mobile.

No other files touched. No logic, store, or API changes.
