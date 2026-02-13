
# Fix: Real-Time Cross-Device Chat and Token Sync

## Problem
Currently, chat history and token usage are NOT properly syncing across devices because:
1. Only the **active chat** gets saved to database, and only after edits -- new chats and deletions are not synced
2. There is **no Realtime subscription** on the `user_chats` table, so Device B never receives updates from Device A
3. The `subscriptions` table RLS **blocks UPDATE** from the client, so token sync silently fails
4. Chat creation and deletion are not persisted to the database

## Solution

### Step 1: Database Changes
- Enable Realtime on `user_chats` table so changes push to all devices automatically
- Add an UPDATE RLS policy on `subscriptions` so users can update their own `tokens_used`

### Step 2: Rewrite `useChatSync.ts` -- Full Bidirectional Sync
- **On login**: Load ALL chats from database and replace local state
- **On chat create**: Immediately save new chat to database
- **On chat update** (new message, title rename): Debounced save to database
- **On chat delete**: Delete from database
- **Realtime listener**: Subscribe to `user_chats` INSERT/UPDATE/DELETE events and apply changes to local Zustand store in real-time -- this is what makes Device B see Device A's changes instantly
- **Token sync via Realtime**: Subscribe to `subscriptions` changes to keep token count synced

### Step 3: Update `chatStore.ts` Sync Points
- After `createNewChat`: trigger database save
- After `deleteChat`: trigger database delete
- After `updateChatTitle`: trigger database update
- After `addMessage` / `updateLastMessage`: debounced save of active chat

### Step 4: Update `ProtectedRoute.tsx`
- Clean up duplicate profile/subscription loading (already handled by sync hook)

## Technical Details

**Files to modify:**
- `supabase/migrations/` -- new migration for Realtime + RLS policy
- `src/hooks/useChatSync.ts` -- complete rewrite with Realtime subscriptions
- `src/stores/chatStore.ts` -- no structural changes, sync hook handles everything
- `src/components/ProtectedRoute.tsx` -- minor cleanup

**Realtime flow:**
```text
Device A sends message
  -> Zustand store updates locally (instant)
  -> useChatSync detects change, saves to DB (debounced 2s)
  -> Supabase Realtime broadcasts INSERT/UPDATE
  -> Device B's Realtime listener receives event
  -> Device B's Zustand store updates (instant on Device B)
```

**RLS change for subscriptions:**
- Add policy: "Users can update their own token usage" allowing UPDATE on `subscriptions` where `auth.uid() = user_id`

This ensures all chat history, deletions, renames, and token usage are fully synchronized across every device in real-time.
