## Problem

The `/agent/connections` page already renders a "Connect" button on every `ConnectionCard`, and `ConnectDialog` contains the Google OAuth popup logic. But for the Google card the user has to click **Connect → then "Connect with Google"** inside a dialog, which is confusing and easy to miss — making it look like there is no working OAuth button.

The OAuth wiring itself (popup → `google-oauth-start` edge function → `postMessage` callback → token saved by `google-oauth-callback`) is already implemented and the Google secrets are configured.

## Goal

Make the Google integration one-click from the connections page: clicking **Connect** on the Google card should immediately open the Google OAuth popup, no intermediate dialog.

## Changes

### 1. Extract the OAuth popup logic into a reusable hook

New file `src/hooks/useGoogleOAuth.ts`:
- Exports `useGoogleOAuth({ onSuccess })` returning `{ startOAuth, loading }`.
- Moves the existing logic from `ConnectDialog.handleGoogleOAuth` verbatim (session token fetch, popup open with `google-oauth-start?token=...`, `postMessage` listener for `google_oauth_result`, popup-closed polling, sonner toasts).

### 2. Update `ConnectionCard.tsx`
- Import `useGoogleOAuth`.
- When `service.method === "oauth"`, the **Connect** and **Reconnect** buttons call `startOAuth()` directly instead of `onConnect()` (which opens the dialog).
- Show `Loader2` spinner while `loading` is true.
- For manual services, behavior is unchanged (still opens the dialog).

### 3. Update `ConnectDialog.tsx`
- Refactor to use the same `useGoogleOAuth` hook (so the dialog path keeps working as a fallback), or simply delete the OAuth branch since the dialog will no longer be opened for Google. Pick the simpler: keep the dialog manual-only and drop the `method === "oauth"` branch.

### 4. No backend changes
- `google-oauth-start`, `google-oauth-callback`, secrets, and `user_connections` table are already in place.

## Verification

1. Sign in, navigate to `/agent/connections`.
2. Click **Connect** on the Google card → popup opens to Google consent screen.
3. Approve → popup closes, toast "Google connected: <email>", card flips to **Connected** badge via realtime subscription on `user_connections`.
4. Click **Test** → `connection-test` edge function returns ok.
5. Click **Disconnect** → row removed, card returns to Not connected.
