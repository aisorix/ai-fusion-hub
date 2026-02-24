
# Sorix Deck Enhancement — More Slides, Text Content, Image Art Styles, and Expanded Themes

## Overview
Enhance Sorix Deck with three major features inspired by Gamma AI:
1. **Extended slide counts** (up to 30) plus a custom input option
2. **Text content density selector** (Minimal, Concise, Detailed, Extensive)
3. **Image art style selector** (Illustration, Photo, Abstract, 3D, Line Art, Custom)
4. **Expanded theme library** — from 4 themes to 20+ named themes (Gamma-style grid picker in a modal)

---

## 1. Extended Slide Counts + Custom Input

### Current
Fixed buttons: `[3, 5, 8, 10]`

### New
Buttons: `[3, 5, 8, 10, 12, 15, 20, 25, 30, Custom]`
- "Custom" opens a small inline number input (1-50 range)
- Displayed as a scrollable row of chips

### Files changed
- `src/pages/DeckPage.tsx` — update SLIDE_COUNTS array, add custom input state, pass new params to API

---

## 2. Text Content Density Selector

A new component `DeckTextContentPicker.tsx` mimicking the 2nd reference image:
- 4 options: **Minimal**, **Concise** (default), **Detailed**, **Extensive**
- Each shown as a card with visual lines representing text density
- Selected card gets a blue border highlight
- The value is passed to the edge function which adjusts the system prompt:
  - Minimal: 2-3 short bullet points per slide
  - Concise: 3-4 bullet points per slide (current default)
  - Detailed: 4-6 bullet points, longer text
  - Extensive: 5-8 bullet points with detailed descriptions

### Files changed
- New: `src/components/deck/DeckTextContentPicker.tsx`
- `src/pages/DeckPage.tsx` — add state, pass to API
- `src/services/deckApi.ts` — add `textContent` param
- `supabase/functions/deck-generate/index.ts` — adjust system prompt based on textContent value

---

## 3. Image Art Style Selector

A new component `DeckArtStylePicker.tsx` mimicking the 1st reference image:
- Options: **Illustration**, **Photo**, **Abstract**, **3D**, **Line Art**, **Custom**
- Displayed as a horizontal scrollable row of themed cards (no uploaded images — use gradient/icon placeholders or emoji icons)
- "Custom" option shows a text input for the user to describe their style
- The selected art style is prepended to each `image_prompt` in the edge function system prompt

### Files changed
- New: `src/components/deck/DeckArtStylePicker.tsx`
- `src/pages/DeckPage.tsx` — add state, pass to API
- `src/services/deckApi.ts` — add `artStyle` param
- `supabase/functions/deck-generate/index.ts` — inject art style into image prompt instructions

---

## 4. Expanded Theme Library (20+ Themes)

Replace the current 4-circle theme picker with a Gamma-style theme grid modal.

### New Themes (inspired by reference images)

| Theme Name | Background | Text | Card BG |
|-----------|-----------|------|---------|
| Dark | gray-900 | white | gray-800 |
| Cyan Blue | cyan-600 to blue-700 | white | -- |
| Minimalist | white | gray-900 | gray-50 |
| Sunset | orange-500 to purple-700 | white | -- |
| Pearl | gray-100 | gray-900 | white with gray border |
| Vortex | black | white | gray-900 |
| Clementa | amber-100 | amber-800 | cream |
| Stratos | navy-900 | white | dark navy |
| Nova | blue-500 to purple-500 | white | white card |
| Twilight | rose-200 to slate-400 | rose-900 | cream |
| Creme | stone-200 | stone-800 | cream |
| Lux | teal-900 | emerald-200 | teal-800 |
| Marine | teal-800 | white | dark teal |
| Consultant | gray-100 | gray-800 | white |
| Lavender | violet-200 | violet-900 | white |
| Indigo | indigo-900 | white | indigo-800 |
| Gamma | rose-50 | orange-600 title, gray-800 body | white card |
| Founder | purple-900 | white | gray-700 |
| Atmosphere | pink gradient | pink-600 | white |
| Blueberry | purple-900 | white | purple-800 |
| Sage | green-100 | green-900 | white |
| Coal | teal-900 | white | gray-800 |

### UI Design
- Current inline picker becomes a button "Choose Theme" that opens a modal/sheet
- Modal displays themes in a 2-column (mobile) or 3-column (desktop) grid
- Each theme card shows a mini preview: colored background with inner card showing "Title" and "Body" text, just like the reference images
- Selected theme has a blue check mark and highlighted border

### Files changed
- `src/components/deck/DeckThemePicker.tsx` — complete rewrite with modal grid
- `src/components/deck/DeckSlideCard.tsx` — expand `themeClasses` record to support all new themes
- `src/components/deck/DeckActions.tsx` — expand `themeColors` for PDF/PPTX export
- `src/pages/DeckPage.tsx` — update DeckTheme type usage

---

## 5. Edge Function Updates

### System Prompt Changes
The system prompt in `deck-generate` will be enhanced to accept:
- `textContent`: adjusts bullet point count and verbosity
- `artStyle`: prepended to every `image_prompt` instruction

Example system prompt addition:
```
Text density: "${textContent}". 
- If "minimal": 2-3 very short bullet points
- If "concise": 3-4 bullet points  
- If "detailed": 4-6 longer bullet points
- If "extensive": 5-8 detailed bullet points

Image style: "${artStyle}". Prepend "${artStyle} style, " to every image_prompt.
```

---

## 6. Updated DeckPage Layout

The controls section below the prompt bar will be restructured:

```text
[Prompt Bar]

[Slides: 3|5|8|10|12|15|20|25|30|Custom]
[Text Content: Minimal|Concise|Detailed|Extensive]
[Image Style: Illustration|Photo|Abstract|3D|Line Art|Custom]
[Theme: Choose Theme button -> opens modal]

[Token info]
[Export actions]
[Generated slides]
```

---

## Technical Summary

### New Files (3)
- `src/components/deck/DeckTextContentPicker.tsx`
- `src/components/deck/DeckArtStylePicker.tsx`
- Updated barrel: `src/components/deck/index.tsx`

### Modified Files (5)
- `src/pages/DeckPage.tsx` — extended slide counts, custom input, new state for textContent + artStyle, pass to API
- `src/components/deck/DeckThemePicker.tsx` — rewrite to modal grid with 20+ themes
- `src/components/deck/DeckSlideCard.tsx` — expanded themeClasses for all new themes
- `src/components/deck/DeckActions.tsx` — expanded themeColors for export
- `src/services/deckApi.ts` — add textContent and artStyle params
- `supabase/functions/deck-generate/index.ts` — accept and use textContent + artStyle in system prompt

### No new dependencies needed
All built with existing Tailwind, framer-motion, lucide-react, and Radix dialog.
