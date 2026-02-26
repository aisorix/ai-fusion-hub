

## Problem Analysis

1. **History loading is slow**: The `analysis_history` table is 159 MB across 60 rows (deck entries are 5-9 MB each with base64 images). Even though `getHistory` excludes `result_data`, the table's TOAST overhead slows queries. When clicking a history item, `getPresentation` fetches 8+ MB with no loading indicator -- user sees nothing for a long time or gets a timeout error.

2. **Mobile slide cards**: Already using `grid-cols-2` -- this matches what the user wants (desktop-like layout). No change needed here.

3. **Mobile slideshow**: Currently uses `grid-cols-1 md:grid-cols-2` for split layout, stacking on mobile. User wants desktop-like side-by-side layout on mobile too.

## Plan

### 1. Add loading state when clicking history item -- `DeckPage.tsx`
- Add `historyLoadingId` state to show a spinner on the clicked history item while `getPresentation` fetches the full 8MB+ data
- Pass this loading state to `DeckHistory` so the clicked item shows a spinner
- Add a timeout/error handling with toast feedback

### 2. Add loading indicator to history items -- `DeckHistory.tsx`  
- Accept `loadingId` prop
- Show a spinner on the item being loaded instead of the Presentation icon

### 3. Fix history query with statement timeout -- `deckApi.ts`
- Add `.abortSignal()` or increase timeout awareness
- Add error handling that retries once on timeout

### 4. Fix mobile slideshow to use desktop layout -- `DeckSlideshow.tsx`
- Change split layout from `grid-cols-1 md:grid-cols-2` to `grid-cols-2` (always side-by-side)
- Keep `aspect-video` on mobile for consistent 16:9 ratio
- Remove `min-h-[60vw] md:aspect-video` conditional and use `aspect-video` always

## Files to Modify
1. `src/pages/DeckPage.tsx` -- Add loading state for history item click
2. `src/components/deck/DeckHistory.tsx` -- Show spinner on loading item
3. `src/components/deck/DeckSlideshow.tsx` -- Use `grid-cols-2` always for split layout on mobile

