

## Fix Message Actions: Click-to-Show + Edit-and-Send

Two issues to address based on the screenshot reference:

### Problem
1. Mobile user message actions (edit/copy) are always visible — should only show on tap/click
2. Edit "Save" button does nothing useful — should update the message content and re-send it to get a new AI response

### Changes — `src/components/aichat/MessageBubble.tsx`

**1. Click-to-toggle actions on both mobile and desktop user messages**
- Remove the `onMouseEnter`/`onMouseLeave` hover pattern for user messages
- Instead, make the user message bubble itself clickable to toggle `showActions`
- On mobile: actions appear below bubble only when tapped (not always visible)
- On desktop: keep hover behavior for assistant messages, but user messages use click-toggle too
- Remove the `{isMobile && !isEditing && (` always-visible block (lines 238-248)
- Unify: show actions below the user bubble when `showActions` is true, hide when false, for both mobile and desktop

**2. Edit + Save = re-send message**
- Accept `sendMessage` from the `useAIChat` hook (passed via props or store)
- On "Save": update the message content in the store via `setMessages`, truncate messages after the edited one, then trigger `sendMessage(editContent)` to get a fresh AI response
- Add `onEditAndResend` callback prop to `MessageBubble` (or use store directly)

**3. Props change — pass `onEditAndResend` from parent**
- In `MessageList.tsx` or `ChatArea.tsx`, pass a handler that:
  1. Finds the edited message index
  2. Truncates messages to that point
  3. Updates the user message content
  4. Calls `sendMessage` with the new content

### Changes — `src/components/aichat/MessageList.tsx`
- Import `useAIChat` or get `sendMessage` + `setMessages` from store
- Pass `onEditAndResend` callback to each `MessageBubble`

### Changes — `src/components/aichat/ChatArea.tsx`
- Ensure `sendMessage` is accessible and passed down (may already be available)

