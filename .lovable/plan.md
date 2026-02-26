

## Problem

The history **is saving correctly** to the database (confirmed: 10+ deck entries exist in `analysis_history`). The problem is the **query times out** when reading history back. The `analysis_history` table is **158 MB** and the query selects `result_data` which contains full slide data with base64-encoded images. Every query returns a 500 error: `"canceling statement due to statement timeout"`.

## Plan

### 1. Stop selecting `result_data` in `getHistory()` — `src/services/deckApi.ts`
- Change `.select('id, title, input_data, result_data, created_at')` to `.select('id, title, input_data, created_at')`
- This avoids fetching massive base64 image blobs for the list view
- Update `DeckHistoryItem` type: make `result_data` optional since it won't be in list responses
- For slide count display, use `input_data.slideCount` instead of `result_data.slides.length`

### 2. Fetch full data only when loading a specific presentation — `src/services/deckApi.ts`
- Add a new `getPresentation(id: string)` method that fetches a single row with `result_data` included
- This is fast because it's a single row by primary key

### 3. Update `DeckHistory.tsx` to show slide count from `input_data`
- Change `{item.result_data?.slides?.length || 0} slides` to `{item.input_data?.slideCount || 0} slides`

### 4. Update `DeckPage.tsx` history load flow
- When user clicks a history item, call `deckApi.getPresentation(item.id)` to fetch the full slide data before loading it

### 5. Fix other tools too — `AgroHistory.tsx`, `HealthHistory.tsx`, `LegendHistory.tsx`
- All use `select('*')` which will hit the same timeout as the table grows
- Change to exclude `result_data` from list queries
- Each already shows minimal info in the list so this is safe

## Files to Modify
1. `src/services/deckApi.ts` — Remove `result_data` from list query, add `getPresentation()` method
2. `src/components/deck/DeckHistory.tsx` — Use `input_data.slideCount` for count display
3. `src/pages/DeckPage.tsx` — Fetch full presentation data on history item click
4. `src/components/agro/AgroHistory.tsx` — Exclude `result_data` from list query
5. `src/components/health/HealthHistory.tsx` — Exclude `result_data` from list query
6. `src/components/legends/LegendHistory.tsx` — Exclude `result_data` from list query

