

## Fix Registration: Create Account and Go to Chat

### Root Cause

Two issues found:

1. **No try/catch** around the signup call — if the Supabase client throws (instead of returning `{error}`), the error is silently swallowed and nothing happens visually.

2. **Email verification blocks login** — after successful signup, the code shows a "verify email" screen (`setShowOtp(true)`) instead of logging the user in. The user wants: Create Account → go straight to /chat.

The network logs confirm the specific test email (`rakibul242-35-828@diu.edu.bd`) already exists, returning a 422 `user_already_exists` error that wasn't surfacing as a toast.

### Changes

**1. Enable auto-confirm email signups** (backend config)
- Use `configure_auth` to enable auto-confirm so users are immediately logged in after signup without needing email verification.

**2. `src/pages/Register.jsx`**
- Wrap the `supabase.auth.signUp()` call in a proper `try/catch` block so thrown errors are caught and shown to the user.
- On successful signup with a session returned (auto-confirm), navigate directly to `/chat` instead of showing the OTP/verification screen.
- Keep the verification screen as a fallback in case auto-confirm is off or the session isn't returned immediately.
- Add the `user_already_exists` error code check alongside the existing message check for more reliable error detection.

### Flow After Fix

1. User fills form → clicks Create Account
2. Account is created and auto-confirmed
3. Auth state listener fires → user is set → redirect to `/chat`
4. If signup fails, a clear toast error message is shown

