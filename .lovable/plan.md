

## Fix Registration Password Validation

The backend enforces strong password requirements (uppercase + lowercase + numbers + special characters + not a known breached password), but the frontend only validates minimum 6 characters. Users submit weak passwords, get a 422 error, and see a generic toast that may be hard to understand.

### Changes

**`src/pages/Register.jsx`**

1. **Add strong client-side password validation** in `validateForm()`:
   - Check for at least 1 lowercase letter
   - Check for at least 1 uppercase letter
   - Check for at least 1 number
   - Check for at least 1 special character
   - Minimum 8 characters (safer than 6)
   - Show specific error messages for each missing requirement

2. **Add visible password requirements hint** below the password input:
   - Small text listing requirements: "Min 8 chars, uppercase, lowercase, number, special character"
   - Style with `text-xs text-muted-foreground`
   - Optionally show green checkmarks as requirements are met (real-time feedback)

3. **Improve error handling** for the weak_password response:
   - Line 92: Also check for `error.code === 'weak_password'` or `error.message?.includes('weak')` 
   - Show a friendlier message: "Password is too weak. Use at least 8 characters with uppercase, lowercase, numbers, and special characters."

### Technical Details

- Update `validateForm()` around lines 43-64 with regex checks
- Add a password requirements UI component between lines 325-326 (after password input, before confirm password)
- Update error handling at lines 85-104 to catch `weak_password` code

