## Goals

1. Let unauthenticated visitors open `/chat` and all tool pages (Agent, Cineshoot, Imagine, Deck, Health, Agro, Legends, FlowBuilder, Tools) and actually chat / use tools, capped by a free guest token budget.
2. When the guest budget is exhausted, block further sends with a "Sign in to continue" modal that routes to `/login` (then back to where they were).
3. Keep the paid funnel unchanged: Pricing → Login/Register → Payment method → Pay → Chat.
4. Keep pages SEO-crawlable (no redirect on first paint, no auth blocking on SSR-visible content).
5. Fix the 3-dot action menu in chat history so it's visible and works on desktop + mobile.

## 1. Routing — remove `ProtectedRoute` from tool pages

In `src/App.jsx`, unwrap `<ProtectedRoute>` for: `/chat`, `/health`, `/agro`, `/legends`, `/cineshoot`, `/imagine`, `/deck`, `/agent`, `/flowbuilder`, `/tools`. Keep `/dashboard`, `/agent/connections`, payment success/failed pages protected.

Pricing → login flow is unaffected (PaymentModal already requires `supabase.auth.getUser()`).

## 2. Guest session layer

New file `src/hooks/useGuestSession.ts`:
- Generates a stable `guest_id` (uuid) + `guest_token` in `localStorage` on first visit.
- Exposes `{ guestId, isGuest, guestTokensUsed, guestTokensLimit, addGuestTokens, resetGuest }`.
- Default `guestTokensLimit = 5000` (one-time free pool, persisted in localStorage; resets only on explicit reset/login).

In `src/pages/ChatPage.tsx`:
- Remove the `if (!isAuthenticated) navigate('/login')` redirect.
- Render the full chat UI for guests, using guest identity for the chat store user (name = "Guest", plan = "free", tokensLimit = guest pool).

In `src/hooks/useAIChatAuth.ts` / `chatStore`:
- When no auth user, hydrate store user from guest session instead of forcing login.
- Token accounting for guests writes back through `addGuestTokens` (still surfaced as `tokensUsed/tokensLimit` to UI).

## 3. Free-limit gate → Login modal

New component `src/components/auth/GuestLimitModal.tsx`:
- Triggered from `ChatArea.handleSend` and each tool's submit handler when `isGuest && tokensUsed >= tokensLimit`.
- Title: "You've used your free messages". CTAs: **Sign in** (`/login?redirect=<current>`) and **Create account** (`/register?redirect=<current>`).
- Login/Register pages already exist; add `redirect` query handling to send users back after auth.

Apply the same gate in: Health intake/chat submit, Agro submit, Imagine prompt bar, Deck prompt bar, FlowBuilder prompt bar, Legends chat, Cineshoot prompt bar, Agent command center, Tools page tool launches that hit backend.

For paid features that should never run for guests (image gen costs real money, video gen, deck, flowbuilder), block at first send with the same modal regardless of remaining tokens — text chat + Health + Agro stay free for guests.

## 4. Edge functions — accept guest calls

Currently `chat`, `imagine`, `health-analysis`, `agro-analysis`, `legends-chat`, `flowbuilder-generate`, `deck-generate`, `cineshoot`, `cowork-agent` rely on `Authorization` header for the supabase client. Update each:
- If `Authorization` present → existing authed path.
- If absent → read `x-guest-id` header, treat request as guest, skip per-user RLS-only writes (don't persist history to user-owned tables; return ephemeral result only).
- Enforce per-guest rate limit (server-side, in a new `guest_usage` table keyed by guest_id) to prevent abuse beyond the client-side cap.

For tools that must remain authed-only (Deck, FlowBuilder, Cineshoot, Imagine, Agent), return `401 GUEST_NOT_ALLOWED` so the client opens the login modal immediately.

A migration creates `public.guest_usage(guest_id text primary key, tokens_used int, updated_at timestamptz)` with `service_role` writes only.

`supabase/config.toml`: ensure the guest-enabled functions have `verify_jwt = false` (chat, health-analysis, agro-analysis already do; verify and add for others touched).

## 5. SEO

- Pages no longer redirect on first paint → Googlebot sees the full marketing/chat shell.
- Keep existing `SEOHead` titles/descriptions on `/chat`, `/tools`, each tool page.
- Add a `<noscript>` fallback hero on `/chat` describing the product (helps crawlers without JS).

## 6. Fix 3-dot menu in chat history

Symptoms in screenshot: the menu trigger is invisible next to chat titles.

Changes in `src/components/aichat/ChatHistoryActions.tsx` and `ChatSidebar.tsx` / `MobileSidebar.tsx`:
- Bump trigger to `w-7 h-7` with `MoreHorizontal w-4 h-4`, always-visible `text-muted-foreground/70 hover:text-foreground hover:bg-muted` (drop any leftover `opacity-0 group-hover:opacity-100`).
- Ensure parent row uses `min-w-0` on the title and `shrink-0` on the trigger so truncation doesn't eat the button.
- Set `DropdownMenuContent` to `z-[100]` (above sidebar) and `side="right"` on desktop, `side="bottom"` on mobile.
- Verify on the active/highlighted chat row — current `bg-primary/10` may visually merge the icon; use `text-primary/70` when row is active.

After the fix the menu shows: **Star/Unstar**, **Rename**, **Delete** on every chat row, on both sidebars.

## Out of scope

- Migrating existing guest chat history into the user account post-login (can be a follow-up).
- Changing pricing/payment flow.

## Technical summary

- Files edited: `src/App.jsx`, `src/pages/ChatPage.tsx`, all tool page entry files (remove guards), `src/hooks/useAIChatAuth.ts`, `src/stores/chatStore.ts`, each tool's submit hook, `src/components/aichat/ChatArea.tsx`, sidebar files, `ChatHistoryActions.tsx`, `Login.jsx`/`Register.jsx` (redirect param).
- Files created: `src/hooks/useGuestSession.ts`, `src/components/auth/GuestLimitModal.tsx`.
- Edge functions: branch on Authorization header; new `guest_usage` table + migration.
- No changes to pricing, payment modal, or auth providers.
