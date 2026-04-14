

## Fix Wrong Password Message + Runtime Error

### 1. Fix runtime error (`isGoogleLoading` not found)
The `isGoogleLoading` reference was removed from Login/Register source but may persist in a stale HMR cache. The code is already clean — this will resolve with the next build triggered by the changes below.

### 2. Improve wrong password error message in Login.jsx

**File: `src/pages/Login.jsx`** (lines 55-66)

Update the error handling to show a clearer "wrong password" message using Sonner (the project's preferred notification system), replacing the legacy `useToast` hook:

- Change `import { useToast } from '@/hooks/use-toast'` → `import { toast } from 'sonner'`
- Remove `const { toast } = useToast()` 
- Update error message for `Invalid login credentials` to: **"Wrong password. Please check your password and try again."**
- Update success toast to use Sonner syntax
- Use `toast.error(...)` for errors and `toast.success(...)` for success

The error block becomes:
```js
if (error) {
  if (error.message.includes('Invalid login credentials')) {
    toast.error('Wrong password or email. Please check your credentials and try again.');
  } else if (error.message.includes('Email not confirmed')) {
    toast.error('Please verify your email before signing in.');
  } else {
    toast.error('Failed to sign in. Please try again.');
  }
} else {
  toast.success('Welcome back! You have successfully signed in.');
  navigate('/chat');
}
```

Also remove the unused `Separator` import since Google button was removed.

