
# Comprehensive Bug Fixes and Feature Improvements

This plan addresses all 7 issues: smooth scrolling, profile sync, chat history management, sharing/collaboration, performance, mobile crash, and multi-window file upload.

---

## 1. Smooth Scrolling During AI Streaming (Main Chat + Multi-Window)

**Problem:** When the AI is streaming a response, scrolling up to read previous messages is janky -- the auto-scroll keeps fighting the user's scroll position.

**Fix:**
- In `src/hooks/useAutoScroll.ts`: Add `will-change: scroll-position` CSS hint for the container, use `scrollTo` with `behavior: 'auto'` during streaming (not smooth -- smooth causes frame drops), and debounce the scroll listener to reduce layout thrashing.
- In `src/components/aichat/MessageList.tsx`: Add `overscroll-behavior-y: contain` to prevent scroll chaining to the parent page.
- In `src/components/aichat/MultiWindowChat.tsx`: Apply the same `overscroll-behavior-y: contain` and `will-change: scroll-position` to each window's message container. Use `requestAnimationFrame` batching for scroll updates during streaming.

---

## 2. Instant Profile Updates Everywhere

**Problem:** When a user updates their name, phone, or avatar in Settings, the changes don't reflect in the Navbar, ChatSidebar, or MobileSidebar until a page refresh.

**Fix:**
- In `src/hooks/useUserProfile.ts`: Add a Supabase realtime subscription to the `profiles` table (filtered by `user_id`). When an UPDATE event fires, immediately refresh `avatarUrl` and `fullName` state.
- In `src/hooks/useAIChatAuth.ts`: After syncing auth user to chat store, also pull the latest `full_name` from the profiles table and update `useChatStore.user.name`.
- In `src/components/aichat/settings/ProfileTab.tsx` (or wherever profile save happens): After a successful save, also call `useChatStore.getState().setUser(...)` with the updated name/avatar so the Zustand store updates instantly without waiting for the realtime subscription.

---

## 3. Chat History Rename and Delete (Context Menu)

**Problem:** Chat history items in the sidebar have no way to rename or delete -- the second screenshot shows the desired UI (right-click or three-dot menu with Share, Pin, Rename, Delete).

**Fix in `src/components/aichat/ChatSidebar.tsx`:**
- Add a `DropdownMenu` (three-dot icon on hover) to each chat item with options: Rename, Delete.
- Rename: Show an inline input field that calls `updateChatTitle(chatId, newTitle)`.
- Delete: Show a confirmation then call `deleteChat(chatId)`.
- The store already has `deleteChat` and `updateChatTitle` methods -- just need UI.

**Same fix in `src/components/aichat/MobileSidebar.tsx`:**
- Add the same context menu (long-press or three-dot) for mobile chat items.

---

## 4. Share Chat with Collaboration

**Problem:** The current ShareModal only generates a static link. The user wants email/link sharing with realtime collaborative discussion (like Slack channels).

**Database tables needed (via migration):**
- `shared_chats`: Stores shared chat snapshots (id, owner_id, chat_data JSON, title, created_at, share_token unique)
- `shared_chat_members`: (id, shared_chat_id FK, user_email, role: 'viewer'|'commenter', invited_at, accepted_at)
- `shared_chat_comments`: (id, shared_chat_id FK, user_id, content, created_at) -- with realtime enabled

**Changes:**
- Rewrite `src/components/aichat/ShareModal.tsx`: Add email invite field, copy link button, and member list. When sharing, insert into `shared_chats` and generate a unique token URL.
- Create `src/pages/SharedChatPage.tsx`: A read-only view of the shared chat with a comment/discussion sidebar. Uses Supabase Realtime for live comments.
- Add route `/shared/:token` in `src/App.jsx`.
- Members added by email receive a link. When they open it, they can view the chat and post comments in realtime.

---

## 5. Performance Fix (Site Slows After Few Chats)

**Problem:** The "Aw, Snap!" crash and slowdowns are caused by localStorage overflow (base64 images in chat messages) and excessive re-renders from Zustand store updates.

**Fixes:**

