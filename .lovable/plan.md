

## Fix FlowBuilder Exports to Match Preview Exactly

### Problem
The exported PNG/PDF don't match the preview because:
1. The SVG rendered by Mermaid uses `inherit` for fonts and relies on page CSS — when serialized and loaded into an `<img>`, those styles are lost
2. The SVG viewBox/dimensions may not be properly captured, causing clipping or wrong sizing
3. The cloned SVG doesn't include computed styles (colors, fonts, backgrounds)

### Fix

**`src/components/flowbuilder/FlowExportActions.tsx`** — Rewrite export logic to properly capture the full diagram:

1. **Inline all computed styles** into the cloned SVG before serialization — walk all SVG child elements, copy `getComputedStyle()` properties (fill, stroke, font-family, font-size, color, etc.) as inline styles so they survive serialization
2. **Use the SVG's viewBox** (from `getBBox()`) to set proper width/height on the clone, adding padding so nothing is clipped
3. **Add a white background rect** as the first child of the cloned SVG so exports have a clean white background
4. **Set explicit `xmlns`** on the cloned SVG to ensure proper rendering in `<img>`
5. **For PDF**: add padding around the image in the PDF page so it's not edge-to-edge

### Key Changes

- New helper `cloneWithInlineStyles(svg)` — deep clones the SVG and walks all elements copying computed styles inline
- New helper `prepareSvgForExport(svg)` — handles viewBox, dimensions, xmlns, background rect
- Updated `exportPNG` / `exportPDF` / `exportSVG` to all use these helpers
- PNG exports at 2x resolution for crisp output
- PDF uses proper page margins

Single file change: `src/components/flowbuilder/FlowExportActions.tsx`

