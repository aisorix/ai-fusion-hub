

## Fix FlowBuilder Mobile Header — Export, New & History Buttons

### Problem
On mobile, the export buttons (PNG, SVG, PDF) show text labels taking too much space, and the New Diagram + History buttons crowd the header row.

### Changes

**`src/components/flowbuilder/FlowExportActions.tsx`** (lines 131-139)
- Hide text labels on mobile: wrap "PNG", "SVG", "PDF" text in `<span className="hidden md:inline">` so mobile shows icon-only
- Reduce mobile padding to `px-1.5 py-1`

**`src/pages/FlowBuilderPage.tsx`** (lines 93-125)
- Remove the duplicate mobile/desktop blocks (lines 94-117) — use a single responsive `FlowExportActions` since it will handle its own responsiveness
- Keep the "New" button icon-only on mobile (already is), with `px-1.5 py-1` sizing
- Keep History button as-is (already icon-only, compact)
- Reduce `gap-1` between buttons on mobile for tighter fit

### Result
Mobile header fits cleanly in one row: `← [icon] Sorix FlowBuilder ... [📷][📄][📝][+][🕐]` — all icon-only, compact. Desktop unchanged with full text labels.

