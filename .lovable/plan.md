

## Fix: Registration Errors Not Showing

### Root Cause

Register.jsx uses the **legacy `useToast` hook** (`@/hooks/use-toast`) to display error/success messages. However, the App only renders the **Sonner** toaster (`@/components/ui/sonner`), not the legacy `<Toaster />` from `@/components/ui/toaster`. This means all toast calls in Register.jsx are silently swallowed — no error or success messages ever appear.

### Fix

**`src/pages/Register.jsx`** — Switch from legacy `useToast` to `sonner`:

1. Replace `import { useToast } from '@/hooks/use-toast'` with `import { toast } from 'sonner'`
2. Remove the `const { toast } = useToast()` line
3. Update all `toast({...})` calls to use sonner's API:
   - `toast({ title: 'X', description: 'Y', variant: 'destructive' })` → `toast.error('Y')` or `toast.error('X', { description: 'Y' })`
   - `toast({ title: 'X', description: 'Y' })` → `toast.success('X', { description: 'Y' })`

There are approximately 5-6 toast calls in the file (registration error, success, resend code, etc.) that all need updating.

### Result

After this change, all registration errors (user already exists, weak password, rate limit, etc.) and success messages will be visible to users via the Sonner toast notifications.

