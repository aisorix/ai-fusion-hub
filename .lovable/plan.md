

# Redesign Sorix Imagine UI - Simple, Clean, Futuristic

## What's Changing

The current layout has a large empty square placeholder that wastes space and looks basic. The redesign will make it compact, modern, and futuristic -- inspired by clean AI tool interfaces.

## Design Changes

### 1. Remove the Large Empty Placeholder
- Replace the big square "Your creation will appear here" box with a smaller, subtle indicator
- When no image is generated yet, show a minimal centered message with a small icon (no giant box)
- The page should feel prompt-first, not canvas-first

### 2. Rearrange Layout: Prompt First
- Move the prompt bar higher -- it should be the hero element
- Below prompt: style carousel
- Below styles: generated image (only appears after generation)
- This makes the flow: type prompt -> pick style -> see result

### 3. Compact Header
- Keep header minimal but add a subtle gradient accent line under it
- Remove the "12K tokens/image" badge from header (redundant, shown below prompt)

### 4. Futuristic Empty State
- Instead of a dashed-border square, show a sleek centered message with animated gradient text
- Something like "Describe anything. We'll create it." with a subtle shimmer effect
- Much smaller footprint -- just 2-3 lines of text, not a giant box

### 5. Better Canvas When Image Exists
- Image appears with a smooth fade-in and subtle glow border
- Actions (download/share/copy) appear as a floating toolbar below the image
- Rounded corners with a thin gradient border

### 6. Improved Loading State
- Replace the large square loading with a compact progress bar or a small centered spinner
- Show the prompt text being processed with a typing animation

### 7. Style Carousel Polish
- Make chips slightly smaller and more pill-shaped
- Add a subtle scroll indicator on mobile

---

## Technical Details

### Files Modified

**`src/pages/ImaginePage.tsx`**
- Reorder layout: prompt bar first, then styles, then canvas
- Remove "12K tokens/image" badge from header
- Add subtle gradient line under header

**`src/components/imagine/ImagineCanvas.tsx`**
- Redesign empty state: small centered text with shimmer, no large box
- Redesign loading state: compact with progress indicator
- Add gradient border glow to generated image

**`src/components/imagine/ImaginePromptBar.tsx`**  
- Add subtle gradient border glow effect
- Make it the visual hero of the page

**`src/components/imagine/ImagineStyleCarousel.tsx`**
- Slightly smaller, more refined chip styling

