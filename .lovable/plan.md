
## Why it's broken today

Cineshoot already syncs cross-device because **all generations live in Supabase** (`video_generations`, `cineshoot-videos` bucket) and the canvas auto-loads from the DB. The other tools have two real gaps:

1. **The "current creation" on the canvas is only in `localStorage`** (zustand persist) for Imagine, Deck, FlowBuilder, Legends, and Health. The DB history exists, but a new device shows an empty canvas until the user manually opens History. That makes it *feel* like nothing synced.
2. **Main AI Chat sync is lossy and Multi-Window is not synced at all.**
   - `useChatSync.cleanMessagesForDB` strips image attachment URLs to `''` and drops parsed file content → images/files vanish on other devices.
   - `chatWindows` (multi-window state) is only in zustand persist; never written to Supabase.

Imagine / Deck / Flow / Legends history components already call `*.getHistory()` from Supabase, so RLS + DB is fine — we just need to surface the latest creation automatically and stop dropping data in the chat sync.

## What to change

### 1. Auto-restore last creation on every tool (cross-device)
For each of these pages, on mount (after auth) fetch the most recent row for the user and hydrate the canvas if local state is empty:

- `ImaginePage` → `imagineApi.getHistory()[0]` → load image + prompt + model into canvas.
- `DeckPage` → most recent `presentations` row → load slides/theme.
- `FlowBuilderPage` → latest `analysis_history` row with `tool='flowbuilder'` → load mermaid code.
- `LegendsPage` → latest `analysis_history` row with `tool='legends'` → restore conversation.
- `HealthPage` / `AgroPage` → latest analysis row → restore result.

Add a small "Resumed your last creation on this device" toast suppressed silently (per the project's silent-UI rule, just skip the toast).

### 2. Fix Main Chat sync (no more lost images/files)
In `src/hooks/useChatSync.ts`:

- Remove `cleanMessagesForDB`'s URL stripping. Instead:
  - If `att.type === 'image'` and `url` is a `data:` / `blob:` URL, upload the bytes to a new public `chat-attachments` bucket (path `${userId}/${chatId}/${msgId}-${i}.png`) and store the returned public URL.
  - If `att.type === 'file'` and small (<2 MB), upload to the same bucket; otherwise persist metadata only (name/size/type) and mark `unavailableOnOtherDevices: true` so UI can show a hint.
  - Always keep `http(s)` URLs as-is.
- Migration: create `chat-attachments` bucket (public read), with RLS allowing inserts only where path prefix matches `auth.uid()`.

### 3. Sync Multi-Window Chat across devices
- Add table `public.user_chat_windows` (`user_id uuid pk`, `windows jsonb`, `updated_at timestamptz`) with RLS `auth.uid() = user_id` and the standard GRANTs.
- In `useChatSync`, also subscribe to `state.chatWindows` changes (debounced 2 s) → upsert. On initial load, hydrate `chatWindows` from the row if it exists.
- Strip the same attachment-URL issue here too (reuse the helper from step 2).

### 4. Cineshoot video access on other devices
`cineshoot-videos` is a private bucket. Verify `cineshootApi.getHistory()` returns playable URLs on a new device. If the stored `video_url` is a path (not a signed URL), update `supabase/functions/cineshoot/index.ts` history responses and `CineshootCanvas` to request a signed URL (`storage.from('cineshoot-videos').createSignedUrl(path, 3600)`) at load time. (No-op if already signed.)

### 5. Small UX consistency
- Show "Last creation restored" as a subtle inline chip on the canvas (not a toast) with a "Start new" button to clear it.
- On every History panel, after deleting the currently-displayed item, clear the canvas too.

## Technical details

**Files to edit**
- `src/hooks/useChatSync.ts` — remove stripping, add upload helper, sync `chatWindows`.
- `src/stores/chatStore.ts` — expose hydrate action for `chatWindows`; keep `stripAttachmentsForPersistence` for localStorage size cap only (DB keeps full URLs).
- `src/pages/ImaginePage.tsx`, `DeckPage.tsx`, `FlowBuilderPage.tsx`, `LegendsPage.tsx`, `HealthPage.tsx`, `AgroPage.tsx` — auto-restore latest row on mount when canvas is empty.
- `src/components/cineshoot/CineshootCanvas.tsx` + `supabase/functions/cineshoot/index.ts` — ensure signed URLs.
- New: `src/lib/chatAttachmentUpload.ts` helper.

**Migrations**
- `public.user_chat_windows` table + RLS + GRANTs.
- New storage bucket `chat-attachments` (public read) with insert policy `bucket_id='chat-attachments' AND (storage.foldername(name))[1] = auth.uid()::text`.

**Out of scope**
- Token costs / pricing (already done last turn).
- UI redesigns beyond the small "last creation restored" chip.

Approve and I'll implement it.
