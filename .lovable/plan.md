## Goal
After login or registration (email/password, OAuth, or email verification), send the user back to the page they were on — not always `/chat`. Default to `/chat` only when there's no known origin.

## Behavior

| Entry point to /login or /register | After successful auth go to |
|---|---|
| User clicked "Login" from Scholars, Pricing, Payment modal, a tool page (Cineshoot, Imagine, Agent, etc.), Reviews, etc. | Back to that exact page (path + hash) |
| `ProtectedRoute` bounced an unauthenticated user from a private route | Back to that protected route |
| User opened `/login` or `/register` directly (no origin) | `/chat` (current default) |
| Password recovery flow | Unchanged — `/reset-password` |

## Mechanism

A single shared helper `getPostAuthRedirect()` reads, in order:
1. `location.state.returnTo` (set by callers that use `navigate('/login', { state })`)
2. `location.state.from` (set by `ProtectedRoute`)
3. `sessionStorage.getItem('postAuthReturnTo')` (survives OAuth round-trip and email verification redirects)
4. fallback `/chat`

A companion `rememberReturnTo(path)` writes to sessionStorage; called right before `signInWithOAuth` and whenever a "Login"/"Register" link is followed so the value survives full-page redirects.

After consuming the value, clear `sessionStorage.postAuthReturnTo`.

Guardrails on the returned path:
- Must start with `/`
- Must NOT be `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`, `/auth/callback` (avoid loops)
- Reject absolute URLs / `//` (open-redirect protection)

## Files to change

1. **`src/lib/authRedirect.ts`** (new) — exports `rememberReturnTo`, `consumePostAuthRedirect(locationState)`, `sanitizeReturnTo`.

2. **`src/pages/Login.jsx`** — replace the hard-coded `navigate("/chat")` after successful sign-in with `navigate(consumePostAuthRedirect(location.state))`. Also call `rememberReturnTo` before Google OAuth so the round-trip survives.

3. **`src/pages/Register.jsx`** — same treatment after successful registration / auto sign-in. Forward `returnTo` to `/verify-email` via `navigate(..., { state })` so the post-verification jump still lands on the right page.

4. **`src/pages/VerifyEmail.jsx`** — replace `navigate("/chat")` with `navigate(consumePostAuthRedirect(location.state))`.

5. **`src/pages/Index.jsx`** — the `justRegistered` block currently forces `/chat`. Change to `consumePostAuthRedirect()` (no location.state available here, so sessionStorage is the source).

6. **`src/contexts/AuthContext.tsx`** — in the OAuth hash-token handler, replace the hard `window.location.href = '/chat'` with `consumePostAuthRedirect()` (sessionStorage path). Keep recovery branch untouched.

7. **`src/components/ProtectedRoute.tsx`** — when redirecting unauthenticated users, pass current location:
   `<Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />`

8. **Link sites that send users to auth** — update so each call captures origin:
   - `src/components/Navbar.jsx` (desktop + mobile "Login" / "Sign up" links)
   - `src/components/scholars/ScholarsNavbar.tsx` (both Login spots)
   - `src/components/Hero.jsx` (login CTA)
   - `src/components/Pricing.jsx` (already passes `returnTo` for the pricing case — extend so the generic "login required" branch also forwards the current path)
   - `src/pages/Reviews.jsx`, `src/pages/SharedChatPage.tsx`, `src/pages/scholars/ScholarsCertificates.tsx`, `src/pages/ForgotPassword.jsx`, `src/pages/ResetPassword.jsx`, `src/pages/Register.jsx` (the cross-link to /login)
   - `src/components/PaymentModal.tsx` if it triggers a login bounce

   For `<Link>` elements, switch to `<Link to="/login" state={{ returnTo: currentPath }}>` (use `useLocation()` to compute `currentPath`). For anchor tags / external-style hrefs (e.g. `Hero.jsx`), convert to `Link` or `navigate()` so state is preserved.

## Out of scope
- No changes to Supabase config or edge functions.
- No change to `/reset-password` flow.
- No change to default-when-unknown (still `/chat`).

## Verification
- Click "Login" from Scholars navbar → after login, land back on the Scholars page.
- Open a protected tool while logged out → bounced to /login → after login, return to that tool.
- Click Login from Pricing CTA → return to `/#pricing`.
- Sign in via Google from Scholars → after OAuth round-trip, land on Scholars.
- Register from Scholars → verify email → land on Scholars.
- Visit `/login` directly → after login, land on `/chat` (unchanged default).
- Tampered `returnTo=https://evil.com` is ignored (falls back to `/chat`).
