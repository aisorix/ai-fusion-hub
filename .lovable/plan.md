

## Fix Agent Chat Input Position on All Devices

### Problem
The chat input bar in Sorix Agent goes below the visible area on mobile because `CoWorkLayout` uses `h-screen` which doesn't account for mobile browser chrome (address bar, bottom nav). The main chat page already uses `h-[100dvh]` to handle this correctly.

Additionally, the empty state in `CommandCenter` uses `min-h-[60vh]` which can push the input out of view on shorter screens.

### Changes

**`src/components/cowork/CoWorkLayout.tsx`** (line 24)
- Change `h-screen` to `h-[100dvh]` to properly account for mobile browser chrome on all devices

**`src/components/cowork/CommandCenter.tsx`** (line 121)
- Change `min-h-[60vh]` to `min-h-0 flex-1` on the empty state container so it fills available space without pushing the input below the viewport
- The empty state should use the flex parent's remaining space rather than forcing a viewport-relative minimum height

### Result
- Input bar stays fixed at the bottom on mobile, tablet, and desktop
- Empty state content centers within available space without overflowing
- Matches the same viewport approach used by the main chat page

