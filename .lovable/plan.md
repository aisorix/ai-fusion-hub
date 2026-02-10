

## Fix Help & Support Sidebar Action + Fully Functional Profile Tab

### Problem Summary
1. **"Help & Support" in sidebar dropdown does nothing** -- the menu item has no `onClick` handler
2. **Profile tab is not functional** -- no actual profile picture upload, no database save for name/phone, no account deletion, no display of Google profile picture
3. **Profiles table missing phone fields** -- need `phone`, `country_code` columns

---

### Changes

#### 1. Database Migration: Add phone and country_code to profiles
Add `phone` and `country_code` columns to the existing `profiles` table.

#### 2. Create Storage Bucket for Avatars
Create a `profile-avatars` storage bucket so users can upload profile pictures. Add RLS policies so users can upload/read their own avatars.

#### 3. Fix "Help & Support" in ChatSidebar.tsx (line 446-449)
Add an `onClick` handler that opens the Settings modal with the Help Center tab pre-selected. This requires:
- Passing an `initialTab` prop to `SettingsModal`
- Updating `SettingsModal` to accept and use `initialTab`
- Setting `showSettings` with the correct initial tab from the dropdown

#### 4. Rewrite ProfileTab.tsx to be fully functional
- **Load profile from database** on mount (query `profiles` table)
- **Display Google avatar** from `auth.user.user_metadata.avatar_url` or uploaded avatar from storage
- **Upload profile picture** using storage bucket, save URL to `profiles.avatar_url`
- **Save name, phone, country code** to the `profiles` table on "Update Profile"
- **Delete account** button with confirmation dialog that:
  - Deletes user data from profiles/subscriptions
  - Calls `supabase.auth.admin.deleteUser()` via an edge function (since client can't self-delete)
  - Signs out and redirects to home
- **Show user's Google profile picture** by default (from `user_metadata.avatar_url`), allow override with uploaded picture

#### 5. Create Edge Function: delete-account
A backend function that:
- Verifies the authenticated user
- Deletes their profile, subscriptions, and other user data
- Deletes the auth user via service role
- Returns success

---

### Technical Details

**Database migration SQL:**
```sql
ALTER TABLE public.profiles
  ADD COLUMN phone text,
  ADD COLUMN country_code text DEFAULT '+1';
```

**Storage bucket:**
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-avatars', 'profile-avatars', true);

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'profile-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'profile-avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'profile-avatars');
```

**SettingsModal.tsx changes:**
- Add `initialTab?: TabId` prop
- Use `useEffect` to set `activeTab` when `initialTab` changes
- Export the `TabId` type for external use

**ChatSidebar.tsx changes:**
- Add state for `settingsInitialTab`
- "Help & Support" onClick sets initial tab to `'help'` and opens settings
- Pass `initialTab` to `SettingsModal`

**ProfileTab.tsx rewrite:**
- Use `useAuth()` from AuthContext to get the authenticated user
- Fetch profile from `profiles` table on mount
- Upload avatar to `profile-avatars/{userId}/avatar.png`
- Update profile via `supabase.from('profiles').upsert()`
- Add "Delete Account" with confirmation AlertDialog
- Show Google profile picture from `user.user_metadata.avatar_url` as fallback

**Edge function `delete-account`:**
- Validates JWT, extracts user ID
- Deletes from profiles, subscriptions, payment_history, projects, etc.
- Uses service role to delete from `auth.users`
- Returns 200 on success
