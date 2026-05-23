# Fix: Mobile keyboard breaks prompt bars on space / predictive typing

## Problem
On mobile (Gboard, SwiftKey, iOS keyboard), pressing space or accepting a predictive suggestion fires a synthetic `keydown` event where `e.key === 'Enter'` (with `keyCode === 229` or `isComposing === true`). Our `handleKeyDown` does:

```ts
if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
```

So mid-typing, the message gets submitted and the textarea cleared — user has to start over. This affects every input bar in the app.

## Root cause
Missing IME-composition guard. The standard fix is to ignore Enter while the input method editor is active.

## Fix
Add a single shared helper and use it in every prompt bar's `handleKeyDown`:

```ts
// src/lib/inputHelpers.ts
export const isSubmitEnter = (e: React.KeyboardEvent) =>
  e.key === 'Enter' &&
  !e.shiftKey &&
  !e.nativeEvent.isComposing &&
  (e as any).keyCode !== 229;
```

Then replace the guard in each file:

```ts
if (isSubmitEnter(e)) { e.preventDefault(); handleSend(); }
```

## Files to update
- `src/lib/inputHelpers.ts` — new, exports `isSubmitEnter`
- `src/components/aichat/ChatInput.tsx` — line ~107
- `src/components/aichat/SharedChatInput.tsx` — line ~113
- `src/components/cowork/CommandCenter.tsx` — line ~104
- `src/components/legends/LegendChat.tsx` — line ~205
- `src/components/imagine/ImaginePromptBar.tsx` — line ~87
- `src/components/flowbuilder/FlowPromptBar.tsx` — line ~87
- `src/components/deck/DeckPromptBar.tsx` — line ~87

Also add `enterKeyHint="send"` and `inputMode="text"` props on each `TextareaAutosize` so the mobile keyboard shows a proper Send button instead of a newline key, which further reduces accidental submits.

## Scope
Surgical: only the keydown guard and two textarea props per file. No behavior change on desktop (Enter still submits, Shift+Enter still newlines). No backend / business-logic changes.

## Verification
- Desktop: Enter submits, Shift+Enter inserts newline (unchanged).
- Mobile: typing "hello world subscription" with spaces between words no longer submits/clears the box. Tapping the keyboard's "Send" button still submits.
