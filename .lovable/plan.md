## Goal
Make `/agent` look and behave perfectly on small screens (360–414px). Today the input bar wraps onto multiple lines, controls feel cramped, the Task Monitor is unreachable, and the empty-state cards plus header text overflow.

## Changes

### 1. `src/components/cowork/CoWorkLayout.tsx` — mobile header + monitor access
- Truncate the subtitle on mobile (`hidden xs:block` / `truncate max-w-[55vw]`) so "Your Tasks, Handled by Intelligence." doesn't push the layout.
- Add a mobile-only **Tasks** button in the top bar (right side) that opens `TaskMonitor` as a bottom sheet (same pattern as the Connectors sheet that already exists).
- Reuse the existing bottom-sheet wrapper styling for both Tasks and Connectors (drag handle, max-h 85vh, rounded-t-3xl, backdrop blur).
- Keep the desktop right-panel toggle untouched.

### 2. `src/components/cowork/CommandCenter.tsx` — compact input bar
The bottom control row currently uses `flex-wrap` and renders 6 visible controls with text labels, which wraps on 390px. Rework it:

- Remove `flex-wrap`; use a single row with `min-w-0` and `gap-0.5 sm:gap-1`.
- **Pills become icon-only on mobile**: hide the "Tools", "Apps", and model `short` text labels behind `hidden sm:inline`. Keep the count badge on Apps and the chevron on the model pill.
- Reduce pill padding on mobile (`p-2 sm:pl-2 sm:pr-2.5`) so they read as round icon buttons under `sm`.
- Mic: hide on mobile (`hidden sm:inline-flex`) since it is non-functional ("coming soon"). This frees space for the model + send.
- Send button: keep `p-2` on mobile so it stays prominent.
- Header inside `CommandCenter` ("Command Center / Ready"): shrink to `text-xs` on mobile and add `truncate`.

Result on 390px: `[+] [Tools-icon] [Apps-icon•N]   [Model-icon ▾] [Send]` — fits in one row with breathing room.

### 3. Empty state grid (inside CommandCenter)
- Change suggestion cards to `py-3.5 px-2 gap-2` and `text-[13px]` on mobile; keep `py-5` on `sm+`.
- Icon size `w-5 h-5` on mobile, `w-6 h-6` on `sm+`.
- Container `max-w-[20rem]` so the 2×2 grid never touches the edges on 360px.
- Hello/heading: `text-lg sm:text-xl`; reduce top padding (`pt-4 sm:pt-8`) so the cards aren't pushed below the fold.

### 4. Popovers and sheets
- Attach `+` popover: keep desktop popover; on mobile render as a bottom sheet (same pattern already used for Integrations) so it doesn't get clipped near the screen edge.
- Model picker on mobile: render as a compact bottom sheet with the 4 model rows (no truncation). On desktop keep the existing `absolute bottom-full right-0 w-56` popover.
- Integrations sheet: already a bottom sheet on mobile; just make sure the close-on-overlay backdrop is `z-[105]` and the sheet itself `z-[110]` so it sits above the input bar's focus ring.

### 5. Disclaimer + spacing
- Reduce input container padding on mobile (`p-2 sm:p-4`) and disclaimer to `text-[10px]` with `mt-1.5`.
- Remove the outer `px-1 sm:px-2` so the chat bar uses full mobile width.

### 6. No regressions
- Desktop layout (`md+`) is unchanged: labels visible, mic visible, right Task Monitor panel intact.
- Keep all existing handlers (`closeAllPopovers`, `handleSend`, `handleFiles`) untouched.

## Files touched
- `src/components/cowork/CoWorkLayout.tsx`
- `src/components/cowork/CommandCenter.tsx`

No backend, schema, or routing changes.
