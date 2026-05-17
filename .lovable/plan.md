## Goal
Make the footer's Legal section sit on the same row as Company (and the other link columns) on desktop, instead of wrapping to a new row below.

## Cause
`src/components/Footer.jsx` uses `xl:grid-cols-6` while the brand block spans 2 columns. That leaves only 4 slots for 5 link columns (Features, Solutions, Resources, Company, Legal), so Legal wraps below.

## Change (single file: `src/components/Footer.jsx`)
1. Update the grid on line 33 to provide enough columns at large breakpoints:
   - `lg:grid-cols-4` → `lg:grid-cols-3` (keeps mobile/tablet untouched, avoids odd 4-col wrap mid-size)
   - `xl:grid-cols-6` → `xl:grid-cols-7`
2. Keep brand `col-span-2`. The 5 link columns (Features, Solutions, Resources, Company, Legal) then occupy the remaining 5 slots → Legal renders directly beside Company on `xl`.
3. On `lg` (3 cols), link sections naturally flow 3-per-row beneath the brand; Legal still ends adjacent to Company in reading order.

No content, routes, copy, or styling tokens change — purely a layout column-count tweak.

## Out of scope
- No changes to Navbar, links, or any other page.
- No new components or routes.
