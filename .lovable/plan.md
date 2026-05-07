# Mobile UX & History Fixes

Four targeted fixes across input bars, the Agent page, and tool history panels.

## 1) Mobile-only "stay focused" after upload (don't steal focus on desktop)

Current `useAutoFocusInput` re-focuses every time deps change on every device. On mobile that's exactly what's wanted after an upload, but on desktop the user complaint history shows we should only force-focus on mount + after sending; not pop the keyboard around. Refine the hook so the *re-focus after deps change* behavior is mobile-aware.

**`src/hooks/useAutoFocusInput.ts`**
- Add a third option `mobileOnlyDeps: boolean` (default false). When true, the dep-driven re-focus only fires if `window.matchMedia('(max-width: 767px)').matches`. Initial mount focus still always runs.
- Keep API backward compatible: existing call sites work unchanged.

**Update existing callers (10 files)** to pass `mobileOnlyDeps: true` so dep-triggered re-focus only happens on mobile (matches the user's exact phrasing: "for mobile view when user upload file then user can typing… otherwise previous style for mobile view always"):
- `ChatInput.tsx` (main), `SharedChatInput.tsx`, `chat/ChatInput.tsx`, `ImaginePromptBar.tsx`, `DeckPromptBar.tsx`, `FlowPromptBar.tsx`, `LegendChat.tsx`, `cowork/CommandCenter.tsx`, `HealthChatMode.tsx`, `AgroChatMode.tsx`.

Initial-mount focus and post-send focus stay universal (already handled).

## 2) Sorix Agent (mobile): input bar drifts down + Tasks sheet behind header

**`src/components/cowork/CommandCenter.tsx`**
- Wrap messages container so it's `flex-1 min-h-0 overflow-y-auto` and the input area is `shrink-0` (currently the input area lacks `shrink-0`, so a long chat pushes it past the viewport on mobile `100dvh`). Concretely: confirm root `flex flex-col h-full`, change input wrapper `<div className="p-2 sm:p-4 border-t…">` → add `shrink-0`. Also add `min-h-0` to the messages scroll wrapper.
- The header has `relative z-[100]` — fine.

**`src/components/cowork/CoWorkLayout.tsx`**
- Mobile Tasks bottom sheet currently uses `z-50`, but the top bar / Agent header use `z-[100]`. Bump the Tasks overlay + sheet to `z-[120]` so it sits above the Command Center header.
- Same bump for the Mobile Connectors sheet for consistency.

## 3) Sorix Imagine: History panel must overlay the input bar

**`src/pages/ImaginePage.tsx`**
- The prompt bar wrapper uses `relative z-[60]`. The History overlay uses `z-40` and panel `z-50`, so it renders **behind** the prompt. Raise overlay to `z-[200]` and the sliding panel to `z-[210]`. (Aligns with our existing convention from PaymentModal note in memory.)

## 4) Tool History: reopen a previous item exactly as it was created (all tools, all viewports)

User reports: clicking a previous Imagine history item doesn't open it. Root cause: `handleHistorySelect` sets `imageUrl` but **also closes the history panel and** `ImagineCanvas` is rendered inside the main scroll column far below the prompt — on mobile/tab the user doesn't see it scroll into view, so it looks like "nothing happened". Same UX gap exists across other tools.

Fix pattern (apply to Imagine first, mirror to Deck/Flow/Health/Agro/Legends history selectors):

**`src/pages/ImaginePage.tsx`**
- After `handleHistorySelect`: also `setSelectedStyle` / `setSelectedModel` from the saved record (when the fields exist on `ImageGeneration` — `style`, `model`) so the canvas and selectors reflect the original generation state.
- After state updates, scroll the canvas into view: keep a `canvasRef` on the `ImagineCanvas` wrapper and call `canvasRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })` inside a `requestAnimationFrame`.
- Open behavior on mobile/tab/desktop is now identical: panel closes → page smoothly scrolls to show the restored image with its prompt + actions, exactly like right after creation.

**Mirror the same scroll-into-view + full-state restore in:**
- `DeckPage.tsx` → restore deck slides + scroll to slide viewer.
- `FlowBuilderPage.tsx` → restore mermaid + scroll to canvas.
- `HealthPage.tsx` → restore intake + results + scroll to results card.
- `AgroPage.tsx` → restore form + results + scroll to results.
- `LegendsPage.tsx` → restore conversation + scroll to chat bottom.

(Each page already has `handleLoadHistory`/`handleHistorySelect`; we extend them, no new APIs.)

## Out of scope
- No backend changes. History data already contains everything needed (we just weren't applying all of it on the client).
- No visual redesign of history cards.

## Technical notes
- Mobile detection in the hook uses `window.matchMedia` (matches existing `use-mobile.tsx` breakpoint of 768).
- `scrollIntoView` is wrapped in `requestAnimationFrame` so it runs after React commits the new state (image src, etc.) to ensure the target element exists.
- z-index stack chosen to stay below toasts (`Sonner` typically `z-[9999]`) but above all in-page popovers (`z-[100..110]`).
