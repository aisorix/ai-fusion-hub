# Three precise fixes

## 1) Sorix Agent — input bar still drifts down on mobile

Root cause (new hypothesis, different from the last attempt): `CommandCenter` is `flex flex-col h-full` with `shrink-0` on the input and `min-h-0` on the messages — that's correct. But its **parent** in `CoWorkLayout.tsx` is missing the column-flex height constraint, so on mobile the Command Center column grows beyond `100dvh` and pushes the input below the viewport.

**`src/components/cowork/CoWorkLayout.tsx`**
- Line 89 wrapper: add `min-h-0` →  
  `<div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">`
- Line 91 Command Center column: add `min-h-0 h-full` →  
  `<div className={cn("flex-1 min-w-0 min-h-0 h-full", !showMonitor && "w-full")}>`

This is the standard "column flex child needs `min-h-0`" pattern — without it `h-full` on `CommandCenter` resolves to `auto` on mobile and the input rides down with the message list.

## 2) Sorix Imagine — clicking a history thumbnail does nothing

Root cause: in `src/components/imagine/ImagineHistory.tsx`, the click handler is on the `<img>`, but two absolute overlays (`absolute inset-0` gradient and `absolute bottom-0 ...` controls row containing the delete button) sit on top of the image. They have `opacity-0` on mobile (no hover) but **still receive pointer events**, swallowing the tap. That's why nothing opens.

Fix:
- Move `onClick={() => onSelect(gen)}` from the `<img>` up to the outer `motion.div` card.
- Add `pointer-events-none` to the gradient overlay div.
- Add `pointer-events-none` to the bottom info row, then `pointer-events-auto` on the delete `<button>` only.
- Keep `e.stopPropagation()` on delete so it doesn't also trigger select.

Result: tapping anywhere on a history card opens it on mobile/tablet/desktop. Existing `handleHistorySelect` (already restores prompt + style + model + scrolls canvas into view) then runs as intended.

Mirror the same overlay/click hygiene check (only where the same pattern exists) in `DeckHistory`, `FlowHistory`, `HealthHistory`, `AgroHistory` — those use button rows already so likely fine, but I'll verify and patch if any have the same trapping overlays.

## 3) Mobile: don't pop the keyboard when tapping tools / attach / mic; only auto-focus after a file is uploaded

Current `useAutoFocusInput` always focuses on mount. On mobile that means iOS/Android opens the keyboard immediately when the page loads, and any state change that re-runs the effect (opening the attach/tools menu) re-focuses too. User wants: on mobile, **no auto-focus on mount, no auto-focus when popovers toggle** — only auto-focus once `attachments.length` increases.

**`src/hooks/useAutoFocusInput.ts`**
- Add `mountOnMobile: boolean` behavior to the existing `mobileOnlyDeps` flag (or a new `skipMobileMount` flag, default true when `mobileOnlyDeps` is true). On mobile (`matchMedia('(max-width: 767px)').matches`) skip the initial mount focus entirely. Desktop keeps current behavior (focus on mount + on dep changes).
- For dep-driven re-focus on mobile: only focus when the relevant dep is `attachments.length` increasing. Cleanest implementation: track a ref of the previous deps array, and on mobile only focus if the **first dep** (`attachments.length` by convention in all callers) increased. We'll standardize: callers pass `attachments.length` as the **first** dep (already true in every caller). All other deps (popover toggles, parsing flags) are ignored on mobile.

**Caller alignment** — verify the first dep is `attachments.length` in:
`ChatInput.tsx`, `SharedChatInput.tsx`, `chat/ChatInput.tsx`, `ImaginePromptBar.tsx`, `DeckPromptBar.tsx`, `FlowPromptBar.tsx`, `LegendChat.tsx`, `cowork/CommandCenter.tsx`, `HealthChatMode.tsx`, `AgroChatMode.tsx`. Reorder where needed.

Net behaviour:
- **Mobile**: keyboard stays closed on page load and when the user taps Plus / Mic / Tools / Model picker. Keyboard opens automatically only after a file/image is added (and after sending a message that involved attachments).
- **Desktop**: unchanged — input is always ready for typing.

## Out of scope
No backend, no visual redesign, no new components.
