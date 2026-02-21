

# Production-Ready: Performance, Mobile Sources Fix, and Token Limit Update

## Overview
Three changes to make the product launch-ready: drastically improve published site load speed via code splitting, fix mobile source links visibility, and update the free plan from 5K to 15K tokens everywhere.

---

## 1. Published Site Performance - Lazy Loading (Code Splitting)

**Problem:** All 20+ pages are eagerly imported in `App.jsx`. When a user visits `/chat`, they also download the code for Health, Agro, Imagine, Legends, Admin, all policy pages, etc. This creates a massive single bundle that loads slowly on production, especially on mobile.

**Fix:** Convert all route imports in `App.jsx` to use `React.lazy()` + `Suspense`. This splits each page into its own chunk that only loads when the user navigates to that route.

**File: `src/App.jsx`**
- Replace all 20+ static `import` statements with `React.lazy(() => import(...))` calls
- Wrap `<Routes>` in `<Suspense fallback={<LoadingScreen />}>`
- Add a simple full-screen loading spinner as the fallback
- Nothing removed -- same routes, same components, same behavior -- just loaded on demand

**Expected impact:** Initial page load drops from loading the entire app (~1MB+) to loading only the current page (~100-200KB). Each subsequent page loads its own small chunk on navigation.

---

## 2. Mobile Source Links Not Showing

**Problem:** In `SourcesWidget.tsx`, the `ExternalLink` icon uses `opacity-0 group-hover:opacity-100` which doesn't work on mobile (no hover). The links themselves work fine but users can't see the external link indicator.

**Fix:** Make the icon always visible on mobile, hover-reveal on desktop only.

**File: `src/components/aichat/SourcesWidget.tsx`** (line 80)
- Change: `opacity-0 group-hover:opacity-100`
- To: `opacity-100 sm:opacity-0 sm:group-hover:opacity-100`

One line change. Nothing removed.

---

## 3. Free Plan Token Limit: 5K to 15K

Update the number `5000` to `15000` and display text `5K` to `15K` in all locations:

### Frontend (4 files)
| File | Line | Change |
|------|------|--------|
| `src/stores/chatStore.ts` | 254 | `free: 5000` to `free: 15000` |
| `src/components/ProtectedRoute.tsx` | 42 | `free: 5000` to `free: 15000` |
| `src/components/Pricing.jsx` | 64, 66 | `5K` to `15K` (tokens display + features text) |
| `src/components/aichat/settings/PlansTokensTab.tsx` | 17 | `tokens: "5K"` to `tokens: "15K"` |
| `src/components/aichat/UpgradePlanModal.tsx` | 52, 56 | `5K` to `15K` (tokens + features) |

### Edge Functions (3 files, need redeployment)
| File | Lines | Change |
|------|-------|--------|
| `supabase/functions/imagine/index.ts` | 62, 70 | `5000` to `15000` |
| `supabase/functions/project-ai/index.ts` | 20, 123 | `5000` to `15000` |
| `supabase/functions/legends-chat/index.ts` | 148 | `5000` to `15000` |

### SEO (1 file)
| File | Line | Change |
|------|------|--------|
| `index.html` | 143 | FAQ text `5K tokens` to `15K tokens` |

---

## Technical Details

### Lazy Loading Pattern
```javascript
// Before (eager - loads everything upfront)
import ChatPage from "./pages/ChatPage";

// After (lazy - loads only when navigated to)
const ChatPage = React.lazy(() => import("./pages/ChatPage"));

// Wrapped in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>...</Routes>
</Suspense>
```

### Files Modified Summary
| File | Change |
|------|--------|
| `src/App.jsx` | Convert all imports to `React.lazy`, add `Suspense` wrapper |
| `src/components/aichat/SourcesWidget.tsx` | Fix mobile ExternalLink visibility |
| `src/stores/chatStore.ts` | `5000` to `15000` |
| `src/components/ProtectedRoute.tsx` | `5000` to `15000` |
| `src/components/Pricing.jsx` | `5K` to `15K` |
| `src/components/aichat/settings/PlansTokensTab.tsx` | `5K` to `15K` |
| `src/components/aichat/UpgradePlanModal.tsx` | `5K` to `15K` |
| `supabase/functions/imagine/index.ts` | `5000` to `15000` |
| `supabase/functions/project-ai/index.ts` | `5000` to `15000` |
| `supabase/functions/legends-chat/index.ts` | `5000` to `15000` |
| `index.html` | FAQ `5K` to `15K` |

**No files deleted. No existing code removed. All existing features preserved.**

