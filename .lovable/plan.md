

## Tighten Logo-Text Alignment Everywhere

The logo icon and "AI Sorix" text currently have `gap-2` (8px) or `gap-3` (12px) spacing, making them look disconnected. The fix is to reduce all logo-text gaps to `gap-1.5` (6px) consistently across the app for a tight, professional enterprise look.

### Changes

**1. `src/components/Navbar.jsx`**
- Line 87: Desktop logo — change `gap-2 sm:gap-3` to `gap-1.5`
- Line 268: Mobile menu logo — change `gap-2` to `gap-1.5`

**2. `src/components/Footer.jsx`**
- Line 24: Footer logo — change `gap-2 sm:gap-3` to `gap-1.5`

**3. `src/pages/Login.jsx`**
- Line 98: Login logo — change `gap-3` to `gap-1.5`

**4. `src/pages/Register.jsx`**
- Line 160: Register logo — change `gap-3` to `gap-1.5`

**5. `src/pages/VerifyEmail.jsx`**
- Line 145: Verify email logo — change `gap-3` to `gap-1.5`

**6. `src/pages/CookiePolicy.jsx`**
- Logo-text container — reduce gap to `gap-1.5`

**7. `src/pages/PrivacyPolicy.jsx`**
- Logo-text container — reduce gap to `gap-1.5`

**8. `src/pages/TermsOfService.jsx`**
- Logo-text container — reduce gap to `gap-1.5`

**9. `src/pages/RefundPolicy.jsx`**
- Logo-text container — reduce gap to `gap-1.5`

**10. `src/pages/AboutSorixLab.jsx`**
- Logo-text container — reduce gap to `gap-1.5`

All 10 files get a consistent `gap-1.5` (6px) between logo icon and "AI Sorix" text, matching enterprise-grade brand alignment.

