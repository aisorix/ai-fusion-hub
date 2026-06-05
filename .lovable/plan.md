
## Goals

1. **New 3-dot menu** on each chat history item: Star/Unstar, Rename, Add to project, Delete (matches image 1).
2. **Starred section** pinned above Recents in the sidebar (matches image 3).
3. **Smart chat titles** auto-generated from the user's prompt topic (3–6 words, cleaned), not just sliced first 50 chars.
4. **Instant realtime sync (zero delay)** for all chat history and tool creations across every logged-in device — Main chat, Multi-window, Imagine, Deck, FlowBuilder, Cineshoot, Legends, Health, Agro.

---

## 1. Starred chats + new menu

**`src/stores/chatStore.ts`**
- Extend `Chat` interface with `isStarred?: boolean`, `projectId?: string | null`, `titleManuallySet?: boolean`.
- Add actions: `toggleStarChat(id)`, `addChatToProject(chatId, projectId)`.

**`src/components/aichat/ChatSidebar.tsx`**
- `ChatItem` dropdown → 4 items: **Star/Unstar** (Star icon, label flips), **Rename** (Pencil), **Add to project** (FolderPlus → submenu of existing projects + "New project"), **Delete** (Trash, destructive).
- Above the History section add **Starred** — renders `chats.filter(c => c.isStarred)` sorted by `updatedAt`. Hidden when empty.
- Final section order: Starred → History (Today / This Week / Older).

**`src/components/aichat/MobileSidebar.tsx`** — same menu + Starred section.

---

## 2. Topic-based chat titles

Replace the current "first 50 chars" slice in `addMessage`:

- **Instant heuristic** (client-side, zero latency): strip code blocks / URLs / markdown, collapse whitespace, take first 6 meaningful words, Title Case, max ~40 chars.
- **Optional AI polish** (non-blocking, fire-and-forget) after the first assistant reply finishes: ask the existing `chat` edge function for a 3–6 word topic; if it returns, call `updateChatTitle` (already synced via Realtime).
- Skip AI polish when `titleManuallySet === true`. Rename action sets that flag.

---

## 3. Instant realtime sync — zero delay everywhere

Make every persisted surface push-and-receive in realtime with **no debounce on structural events** and **immediate optimistic writes**.

### Write side — kill the delay
In `useChatSync.ts`:
- **No debounce** for: chat create, delete, rename, star toggle, add-to-project, new message append. These flush instantly (`await upsert` fired immediately in the store subscriber).
- **Debounce kept only for streaming token-by-token content** (300 ms, down from 2 s) so the in-flight assistant reply still coalesces but feels live on other devices.
- Multi-window save debounce dropped from 2.5 s → 400 ms.

### Read side — universal realtime
Add a generic hook **`src/hooks/useRealtimeHistory.ts`**:
```ts
useRealtimeHistory({ table, userId, filter?, onChange })
```
Opens a Supabase channel filtered by `user_id=eq.${uid}` (plus optional `tool=eq.flowbuilder` etc.), triggers `onChange()` on INSERT/UPDATE/DELETE so the list refetches immediately.

Plug it into every history surface:

| Surface | Table | Component |
|---|---|---|
| Main chats | `user_chats` | already wired in `useChatSync` (kept) |
| Multi-window | `user_chat_windows` | already wired (kept) |
| Imagine | `image_generations` (fallback `analysis_history` tool=imagine) | `ImagineHistory.tsx`, `ImagineHistoryFeed.tsx`, also re-hydrate canvas on INSERT |
| Deck | `presentations` | `DeckHistory.tsx`, `DeckHistoryFeed.tsx` |
| FlowBuilder | `analysis_history` (tool=flowbuilder) | `FlowHistory.tsx` |
| Cineshoot | `video_generations` | `CineshootHistoryFeed.tsx` + `CineshootCanvas.tsx` |
| Legends | `legend_conversations` | `LegendHistory.tsx` |
| Health | `analysis_history` (tool=health) | `HealthHistory.tsx` |
| Agro | `analysis_history` (tool=agro) | `AgroHistory.tsx` |

Each component:
1. Subscribes on mount via `useRealtimeHistory`.
2. On any change → refetch latest page (cheap, paginated).
3. If the user is currently on the matching tool page and the canvas is empty, auto-hydrate with the newest row (already done for some tools).
4. Cleans up channel on unmount.

### Database — enable realtime on every tool table
One migration sets `REPLICA IDENTITY FULL` and adds each table to the `supabase_realtime` publication (guarded with `DO $$ ... EXCEPTION WHEN duplicate_object ...` so reruns are safe).

---

## Technical details

### Migration

```sql
-- Sidebar features
ALTER TABLE public.user_chats
  ADD COLUMN IF NOT EXISTS is_starred boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS project_id uuid NULL REFERENCES public.projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS title_manually_set boolean NOT NULL DEFAULT false;

-- Realtime on every tool table
ALTER TABLE public.image_generations    REPLICA IDENTITY FULL;
ALTER TABLE public.presentations        REPLICA IDENTITY FULL;
ALTER TABLE public.video_generations    REPLICA IDENTITY FULL;
ALTER TABLE public.legend_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.analysis_history     REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.image_generations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
-- repeat block for presentations, video_generations, legend_conversations, analysis_history
```

### Files to edit / create

- `supabase/migrations/<new>.sql` *(schema + realtime)*
- `src/stores/chatStore.ts` *(star/project/title-flag + smart title)*
- `src/components/aichat/ChatSidebar.tsx` *(menu + Starred section)*
- `src/components/aichat/MobileSidebar.tsx`
- `src/hooks/useChatSync.ts` *(remove structural debounce, shrink streaming debounce, persist new columns)*
- `src/hooks/useRealtimeHistory.ts` *(new, generic)*
- `src/components/imagine/ImagineHistory.tsx`, `ImagineHistoryFeed.tsx`
- `src/components/deck/DeckHistory.tsx`, `DeckHistoryFeed.tsx`
- `src/components/flowbuilder/FlowHistory.tsx`
- `src/components/cineshoot/CineshootHistoryFeed.tsx`, `CineshootCanvas.tsx`
- `src/components/legends/LegendHistory.tsx`
- `src/components/health/HealthHistory.tsx`
- `src/components/agro/AgroHistory.tsx`

No edge-function changes needed.

---

## Out of scope

- Reordering inside Starred (kept as `updated_at desc`).
- Full Projects UI overhaul — only the "Add to project" picker reuses the existing `projects` table.
