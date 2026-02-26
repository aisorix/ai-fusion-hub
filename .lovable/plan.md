

## Problem Analysis

The Deck page has two mobile issues:

1. **Slideshow (fullscreen mode)**: Uses `aspect-video` with fixed padding (`p-8`), `grid-cols-2` for split layouts, and large font sizes that don't adapt well to small screens. Nav buttons overlap content. No touch/swipe support.

2. **Slide cards (after generation)**: `DeckSlideCard` uses `aspect-video` with `grid-cols-2` for split layouts, making text unreadably small on mobile. Font sizes and padding don't scale down enough.

## Plan

### 1. Fix `DeckSlideshow.tsx` - Mobile fullscreen presentation

- Reduce padding from `p-8` to `p-2 md:p-8`
- For **split layout** slides: change `grid-cols-2` to `grid-cols-1 md:grid-cols-2` on mobile -- stack image below text
- Scale down font sizes with mobile breakpoints (e.g. `text-lg md:text-2xl`)
- Make nav buttons smaller on mobile (`w-8 h-8` with smaller icons)
- Reduce slide counter and close button sizes for mobile
- Add touch swipe support using `onTouchStart`/`onTouchEnd` handlers for left/right navigation

### 2. Fix `DeckSlideCard.tsx` - Slide cards in the results list

- For **split layout**: change `grid-cols-2` to `grid-cols-1 md:grid-cols-2` on mobile -- stack vertically
- Remove `aspect-video` on mobile for split/text-only layouts so content isn't squished: use `aspect-auto md:aspect-video` or remove aspect constraint on small screens
- Adjust font sizes: headings `text-sm md:text-base lg:text-lg`, bullets `text-xs`
- Reduce padding on mobile

### 3. Fix `DeckPage.tsx` - Main page layout

- Reduce vertical padding on mobile: `py-4 md:py-8`
- Ensure slide count buttons wrap nicely on small screens (already uses `flex-wrap`, just verify)

## Files to Modify

1. **`src/components/deck/DeckSlideshow.tsx`**: Mobile-responsive slideshow with stacked layouts, smaller controls, touch swipe
2. **`src/components/deck/DeckSlideCard.tsx`**: Mobile-responsive slide cards with stacked split layout, adjusted aspect ratio
3. **`src/pages/DeckPage.tsx`**: Minor padding adjustments for mobile

