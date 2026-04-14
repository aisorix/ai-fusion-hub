

## Remove "Continue with Google" from Login & Register Pages

### Changes

**`src/pages/Login.jsx`**
- Remove `signInWithGoogle` from the `useAuth()` destructure
- Remove `isGoogleLoading` state
- Remove the entire Google Sign In button block (lines ~113-143)
- Remove the "or continue with email" separator (lines ~145-150)

**`src/pages/Register.jsx`**
- Remove `signInWithGoogle` from the `useAuth()` destructure
- Remove `isGoogleLoading` state
- Remove the entire Google Sign Up button block (lines ~249-275)
- Remove the "or continue with email" separator below it

Both pages will show only the email/password form. Google sign-in can be re-added later once you configure your own Google OAuth credentials with "AI Sorix" branding.

