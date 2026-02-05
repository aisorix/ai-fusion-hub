
# Fix: Published Site Broken Styling

## Root Cause Identified

The published site at `https://kindred-ai-suite.lovable.app/` has broken styling because **Tailwind CSS is not scanning JSX files** during the production build.

### The Problem

In `tailwind.config.ts`, the `content` property only includes `.ts` and `.tsx` files:

```text
content: [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}"
]
```

However, the project has many `.jsx` files that contain Tailwind classes:

**Components using .jsx:**
- `Hero.jsx`, `Navbar.jsx`, `Pricing.jsx`, `Features.jsx`
- `Footer.jsx`, `Testimonials.jsx`, `AboutUs.jsx`
- `ThemeToggle.jsx`, `Faqs.jsx`, and more

**Pages using .jsx:**
- `Index.jsx` (landing page)
- `Login.jsx`, `Register.jsx`
- `PrivacyPolicy.jsx`, `TermsOfService.jsx`
- And many others

### Why Preview Works But Published Doesn't

- **Preview**: Uses Vite's development server which processes styles on-demand
- **Published**: Uses a production build where Tailwind purges unused CSS classes - since `.jsx` files aren't scanned, all their Tailwind classes are removed

## Solution

Update `tailwind.config.ts` to include `.js` and `.jsx` file extensions in the content scanning configuration.

### Changes Required

**File: `tailwind.config.ts`**

Update line 5 from:
```typescript
content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
```

To:
```typescript
content: [
  "./pages/**/*.{js,ts,jsx,tsx}",
  "./components/**/*.{js,ts,jsx,tsx}",
  "./app/**/*.{js,ts,jsx,tsx}",
  "./src/**/*.{js,ts,jsx,tsx}"
],
```

## Technical Details

| Aspect | Details |
|--------|---------|
| Files Changed | 1 file (`tailwind.config.ts`) |
| Risk Level | Low - this is a configuration fix |
| After Fix | Re-publish required for changes to take effect on live site |

## After Implementation

Once approved and implemented:
1. The fix will be applied to `tailwind.config.ts`
2. You'll need to click **Publish > Update** to deploy the fix to production
3. The published site should then display correctly with all styles intact
