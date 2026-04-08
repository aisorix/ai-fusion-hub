

## Fix FlowBuilder: Exports, New Diagram Button, Preview Zoom, Black & White Theme

### Issues Identified

1. **Export not working**: `getSvgElement()` queries `[data-diagram-container] svg` but `data-diagram-container` is on a parent `div` in `FlowBuilderPage.tsx`, while the actual SVG is rendered inside `FlowCanvas` in a nested `diagramRef` div. The CSS selector fails because the SVG is deep inside the component tree and `[data-diagram-container]` is not a direct parent of the Mermaid SVG — the `FlowCanvas` component wraps it in additional divs.

2. **No "New Diagram" button**: Once a diagram is created, there's no way to clear and start fresh.

3. **Preview zoom issues**: The diagram uses CSS `transform: scale()` which doesn't resize the container — content can overflow or be clipped. Need proper overflow handling and the SVG should not be constrained by `max-w-full`.

4. **Missing Black & White theme**: User wants a simple B&W theme positioned first in the list.

### Changes

**1. `src/components/flowbuilder/FlowExportActions.tsx`**
- Fix `getSvgElement()` to use a more reliable selector: query the `diagramRef` container directly by searching for any rendered Mermaid SVG on the page via `document.querySelector('#diagram-preview-container svg')` or pass a ref
- Better approach: add an `id="diagram-preview-container"` to the diagram div in FlowCanvas, then query `#diagram-preview-container svg`
- Add `crossOrigin` handling and proper SVG dimension extraction for reliable PNG/PDF export (use `svg.getBBox()` or `svg.getAttribute('width/height')` for canvas sizing when `img.width/height` is 0)

**2. `src/components/flowbuilder/FlowCanvas.tsx`**
- Add `id="diagram-preview-container"` to the `diagramRef` div so exports can find the SVG
- Fix preview: remove `[&_svg]:max-w-full` constraint, allow SVG to render at natural size
- Improve zoom: wrap diagram in a scrollable container with `overflow: auto`, use `transform-origin: top left` so zoomed content scrolls naturally

**3. `src/pages/FlowBuilderPage.tsx`**
- Add a "New Diagram" button (with `Plus` icon) in the header area, visible only when `code` is not empty
- Clicking it clears `code` to empty string, resetting to template view

**4. `src/components/flowbuilder/FlowStylePanel.tsx`**
- Add `{ id: 'bw', name: 'Black & White', colors: ['#000000', '#ffffff', '#666666'] }` as the first item in `colorThemes` array

### Technical Details

- Export fix: The root cause is the SVG selector. Adding a stable `id` to the diagram container in FlowCanvas and updating the selector in FlowExportActions ensures all three export formats (PNG, SVG, PDF) work reliably.
- For PNG/PDF: handle edge case where `img.naturalWidth` may be 0 by falling back to SVG viewBox/width attributes.
- New Diagram button: simple `setCode('')` call, uses `FilePlus` icon from lucide-react.

