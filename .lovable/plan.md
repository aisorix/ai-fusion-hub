## Goal
Make `/imagine` feel professional on mobile (≤640px) and tablet (641–1024px). Desktop layout stays as-is. Pure presentation polish — no logic, store, or API changes.

## Pain points today (at 390px and ~820px)
- Header: title + subtitle stack tight against icon, history button is a plain ghost — looks unfinished.
- Prompt bar: send/mic/model cluster crowds at narrow widths; Tools pill + model pill compete for space, often wrapping awkwardly.
- Options panel: 3 stacked rows take huge vertical space on phone; aspect + format dropdowns force 2 taps before user even sees canvas.
- Canvas empty / generating states: padding looks lost on phone; skeleton card is too tall on portrait aspects.
- Token line is a tiny grey line in dead space.
- Explorer tabs (Templates / Your Creations) sit edge-to-edge with no breathing room on mobile; template grid card heights are inconsistent on tablet.

## Changes

### 1. `src/pages/ImaginePage.tsx` — layout rhythm
- Container: change `max-w-3xl mx-auto px-4 py-6 md:py-10 flex flex-col gap-5` → `max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 pt-3 pb-6 sm:pt-5 sm:pb-8 md:pt-8 flex flex-col gap-4 sm:gap-5`.
- Move the token-remaining line into a small pill row: centered, `inline-flex items-center gap-1.5 rounded-full border border-border/50 bg-card/60 px-2.5 py-1 text-[10.5px]` with a tiny coin/dot before the number. Keeps it readable on phones.
- Collapse the visual gap div (`py-4`) to `py-2 sm:py-4`.

### 2. `src/pages/ImaginePage.tsx` — header polish
- Header height: `h-14` stays on desktop, becomes `h-12` on mobile.
- Right side: replace bare `<History>` button with a labelled pill on `sm:` (`History` + icon) and a 36×36 rounded-xl icon button on mobile with subtle border (`border border-border/60 bg-card/60`).
- Title/subtitle: hide subtitle (`AI Image Generation`) below `sm`, keep only `Sorix Imagine` to avoid wrap on 360–390px.

### 3. `src/components/imagine/ImaginePromptBar.tsx` — narrow-width cluster
- Bottom action row becomes responsive:
  - Mobile (<640px): wrap left & right clusters on two rows when both content + model name overflow — use `flex-wrap gap-y-1.5`.
  - "Tools" pill: show icon-only on `<sm`, icon+label on `sm+` (`<span className="hidden sm:inline">Tools</span>`).
  - Model selector trigger already pills; ensure it `max-w-[140px] sm:max-w-none truncate`.
  - Mic button stays `hidden sm:inline-flex`.
- Shell padding: `px-1.5 sm:px-3 pt-1 pb-1.5`; textarea `text-[14.5px] sm:text-base`.

### 4. `src/components/imagine/ImagineOptionsPanel.tsx` — compact, collapsible on mobile
- Wrap the whole panel in a collapsible "Advanced options" section on `<sm`:
  - Header row: `Settings2` icon + "Image settings" label + chevron + a tiny summary (`1:1 · 1K · WebP · ×1`) on the right.
  - Tap to expand; default collapsed on mobile, default open on `sm+`.
  - Use local `useState` only — no store changes.
- When expanded on mobile: change Row 1 grid from `grid-cols-1 sm:grid-cols-2` to `grid-cols-2` (aspect + format side-by-side even on phone) since dropdowns are narrow buttons.
- Resolution & Number-of-Outputs SegBtn height: keep `h-10` for proper touch target. Reduce inner text to `text-[12px]` on mobile to prevent crowding for 4-button row.
- Panel padding: `p-3.5 sm:p-5`; vertical spacing `space-y-3.5 sm:space-y-4`.

### 5. `src/components/imagine/ImagineCanvas.tsx` — phone-friendly canvas
- Wrap container: add `px-0.5 sm:px-0` so card shadows aren't clipped on phone.
- Skeleton: cap visual height on phone with `max-h-[70vh]` to avoid 9:16 skeleton pushing prompt bar offscreen.
- Empty state copy unchanged but increase top padding to `py-6 sm:py-8`.
- Action row on mobile: keep horizontal scroll-safe by changing wrapper to `flex-nowrap overflow-x-auto scrollbar-hide px-1 -mx-1` so Download / Share / Copy never wrap to a second line awkwardly.

### 6. `src/components/imagine/ImagineExplorer.tsx` — tab rhythm
- Tab row: add `px-1 sm:px-0` and `gap-4 sm:gap-6` so the two tabs breathe on phone.
- Each `TabBtn`: increase touch target to `pb-3 pt-2` and `text-[13.5px] sm:text-[14px]`.
- When a template/creation grid loads, ensure its parent uses `min-h-[40vh]` so the tab strip doesn't reflow when switching.

### 7. `src/components/imagine/ImagineTemplates.tsx` (embedded mode only)
- Card grid: switch from current responsive to `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3`.
- Each card: enforce `aspect-[4/5]` (poster-like), `rounded-2xl`, image `object-cover w-full h-full`, hover overlay with title; on mobile show static title chip at the bottom (`absolute inset-x-2 bottom-2 px-2 py-1 rounded-lg bg-background/80 backdrop-blur text-[11px] font-medium truncate`).
- This is presentation-only — no template-data changes.

### 8. `src/components/imagine/ImagineHistoryFeed.tsx`
- Match the same grid (`grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`) and card shape (`aspect-[4/5] rounded-2xl`) so the two tabs feel like a single system.
- Empty state on mobile: centered icon + one-line copy, `py-10`.

## Out of scope
- No changes to generation logic, model list, store, edge functions, or token math.
- Desktop (≥1024px) visuals untouched aside from inherited spacing tokens.
- No new dependencies.
