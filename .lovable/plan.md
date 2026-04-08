

## Fix FlowBuilder Header for Mobile View

### Problem
On a 390px mobile screen, the header crams too many elements into a single row: back arrow, icon, title, 3 export buttons (PNG/SVG/PDF), New button, and History button. This causes overflow and elements get cut off or overlap.

### Solution
Make the header responsive by reorganizing elements on mobile:

**`src/pages/FlowBuilderPage.tsx`** (header section, lines 76-112)

1. **Top row (mobile)**: Keep back arrow, icon + title on the left; only History button on the right
2. **Export buttons row**: Move `FlowExportActions` and "New" button to a second row below the title, only visible when there's code to export
3. On desktop (`md:` breakpoint), keep everything in one row as-is

Specifically:
- Wrap the header content in a flex-col on mobile, flex-row on md+
- First row: back + title + history (always visible)
- Second row (only when `code.trim()`): export buttons + New button, centered or left-aligned with small padding

**`src/components/flowbuilder/FlowExportActions.tsx`** (lines 130-140)
- Make export buttons slightly more compact on mobile: reduce `px-3` to `px-2` and `gap-1.5` to `gap-1` on small screens, or use icon-only on mobile

### Result
- Title and icon fully visible on mobile
- Export actions accessible in a clean second row
- No overflow or clipping on small screens

