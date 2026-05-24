## Imagine — Tabbed Explorer + Real Template Thumbnails

Two changes:

### 1. Tabbed switcher (matches upload 1)

Replace the stacked "Templates" + "Your Creations" sections with a single **tabbed explorer** placed below the canvas:

```text
┌────────────────────────────────────┐
│  ✦ My Images   ⏱ Templates         │  ← underline tab bar
│ ────────────                        │
│  [grid of user creations]           │
└────────────────────────────────────┘
```

- **My Images** (default, position 1) — the existing `ImagineHistoryFeed` grid.
- **Templates** (position 2) — the existing template gallery (category pills + card scroller).
- Active tab uses primary-colored underline + icon (✦ sparkle for My Images, ⏱ history-style icon for Templates, matching the upload).
- Tab labels stay left-aligned; category pills for Templates move inside the Templates tab panel.

Implementation: new wrapper `ImagineExplorer.tsx` that renders the tab bar and conditionally shows `ImagineHistoryFeed` or `ImagineTemplates`. `ImaginePage.tsx` replaces the current two-section render with `<ImagineExplorer />`.

### 2. Real template thumbnails

Replace gradient-only cards with **actual generated sample images** for every template. Each template still keeps a prompt + aspect + resolution, but the card now displays a real photo/illustration that visually demonstrates the style (like upload 1 — Monochrome shows a real monochrome portrait, Colour block shows a real colour-block room, etc.).

**Asset generation:** Use `imagegen--generate_image` (fast model, 512×640, jpg) once per template — 37 images total — saved under `src/assets/templates/{id}.jpg`. Each generation uses a compact, visually faithful prompt derived from the template's full prompt. After generation, QA by viewing 4–6 sample thumbnails to confirm they look professional; regenerate any that fail.

**Card layout (refined):**
- Real image as background (`object-cover`)
- Soft bottom gradient overlay for label readability
- Title bottom-left, white, drop-shadow
- "Photo" badge top-left for `needsPhoto` templates (unchanged)
- Hover: scale `1.03` + primary glow shadow (unchanged)

**Static asset map:** `ImagineTemplates.tsx` imports all 37 images via ES module imports and maps `id → imported asset`. Card renders `<img src={asset} />` instead of the gradient div. Gradient stays as a fallback skeleton while the image loads.

The preview dialog (`ImagineTemplatePreview.tsx`) also uses the real image. "Use as Reference" now attaches the real asset URL (via `fetch → blob → dataURL`) to the prompt bar — much cleaner than the previous SVG-foreignObject capture trick.

### Files

- **Create**: `src/components/imagine/ImagineExplorer.tsx`, `src/assets/templates/*.jpg` (37 sample images)
- **Edit**: 
  - `src/components/imagine/ImagineTemplates.tsx` — drop category-section header (now lives in ExplorerTab), add image import map, render real images on cards
  - `src/components/imagine/ImagineTemplatePreview.tsx` — render real image, swap reference-capture logic to fetch the asset
  - `src/pages/ImaginePage.tsx` — replace separate sections with `<ImagineExplorer />`

### Technical notes

- Image generation is the slow step (~37 calls, batched in parallel groups of 6 to avoid rate limits). Total time ≈ 2–4 min.
- Cards use `loading="lazy"` and a small blurred placeholder div behind the `<img>` so layout doesn't shift.
- All styling stays on semantic tokens (`primary`, `border`, `card`, `muted-foreground`).
- No backend / edge function changes.
