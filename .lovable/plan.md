

## Problem

The `deck-generate` edge function uses `supabase.auth.getClaims(token)` to get the user ID — a non-standard method that doesn't exist in the Supabase JS library used by other edge functions. All other working tools (agro, health, legends) use the standard `supabaseClient.auth.getUser()` pattern with the user's Authorization header forwarded to the client. This means auth silently fails in the deck function, and the `analysis_history` insert (which requires `auth.uid() = user_id` via RLS) also fails silently.

## Changes

### 1. Fix `supabase/functions/deck-generate/index.ts` — Auth pattern

Replace the broken `getClaims` auth pattern with the standard pattern used by all other edge functions:

- Create a user-scoped Supabase client: `createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } })`
- Use `supabaseClient.auth.getUser()` to get the authenticated user
- Use this user-scoped client for all database operations (subscriptions query, presentations insert, analysis_history insert, token deduction)

This matches exactly how `agro-analysis`, `health-analysis`, `legends-chat`, and `chat` functions work.

### 2. Fix `supabase/functions/deck-generate/index.ts` — Use user-scoped client for DB ops

Currently the function creates the Supabase client with the anon key but only forwards the auth header at creation. After switching to the standard pattern, all `.from()` calls must use the user-scoped client so RLS policies (`auth.uid() = user_id`) are properly evaluated.

### Files to modify
- `supabase/functions/deck-generate/index.ts` — Fix auth from `getClaims` to `getUser`, use user-scoped client for all DB operations

