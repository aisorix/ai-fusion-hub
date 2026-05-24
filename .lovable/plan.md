# Sorix Imagine — Pro Redesign Plan

## 1. Model Lineup (replace existing)

Remove all Flux entries currently present. New models in this exact order:

| # | Display Name | Model ID | Tier |
|---|---|---|---|
| 1 | Riverflow V2 Fast (default) | `sourceful/riverflow-v2-fast-preview` | Free |
| 2 | Nano Banana | `google/gemini-2.5-flash-image` | Free |
| 3 | Nano Banana 2 | `google/gemini-3.1-flash-image-preview` | Free |
| 4 | Nano Banana Pro | `google/gemini-3-pro-image-preview` | Pro/Premium |
| 5 | GPT-5 Image | `openai/gpt-5-image-mini` | Free |
| 6 | GPT Image 2 | `openai/gpt-5.4-image-2` | Pro/Premium |
| 7 | Grok Imagine | `x-ai/grok-imagine-image-quality` | Free |
| 8 | ByteDance Seedream 4.5 | `bytedance-seed/seedream-4.5` | Free |
| 9 | FLUX.2 Max | `black-forest-labs/flux.2-max` | Pro/Premium |
| 10 | FLUX.2 Pro | `black-forest-labs/flux.2-pro` | Pro/Premium |

Edge function `ALLOWED_MODELS` + `PRO_ONLY_MODELS` updated to match. Default fallback becomes `sourceful/riverflow-v2-fast-preview`.

## 2. New Generation Controls

Replace the Style carousel with a compact **Options panel** placed above the canvas:

- **Aspect Ratio** dropdown: `1:1 (Square)`, `16:9 (Landscape)`, `9:16 (Portrait)`, `4:3`, `3:4`, `3:2`, `2:3`, `21:9 (Ultrawide)`
- **Resolution** segmented buttons: `1K` · `2K` · `4K` (2K/4K = Pro+)
- **Output Format** dropdown: `webp` (default) · `png` · `jpg`
- **Number of Outputs** segmented buttons: `1` · `2` · `3` · `4` (2+ costs N × tokens; 3/4 = Pro+)

Style section is fully removed. Selected values drive width/height (computed from aspect × resolution) sent to the edge function.

## 3. Prompt Bar — In-Bar Model Selector

Move model picker **inside** `ImaginePromptBar`, anchored to the right of the textarea (left of the Send button):

```text
┌─────────────────────────────────────────────────────┐
│ [+] Describe your image…           [Model ▾] [Send] │
└─────────────────────────────────────────────────────┘
```

- Compact pill with model emoji + short name, click opens a polished popover listing all 10 models with Lock badges and tier chips.
- Standalone `ImagineModelSelector` row above the canvas is removed.

## 4. Loading State — Premium Skeleton

Replace the spinner with a **shimmer skeleton** sized to the chosen aspect ratio:

- Rounded card with animated gradient sweep (subtle primary→pink→cyan), soft pulsing ring, layered glow shadow.
- Floating caption: "Painting your vision…" + elapsed timer.
- For multi-output, render N skeletons in a responsive grid.

## 5. Layout Order (top → bottom)

```text
Header (back · title · history btn)
─────────────────────────────────────
Prompt Bar  (with in-bar model picker)
Token meter (small, muted)
Options Panel (Aspect · Resolution · Format · Outputs)
Current Generation Canvas (skeletons while loading, grid of results after)
   ↓ visual gap (py-10)
"Your Creations" heading
Inline History Feed  (masonry/grid, infinite scroll, click to reopen)
```

The slide-in History panel button stays in the header for the full archive view.

## 6. Inline History Feed

New component `ImagineHistoryFeed` reusing `imagineApi.getHistory()`:

- Responsive grid (2 cols mobile, 3 md, 4 lg), rounded thumbnails with hover lift.
- Click → loads image into canvas + scrolls up.
- Auto-refreshes after each new generation.

## 7. Files Touched

**Frontend**
- `src/components/imagine/ImagineModelSelector.tsx` — rewrite as popover used inside prompt bar; export updated `imageModels` list.
- `src/components/imagine/ImaginePromptBar.tsx` — embed model picker on the right.
- `src/components/imagine/ImagineOptionsPanel.tsx` *(new)* — aspect / resolution / format / outputs controls.
- `src/components/imagine/ImagineCanvas.tsx` — new shimmer skeleton, multi-output grid, aspect-aware sizing.
- `src/components/imagine/ImagineHistoryFeed.tsx` *(new)* — inline grid feed.
- `src/pages/ImaginePage.tsx` — new layout, state for aspect/resolution/format/count, remove style carousel, wire history feed.
- `src/services/imagineApi.ts` — extend `generateImage` payload with `aspectRatio`, `resolution`, `format`, `count`; return `imageUrls[]`.
- Delete: `src/components/imagine/ImagineStyleCarousel.tsx` usage (file can stay unused or be removed).

**Backend**
- `supabase/functions/imagine/index.ts`
  - Update `ALLOWED_MODELS` + `PRO_ONLY_MODELS`.
  - Accept `aspectRatio`, `resolution`, `format`, `count`; compute width/height; loop N generations; gate 2K/4K and count>2 to Pro/Premium.
  - Token cost = `TOKENS_PER_IMAGE × count × (resolution multiplier: 1K=1, 2K=2, 4K=4)`.
  - Return `imageUrls: string[]` + persist each row in `image_generations`.

## 8. Tiering & Token Rules

- Free: Riverflow V2 Fast, Nano Banana, Nano Banana 2, GPT-5 Image, Grok Imagine, Seedream 4.5 — 1K only, count 1–2.
- Pro/Premium: all models + 2K/4K + count 3–4.
- Locked controls show a lock icon and open the existing `UpgradePlanModal`.

## 9. Design Tokens

All colors via existing semantic tokens (`primary`, `muted`, `card`, etc.). Skeleton uses `bg-gradient-to-r from-muted via-muted/40 to-muted` with `animate-shimmer` keyframe added to `tailwind.config.ts` + `index.css`.

## 10. Out of Scope

- No DB schema change (existing `image_generations` columns are sufficient; `width`/`height` already stored).
- No changes to other tools or auth.
