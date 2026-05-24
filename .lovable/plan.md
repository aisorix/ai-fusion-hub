# Polish Imagine Options Panel

Refine `src/components/imagine/ImagineOptionsPanel.tsx` so the Aspect Ratio, Output Format, Resolution, and Number of Outputs controls feel premium and on-brand.

## Changes

### 1. Replace generic icons with contextual ones
- **Aspect Ratio dropdown**: per-option icons — `Square` (1:1), `RectangleHorizontal` (16:9, 4:3, 3:2, 21:9), `RectangleVertical` (9:16, 3:4, 2:3). Trigger shows the icon of the current value (no more static `Square` for every option).
- **Output Format dropdown**: `ImageIcon` for webp/png, `FileImage` for jpg. Show small uppercase format tag (e.g. "WEBP").
- **Resolution segments**: prepend `Sparkles` for 2K/4K (Pro tiers) and keep 1K clean. Lock icon stays for gated tiers but moves to a small badge in the top-right corner instead of inline.
- **Outputs segments**: `Grid2x2` / `LayoutGrid` glyph next to count for 2/3/4; single dot indicator for 1.

### 2. Button / segment style refinement
- Increase height from `h-9` → `h-10`, radius `rounded-lg` → `rounded-xl`.
- Active state: soft gradient `bg-gradient-to-br from-primary/15 to-primary/5`, `border-primary/50`, subtle inner ring `ring-1 ring-primary/20`, and `shadow-[0_2px_12px_-2px_hsl(var(--primary)/0.35)]`.
- Inactive state: `bg-card/60` with `hover:bg-card hover:border-primary/30` and a smooth `transition-all duration-200`.
- Locked tiers get a small floating `Lock` chip (top-right, `bg-background/80 backdrop-blur`) instead of an inline icon so the label stays centered.

### 3. Dropdown trigger refinement
- Add a leading icon slot (per-value, not fixed).
- Right side: animated chevron with `rotate-180` on open already exists — add `text-primary` tint when open.
- Popover: `rounded-2xl`, `border-border/80`, `shadow-xl`, item rows get a subtle left accent bar (`before:` pseudo via a small div) when selected.

### 4. Section labels
- Upgrade `<Label>` to include a tiny leading dot (`bg-primary/60`) + uppercase tracking-wide (`tracking-[0.08em]`) for an editorial feel. Keep size `text-[11px]`.

### 5. Panel container
- Soften: `rounded-2xl` → `rounded-3xl`, add `shadow-[0_8px_30px_-12px_hsl(var(--foreground)/0.08)]` and a faint top border highlight (`before:` gradient line).

## Scope
- **Only edits** `src/components/imagine/ImagineOptionsPanel.tsx`.
- No prop changes, no logic changes, no other files touched.
- Uses existing semantic tokens (`primary`, `border`, `card`, `muted-foreground`, `popover`) — no hardcoded colors.
