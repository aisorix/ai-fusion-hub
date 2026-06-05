## Why it's broken

1. **Realtime not syncing across devices** — the previous migration added `image_generations`, `presentations`, `video_generations`, `analysis_history` to the `supabase_realtime` publication, but **forgot `user_chats` and `user_chat_windows`**. Without those two in the publication, Postgres never broadcasts chat inserts/updates/deletes, so other devices only see new chats after a hard refresh. This is the root cause of "same id history but realtime update hoi nai".
2. **3-dot menu invisible on the desktop sidebar** — the `ChatItem` button has `opacity-0 group-hover:opacity-100`, so on touch devices and even on hover it's easy to miss. Your screenshot of the "hi" chat has no 3-dot because the cursor isn't on it.
3. **Mobile sidebar has no Star action and no Starred section** — only Rename + Delete are wired in `MobileChatItem`, and the Starred group isn't rendered at all.

## Fix

### 1. Migration — enable realtime on the chat tables
```sql
ALTER TABLE public.user_chats         REPLICA IDENTITY FULL;
ALTER TABLE public.user_chat_windows  REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chats;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chat_windows;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
```

### 2. `src/components/aichat/ChatSidebar.tsx`
- Remove `opacity-0 group-hover:opacity-100` from the `ChatItem` 3-dot trigger → always visible (matches image 3).
- Keep existing menu: Star/Unstar, Rename, Delete (Starred section is already rendered above Today).

### 3. `src/components/aichat/MobileSidebar.tsx`
- Extend `MobileChatItem` props with `isStarred` + `onToggleStar`.
- Add **Star/Unstar** as the first dropdown item (above Rename).
- Pull `toggleStarChat` from `useChatStore`, pass it through `renderChatList`.
- Compute `starredChats = filteredChats.filter(c => c.isStarred)` and render a **Starred** section (with `Star` icon header) above Today, hidden when empty — mirrors desktop.
- Make the 3-dot trigger always visible (no hover gating) so it works on touch.

### 4. Verify
- After migration runs, open the app on two devices/browsers, create/rename/star/delete a chat on one → the other updates within ~1 s with no refresh.
- 3-dot menu visible on every chat row, desktop + mobile, with Star · Rename · Delete.
- Starred chats appear in the pinned **Starred** section on both sidebars.

No other files change. The store, `useChatSync`, and `useRealtimeHistory` are already correct — they just need the publication to actually deliver events.