**a) `src/stores/chatStore.ts` -- Aggressive localStorage cleanup:**
- In `partialize`, limit persisted chats to the 30 most recent (currently unlimited).
- Strip ALL `attachments` from persisted messages (not just base64 -- also parsed file content which can be huge).
- Add a `maxChats` constant and auto-prune old chats on rehydration.

**b) `src/components/aichat/MessageBubble.tsx` -- Reduce re-renders:**
- The component subscribes to the entire `useChatStore` (theme, chats, activeChatId, user, selectedModel, models). Extract only what's needed via selectors.
- Move emoji/reaction state to a separate lightweight component.

**c) `src/components/aichat/MarkdownRenderer.tsx` -- Memoize properly:**
- The `markdownComponents` object is recreated on every render (it's defined outside the component but references closures). Wrap it in `useMemo` or define it as a true static constant.

**d) `src/components/aichat/MultiWindowChat.tsx` -- Virtualize long message lists:**
- For windows with many messages, only render the last 50 messages visually. Older messages are truncated with a "Load more" button.

---

## 6. Mobile Chrome Crash Fix

**Problem:** "Aw, Snap!" on mobile Chrome (see screenshot). This is an out-of-memory crash.

**Root causes and fixes:**
- **localStorage overflow**: Fixed in item 5a above (aggressive pruning).
- **Large base64 images in state**: The `partialize` function already strips some, but large conversation histories with images still bloat memory. Fix by limiting image attachment storage to thumbnails (resize to 200px max before storing in state).
- **Framer Motion animations on low-end devices**: Add `layoutScroll={false}` and reduce animation complexity on mobile. In `MessageBubble.tsx`, skip the `motion.div` wrapper on mobile and use plain `div` instead.
- **Too many DOM nodes in long chats**: Limit rendered messages to the last 100 in `MessageList.tsx`. Show a "Load earlier messages" button for the rest.

---

## 7. Multi-Window Chat File Upload

**Problem:** The multi-window `SharedChatInput` has no file/image upload capability -- only a text input and send button.

**Fix in `src/components/aichat/SharedChatInput.tsx`:**
- Add the same attachment functionality from the main `ChatInput`: image upload button, document upload button, drag-and-drop, clipboard paste.
- Reuse the same `parseFile`, `FileChip`, and `processFiles` logic.
- When files are attached, pass them to `onSend(content, attachments)` which already accepts attachments.
- The `MultiWindowChat.handleSend` already handles attachments (separates images and documents) -- just needs the UI to provide them.

---

## Files to Create/Modify

| File | Action | Purpose |
|---|---|---|
| `src/hooks/useAutoScroll.ts` | Modify | Debounce scroll, CSS hints |
| `src/components/aichat/MessageList.tsx` | Modify | overscroll-behavior, message limit |
| `src/components/aichat/MultiWindowChat.tsx` | Modify | Scroll fixes, message limit per window |
| `src/hooks/useUserProfile.ts` | Modify | Realtime subscription for profile changes |
| `src/components/aichat/ChatSidebar.tsx` | Modify | Add rename/delete context menu |
| `src/components/aichat/MobileSidebar.tsx` | Modify | Add rename/delete for mobile |
| `src/components/aichat/ShareModal.tsx` | Rewrite | Email/link sharing with member management |
| `src/pages/SharedChatPage.tsx` | Create | Shared chat viewer with realtime comments |
| `src/App.jsx` | Modify | Add /shared/:token route |
| `src/stores/chatStore.ts` | Modify | Chat pruning, attachment stripping |
| `src/components/aichat/MessageBubble.tsx` | Modify | Reduce re-renders, skip animations on mobile |
| `src/components/aichat/SharedChatInput.tsx` | Rewrite | Add file upload UI matching main ChatInput |
| Database migration | Create | shared_chats, shared_chat_members, shared_chat_comments tables |

## Implementation Order

1. Performance + Mobile crash fixes (most critical -- unblocks everything)
2. Smooth scrolling fix
3. Chat history rename/delete
4. Multi-window file upload
5. Profile instant sync
6. Share/collaboration feature (largest scope)
