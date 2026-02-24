

# Sorix Deck — Fix Art Style Image Prompts + Add Slideshow Mode

## Overview
Two improvements:
1. **Fix art style handling** so the selected style (3D, Photo, etc.) is strongly enforced in image generation prompts — currently the instruction is weak and only skips "illustration" style entirely
2. **Add fullscreen slideshow mode** so users can present slides directly in the browser with keyboard navigation

---

## 1. Fix Art Style in Image Prompts

### Problem
The current edge function only adds the art style instruction when the style is NOT "illustration" (line 101-103). Even when it does add it, it's a weak instruction at the end of the system prompt. The LLM may not consistently prepend the style to every `image_prompt`.

### Solution
Make the art style instruction mandatory for ALL styles (including "illustration") and make it more explicit:

**File: `supabase/functions/deck-generate/index.ts`**
- Change the art style instruction to ALWAYS be included (remove the `artStyle !== "illustration"` skip)
- Make the instruction stronger and more specific for each style:
  - `illustration` -> "digital illustration style, hand-drawn aesthetic"
  - `photo` -> "photorealistic, high-resolution photograph"
  - `abstract` -> "abstract art style, geometric shapes, non-representational"
  - `3d` -> "3D rendered, CGI, three-dimensional modeling, Blender/Cinema4D quality"
  - `line-art` -> "minimalist line art, black and white ink drawing, clean outlines"
  - Custom -> user's description
- Add the style directive BOTH in the system prompt AND by modifying each slide's `image_prompt` after LLM generation (belt-and-suspenders approach) before sending to FLUX.2

### Changes
- Modify the system prompt to always include art style with stronger wording
- After parsing LLM JSON, prepend the art style description to each slide's `image_prompt` before image generation to guarantee the style is applied

---

## 2. Add Fullscreen Slideshow Mode

### New File: `src/components/deck/DeckSlideshow.tsx`

A fullscreen overlay component that renders slides one at a time:

**Features:**
- Fullscreen dark overlay covering entire viewport
- Current slide rendered at aspect-ratio 16:9, centered and scaled to fit
- Slide number indicator (e.g., "3 / 10") in bottom-right corner
- Keyboard navigation: Left/Right arrows, Space for next, Escape to exit
- Smooth fade/slide transitions between slides using framer-motion
- Uses the same theme styling as `DeckSlideCard` (reuses `themeClasses`)
- Close button (X) in top-right corner

**Layout per slide:**
- `full-image`: Full background image with heading overlay at bottom
- `split`: Left half text, right half image (same as card but larger)
- `text-only`: Centered heading + bullet points

### Modified Files

**`src/components/deck/DeckActions.tsx`**
- Add a "Slideshow" button (Play icon) that triggers the slideshow

**`src/pages/DeckPage.tsx`**
- Add `showSlideshow` state
- Render `DeckSlideshow` component when active
- Pass slides, theme, and close handler

**`src/components/deck/index.tsx`**
- Export new `DeckSlideshow` component

---

## Technical Details

### Edge Function Art Style Fix (deck-generate/index.ts)

The art style mapping will be:
```text
const artStyleMap = {
  "illustration": "digital illustration, hand-drawn artistic style",
  "photo": "photorealistic high-resolution photograph",
  "abstract": "abstract art, geometric shapes, vibrant non-representational",
  "3d": "3D rendered CGI, three-dimensional modeling, studio lighting",
  "line-art": "minimalist line art, clean ink outlines, black and white sketch",
};
```

After LLM returns slides JSON, each slide's `image_prompt` will be prefixed:
```text
slide.image_prompt = `${artStyleDescription}, ${slide.image_prompt}`
```

This guarantees FLUX.2 receives the style directive directly in the prompt, not relying on LLM to include it.

### Slideshow Component Structure

```text
+--------------------------------------------------+
|                                          [X]     |
|                                                  |
|         +-----------------------------+          |
|         |                             |          |
|         |     Slide Content           |          |
|         |     (themed, 16:9)          |          |
|         |                             |          |
|         +-----------------------------+          |
|                                                  |
|    [<]              3 / 10               [>]     |
+--------------------------------------------------+
```

Keyboard: Arrow Left/Right, Space (next), Escape (close)

### Files Summary

| File | Action |
|------|--------|
| `supabase/functions/deck-generate/index.ts` | Fix art style prompt injection |
| `src/components/deck/DeckSlideshow.tsx` | New fullscreen slideshow component |
| `src/components/deck/DeckActions.tsx` | Add Slideshow button |
| `src/pages/DeckPage.tsx` | Add slideshow state and rendering |
| `src/components/deck/index.tsx` | Export DeckSlideshow |

