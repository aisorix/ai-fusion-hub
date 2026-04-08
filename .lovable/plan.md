

## Make FlowBuilder Page Scrollable

### Problem
The page uses `overflow-hidden` on both the root container and the main content area, preventing users from scrolling down to see the preview and code editor properly.

### Changes

**`src/pages/FlowBuilderPage.tsx`**

1. **Line 66**: Change the root container from `overflow-hidden` to `overflow-y-auto`:
   - `h-[100dvh] flex flex-col bg-background overflow-hidden` → `min-h-[100dvh] flex flex-col bg-background`

2. **Line 115**: Change main from `overflow-hidden` to allow natural flow:
   - `flex-1 flex flex-col overflow-hidden` → `flex-1 flex flex-col`

3. **Line 116**: Remove `overflow-hidden` from the inner content div:
   - `flex flex-col gap-4 p-4 md:p-6 flex-1 overflow-hidden` → `flex flex-col gap-4 p-4 md:p-6 flex-1`

4. **Line 23** (separate fix): Change default theme to `'bw'`:
   - `useState('default')` → `useState('bw')`

This allows the entire page to scroll naturally so the code editor and preview are fully accessible.

