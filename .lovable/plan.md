# Implementation Plan

## 1. Chat-side Profile Editor (parity with Scholars)

Rewrite `src/components/aichat/settings/ProfileTab.tsx` to mirror `src/pages/scholars/ScholarsProfile.tsx`:

- Fields: avatar upload (uses `profile-avatars` bucket, `user.id/avatar.<ext>`), Full Name, Phone (with country code input), Email (read-only).
- Load from `profiles` table on mount; save via `supabase.from('profiles').update(...)`.
- Avatar preview, "Change photo" / "Remove" buttons, Save button with loading + Sonner toast.
- Same Tailwind layout/styles as Scholars (card, rounded-2xl, divider, primary CTA).
- Mobile responsive (stacked card, full-width inputs).

## 2. 30-Day Soft-Delete + Recovery (Chat + Scholars)

**DB migration** (`account_deletion_requests` table + profile columns):
```text
profiles: + deleted_at timestamptz, + deletion_scheduled_at timestamptz
account_deletion_requests(id, user_id FK auth.users, reason text, details text,
  requested_at, scheduled_purge_at = now()+30d, status pending|cancelled|purged)
GRANTS: authenticated SELECT/INSERT/UPDATE own row; service_role ALL
RLS: user can see/cancel own pending request; insert own
RPCs (SECURITY DEFINER):
  request_account_deletion(reason, details) -> schedules + sets profile flags + signs nothing
  recover_account() -> clears flags, marks request cancelled
```

**Edge functions**:
- `account-delete-request` — wraps the RPC, returns scheduled date.
- `account-delete-recover` — wraps recover RPC.
- `account-delete-purge` — service-role cron; for every request where `scheduled_purge_at <= now()` and status='pending', purges user data (mirrors current `delete-account` function logic) and marks status='purged'.
- Schedule via `pg_cron` daily (note: requires one-time enable; instructions in chat).

**UI — 3-step modal** (`src/components/shared/DeleteAccountModal.tsx`, reused in chat Settings → Profile and Scholars Profile):
1. "Why are you leaving?" — radio options (Too expensive / Missing features / Privacy concerns / Found alternative / Other) + free-text details.
2. Confirmation — "Your account will be recoverable for 30 days, then permanently deleted on {date}."
3. Final confirm + sign-out → calls `account-delete-request`, then `supabase.auth.signOut()`.

**Recovery banner** (`src/components/shared/AccountRecoveryBanner.tsx`):
- Mounted in `AuthContext` / top-level layout. If `profiles.deletion_scheduled_at` is in the future, show sticky banner: "Your account is scheduled for deletion on {date}. [Recover Account]". One-click calls `account-delete-recover`.
- Mirror in Scholars layout.

**Cleanup**: existing `delete-account` function stays as the purge implementation core (called by purge cron with `user_id`), but client UI no longer calls it directly.

## 3. Cineshoot Server-Side Gating

- `supabase/functions/cineshoot-start/index.ts`: remove the 2-free-render trial branch. Enforce `PLAN_RANK[planId] >= 4` (premium_plus). Return 402 `{ error: 'plan_required', requiredPlan: 'premium_plus' }` otherwise.
- `src/pages/CineshootPage.tsx`: remove free-trial banner/logic; restore `PlanLockScreen` for users below premium_plus with clear copy "Sorix Cineshoot is available on Premium Plus, Max, and Enterprise plans."
- `src/components/Pricing.jsx`: remove "2 free renders trial" line under sub-Premium-Plus plans; show "Sorix Cineshoot" only on Premium Plus+.

## 4. Sorix Agent — Remove Upgrade Pop-up

- `src/pages/CoWorkPage.tsx`: agent is available on all paid plans (already gated to `basic`+). Remove any `UpgradePlanModal` auto-opening on mount and any one-time intro modal that shows an upgrade CTA. Keep the `PlanLockScreen` only for free-tier users (existing behavior).
- Audit `src/components/cowork/` for an "Upgrade" dialog mounted at page open; delete or guard behind explicit user action.

## 5. Sorix Imagine — 3 Free Renders (Cineshoot-style, server-enforced)

**DB migration**:
```text
profiles: + imagine_free_renders_used integer default 0
RPC increment_imagine_free_render() SECURITY DEFINER → mirrors increment_cineshoot_free_render
```

**Edge function** `supabase/functions/imagine/index.ts`:
- Free plan: allow up to 3 lifetime renders, set token cost to 0, increment counter on success.
- Beyond 3: return 402 `{ error: 'free_trial_exhausted' }`.
- Paid plans: unchanged (tokens deducted as today).

**UI** `src/pages/ImaginePage.tsx`:
- Replace current localStorage trial with server-truth via `profiles.imagine_free_renders_used`.
- Banner for free users: "Free trial: X of 3 images left" (purple gradient, matches Cineshoot styling).
- When exhausted, open `UpgradePlanModal` on generate attempt.
- Mobile-responsive banner (full-width, condensed copy).

## Technical notes

- All new edge functions: CORS headers, JWT verified in code via user supabase client; service-role only for purge.
- All Sonner toasts for success/error.
- Run Supabase linter after migration; fix any function search_path warnings.
- pg_cron daily schedule for purge installed via `supabase--insert` (user-specific URL/anon key).
- Types regenerate after migration; UI code referencing new columns lands after.

## Out of scope

- Email notifications on deletion request / recovery (follow-up).
- Hard-delete of auth user in purge runs via existing `delete-account` logic invoked server-side.
