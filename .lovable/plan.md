# Mobile keyboard: Enter inserts newline, only Send button submits

## What the user wants
On mobile, the keyboard's return/enter key should behave like Shift+Enter on desktop — insert a newline so users can type multi-line messages and spaces naturally. The on-screen Send (paper-plane) button is the only way to submit. Desktop behavior stays unchanged (Enter sends, Shift+Enter newline).

## Change
Extend the existing `isSubmitEnter` helper in `src/lib/inputHelpers.ts` so it also returns `false` on mobile / coarse-pointer / touch devices. Detection uses `window.matchMedia('(pointer: coarse)')` with a fallback to `'ontouchstart' in window`. This means Enter on mobile never triggers submit — the textarea's default newline insertion runs instead.

Also change `enterKeyHint="send"` → `enterKeyHint="enter"` on every prompt bar so the mobile keyboard shows a return/newline key icon (not "Send"), matching the new behavior.

## Files to update
- `src/lib/inputHelpers.ts` — add mobile guard inside `isSubmitEnter`.
- `src/components/aichat/ChatInput.tsx`
- `src/components/aichat/SharedChatInput.tsx`
- `src/components/cowork/CommandCenter.tsx`
- `src/components/legends/LegendChat.tsx`
- `src/components/imagine/ImaginePromptBar.tsx`
- `src/components/flowbuilder/FlowPromptBar.tsx`
- `src/components/deck/DeckPromptBar.tsx`

(Each of the 7 textareas only needs `enterKeyHint` flipped from `"send"` to `"enter"`.)

## Result
- Mobile: typing space + Enter inserts spaces and newlines freely; nothing submits except tapping the Send button.
- Desktop: Enter sends, Shift+Enter newlines (unchanged).
- IME composition guard from the previous fix is preserved.
