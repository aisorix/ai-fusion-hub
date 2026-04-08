

## Fix FlowBuilder PNG & PDF Export — Tainted Canvas

### Root Cause

The error `Tainted canvases may not be exported` occurs because the SVG is loaded into an `<img>` via a Blob URL (`URL.createObjectURL`). Browsers treat blob-loaded SVGs as cross-origin, tainting the canvas and blocking `canvas.toDataURL()`.

### Fix

**`src/components/flowbuilder/FlowExportActions.tsx`**

Replace the Blob URL approach with a **base64 data URI** for loading the SVG into the image element. Data URIs are same-origin and don't taint the canvas.

Change in both `exportPNG` and `exportPDF`:
```
// Before (tainted):
const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
const url = URL.createObjectURL(svgBlob);
img.src = url;

// After (safe):
const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
img.src = dataUrl;
```

Remove the `URL.revokeObjectURL(url)` calls since data URIs don't need cleanup. Single file change, two functions updated.

