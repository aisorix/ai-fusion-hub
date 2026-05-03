## Fixes

### 1. Agent input `+` popup not working
In `src/components/cowork/CommandCenter.tsx`, the attach button uses `closeAllPopovers()` then toggles. When `+` is clicked, `closeAllPopovers` first sets `showAttachMenu=false`, then `setShowAttachMenu(v => !v)` flips the **previous** state via the functional setter — this part is fine. The real issue: the popover mounts with a `<div className="fixed inset-0 z-40" onClick={close} />` backdrop AND uses the same React batch tick — clicking `+` opens the popover and the backdrop appears at the same z-stack underneath the dropdown. But the parent button click also bubbles to the document; since attach button is INSIDE the input container, this should be fine. The likely actual cause: the popover is hidden because the parent input bar uses `overflow-x-auto` on the left cluster (`overflow-x-auto scrollbar-none`), which clips the absolutely-positioned popover.

**Fix**: Remove `overflow-x-auto scrollbar-none` from the left cluster wrapper. Use `flex-wrap` (or just `flex-nowrap`) and let the bar scroll-as-needed via the model/integration pills being optional. Also ensure each popover container has `relative` and the popover has `z-[110]` to stay above the backdrop.

### 2. Tools button should open the same Sorix Tools popup as main chat
Replace the placeholder Tools button (which currently just shows a toast) with the existing `<ToolsMenu>` component used in `ChatInput.tsx`. Wrap it in a `relative` div, add `showToolsMenu` state, and pass `open` / `onClose`. Mutual-exclusion with other popovers via `closeAllPopovers`.

### 3. Move Model selector and Mic to the right cluster
Re-arrange the bottom controls in the agent input bar:
- **Left cluster**: `+` (attach), `Tools` pill, `Apps` (integrations) pill.
- **Right cluster**: Model selector pill, Mic button, Send button.

Model popover changes `left-0` → `right-0` so it opens upward-aligned to the right.

### 4. Add "Sorix Agent" entry to main chat Tools menu
In `src/components/aichat/ToolsMenu.tsx`, add a new tool entry at the top of the `tools` array:
```ts
{ id: 'agent', name: 'Sorix Agent', nameBn: 'সরিক্স এজেন্ট',
  desc: 'Autonomous task executor', descBn: 'স্বয়ংক্রিয় কাজ সম্পাদনকারী',
  icon: Bot, route: '/agent',
  gradient: 'from-cyan-500 to-teal-500', free: false }
```
Add `Bot` to the lucide-react imports.

## Files

- `src/components/aichat/ToolsMenu.tsx` — add Sorix Agent entry + Bot icon import.
- `src/components/cowork/CommandCenter.tsx` — drop `overflow-x-auto` clipping; replace Tools placeholder with real `<ToolsMenu>`; move Model + Mic to right side; align Model popover to `right-0`.

No backend or other component changes.