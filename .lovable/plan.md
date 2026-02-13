
# Fix: Profile Updates Not Reflecting Immediately in Chat UI

## Root Cause
The `profiles` table is **not added to the realtime publication** (`supabase_realtime`). The `useUserProfile` hook sets up a Supabase Realtime subscription listening for `UPDATE` events on the `profiles` table, but since the table isn't in the publication, the subscription never receives any events. This means avatar, name, and phone changes only appear after a full page refresh.

## Fix (2 changes)

### 1. Database Migration -- Enable Realtime for `profiles` table
Run a migration to add the `profiles` table to the `supabase_realtime` publication:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
```
This allows the existing realtime subscription in `useUserProfile.ts` to actually receive UPDATE events.

### 2. Code Fix -- Direct Zustand sync as backup
The `ProfileTab.tsx` already updates the Zustand store directly after saving name and avatar. However, the avatar upload updates the store with `avatar` but the `handleUpdateProfile` function only syncs `name`. We should also ensure `useUserProfile` is re-fetching properly.

No code changes are strictly needed -- the realtime subscription code is already correct in `useUserProfile.ts`. Once the database publication is fixed, updates will propagate instantly to ChatSidebar, MobileSidebar, and Navbar.

## Summary
- **One database migration**: Add `profiles` to `supabase_realtime` publication
- **No code changes needed** -- the existing realtime subscription and Zustand sync logic are already correctly implemented
