## Goal
Make every chat/prompt input bar **always ready for typing** — no manual click needed. Apply on mount, after sending, after attaching files (picker / drag-drop / paste / camera), and after closing menus.

## Files to update
All input bars across the app:

1. `src/components/aichat/ChatInput.tsx` — main AI chat
2. `src/components/aichat/SharedChatInput.tsx` — shared chat link
3. `src/components/chat/ChatInput.tsx` — support widget
4. `src/components/imagine/ImaginePromptBar.tsx` — Sorix Imagine
5. `src/components/deck/DeckPromptBar.tsx` — Sorix Deck
6. `src/components/flowbuilder/FlowPromptBar.tsx` — FlowBuilder
7. `src/components/legends/LegendChat.tsx` — Sorix Legends
8. `src/components/cowork/CommandCenter.tsx` — Sorix Agent
9. `src/components/health/HealthChatMode.tsx` — Sorix Health chat
10. `src/components/agro/AgroChatMode.tsx` — Sorix Agro chat

(Intake forms in Health/Agro are excluded — those are multi-field forms, not single prompt bars.)

## Pattern applied to each file
- Add a `textareaRef` (or reuse existing) on the prompt textarea.
- `useEffect` on mount → focus the textarea.
- `useEffect` on `pendingAttachments.length` (or local attachment state) → focus when count increases.
- `useEffect` on `isParsing` / `isUploading` → focus when it transitions `true → false`.
- After `onSend`/submit → focus (most already do this; standardize).
- Skip auto-focus while a blocking modal/camera viewfinder is open or `disabled` is true.

## Shared helper (optional)
Create `src/hooks/useAutoFocusInput.ts` that takes `(ref, deps[], { skipWhen })` and centralizes the three effects. Each prompt bar then calls it once. Reduces duplication and keeps behavior identical everywhere.

## Notes
- Mobile iOS: programmatic `.focus()` may not open the keyboard without a prior user gesture — that's a Safari limitation. Desktop and Android get full auto-focus on every event.
- No visual or layout changes. Behavior-only update.
- Save a memory entry: "All prompt input bars auto-focus on mount, after send, and after attachment changes."
