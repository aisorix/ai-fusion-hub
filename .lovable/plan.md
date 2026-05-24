## Sorix Imagine — Templates Gallery

Add a curated **Templates** section above "Your Creations" so users can one-click a styled prompt (and optionally attach a reference photo) instead of writing from scratch.

### What gets built

**1. New component: `ImagineTemplates.tsx`**
A horizontally scrollable, category-tabbed gallery of template cards inspired by uploads 1, 4, 5, 6.

Categories:
- **Styles** (from image 1): Monochrome, Colour Block, Runway, Risograph, Technicolour, Gothic Clay, Dynamite, Salon, Sketch, Cinematic, Steampunk, Sunrise
- **Creations** (from image 4): Product Ad, Fantasy Cover, Educational Diagram, Cosmic Infographic, Autumn Portrait, Cyberpunk Game, Manga Strip, Architecture, Recipe Infographic, Storybook
- **Portraits** (from image 5): Chibi, Professional Headshot, Logo Editor, 70s Street Style, Quality Enhancer, Comic Book, Virtual Try-On
- **Transforms** (from image 6, photo-required): Swap Background, Model Product Shot, 80s Anime, Style Transfer, Watercolour Portrait, Video Game, 3D Animation

Each template card shows:
- Sample image (rounded `aspect-[4/5]` thumbnail, hover scale, gradient label overlay)
- Title (bottom-left, like uploads 1/5/6)
- Optional badge: "Needs photo" for transform templates

**2. Template click behavior (matches uploads 3 & 7)**
Clicking a card opens a compact preview sheet:
- Left: sample image
- Right: Title, "Image Prompt" with copy button, full prompt text, suggested aspect ratio (e.g. "9:16  |  2K  |  1536×2752")
- Two CTAs:
  - **Use Prompt** — fills `ImaginePromptBar` text and applies suggested aspect/resolution
  - **Use as Reference** — attaches sample image to the prompt bar as image-to-image input (like upload 3 "Add a photo and describe changes")
- For "Needs photo" templates: only "Use Prompt" is enabled; a hint reads "Add a photo and describe changes" and opens the attach menu.

**3. Wiring into `ImaginePage.tsx`**
- Render `<ImagineTemplates />` directly above `<ImagineHistoryFeed />`
- Pass `onUseTemplate(prompt, aspect?, attachmentUrl?)` to populate `ImaginePromptBar` (via a new ref/imperative method or controlled `initialPrompt` prop)
- Sample images sourced via `imagegen` (one per template, stored under `src/assets/templates/`)

### Layout

```text
┌─────────────────────────────────────┐
│  [Prompt Bar with model picker]     │
│  [Options panel]                    │
│  [Canvas / generating]              │
│                                     │
│  ✦ Templates              [tabs]    │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ →        │
│  │  │ │  │ │  │ │  │ │  │           │
│  └──┘ └──┘ └──┘ └──┘ └──┘           │
│                                     │
│  ✦ Your Creations  24               │
│  [history grid]                     │
└─────────────────────────────────────┘
```

### Technical notes

- `ImagineTemplates.tsx` exports a static `TEMPLATES` array: `{ id, title, category, prompt, sampleAsset, suggestedAspect, suggestedResolution, needsPhoto }`.
- Category tabs are pill buttons; active uses the same `bg-gradient-to-br from-primary/15 to-primary/5` treatment as `ImagineOptionsPanel` for consistency.
- Cards: `rounded-2xl overflow-hidden border border-border/50`, hover `scale-[1.02]` + `shadow-[0_8px_30px_-12px_hsl(var(--primary)/0.4)]`.
- Preview sheet: shadcn `Dialog`, two-column on desktop, stacked on mobile.
- `ImaginePromptBar` gets a new optional prop `externalPrompt` + `externalAttachment` (controlled set from parent), plus calls `setAspect`/`setResolution` on parent when a template is applied.
- Sample images generated with `imagegen--generate_image` (fast model, 512×640) — ~30 assets total, named `tpl-{id}.jpg`.
- All styling uses semantic tokens (`primary`, `border`, `card`, `muted-foreground`).
- No backend / edge function changes.

### Files

- **Create**: `src/components/imagine/ImagineTemplates.tsx`, `src/components/imagine/ImagineTemplatePreview.tsx`, `src/assets/templates/*.jpg` (sample thumbnails)
- **Edit**: `src/pages/ImaginePage.tsx` (mount templates, wire callback), `src/components/imagine/ImaginePromptBar.tsx` (accept external prompt + attachment)
