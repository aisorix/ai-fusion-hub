

## Problem Analysis

Two issues identified:

1. **Slow history loading**: The `getHistory()` query uses `select('*')` on `analysis_history` which fetches full `result_data` (containing all slide data with image URLs) for every history item. This is heavy data that's not needed for the list view. The network logs confirm statement timeouts (503/500 errors).

2. **History not immediately updated after generation**: After generating a presentation, the code increments `refreshHistory` which triggers a full database refetch. Instead, the newly generated presentation should be added to the local history cache instantly.

## Plan

### 1. Optimize `deckApi.getHistory()` in `src/services/deckApi.ts`
- Change `select('*')` to `select('id, title, input_data, created_at, result_data')` -- but more importantly, we need to avoid fetching full slide data for the list
- Actually, the list only needs `id`, `title`, `created_at`, and the slide count from `result_data`. But since we can't partially select JSONB fields via PostgREST, we should keep the select but add `user_id` filter explicitly (RLS already handles this but explicit filter helps the query planner use the composite index)
- Add explicit `.eq('user_id', userId)` filter to leverage the composite index `(user_id, tool, created_at DESC)`
- Select only needed columns: `id, title, input_data, result_data, created_at`

### 2. Pre-fetch history on page mount in `src/pages/DeckPage.tsx`
- Fetch history eagerly when DeckPage mounts (not just when panel opens)
- Store history items in DeckPage state
- Pass cached items to DeckHistory component

### 3. Instant local cache update after generation in `src/pages/DeckPage.tsx`
- After successful generation, immediately prepend the new item to the local history array
- No need for a full refetch -- the new item is already known locally

### 4. Update `DeckHistory.tsx` to accept pre-fetched data
- Accept optional `items` prop from parent
- Only fetch if no cached items provided, or on explicit refresh

## Files to Modify

1. **`src/services/deckApi.ts`**: Optimize `getHistory` with explicit user_id filter and column selection
2. **`src/pages/DeckPage.tsx`**: Pre-fetch history on mount, maintain local history state, instantly add new items after generation
3. **`src/components/deck/DeckHistory.tsx`**: Accept cached items from parent, avoid redundant fetches

