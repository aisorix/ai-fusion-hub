

# Implementation Plan: Post-Registration Redirect, Build Fix & Mobile UI Enhancements

This plan addresses three key areas:
1. Fixing the build error in `SubscriptionTab.tsx`
2. Ensuring users are redirected to `/chat` after successful registration (both email verification and Google OAuth)
3. Professional mobile UI/UX improvements for model selection and landing page tabs

---

## 1. Fix Build Error (Critical)

**Issue:** The `SubscriptionTab.tsx` file uses an incorrect import syntax for `chatStore`.

**Current Code (Line 30):**
```typescript
import useChatStore from '@/stores/chatStore';
```

**Fix:**
```typescript
import { useChatStore } from '@/stores/chatStore';
```

The store uses a named export, not a default export.

---

## 2. Post-Registration Redirect to Chat

### Current State Analysis

| Flow | Current Behavior | Required Behavior |
|------|-----------------|-------------------|
| **Email Registration** | Shows "Check your email" screen, user clicks link, lands on unknown page | After email verification completes, user should be redirected to `/chat` |
| **Google OAuth** | Session is established via `AuthContext`, but no explicit redirect | User should be redirected to `/chat` after Google login |
| **Login Page** | Correctly redirects to `/chat` | No change needed |

### Implementation Details

#### A. Email Verification Redirect

When users click the verification link in their email, Supabase redirects them to the app with a session. The `AuthContext` needs to detect this and redirect accordingly.

**File: `src/contexts/AuthContext.tsx`**

Add logic to detect email confirmation events:
```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session?.user) {
    // User just signed in (either via email verification or OAuth)
    // The redirect will be handled by Login/Register page effects
  }
});
```

The existing `useEffect` in `Register.jsx` and `Login.jsx` already checks for `user` and redirects to `/chat`. When the email verification link is clicked, the user lands on the app, the session is established, and the redirect should trigger.

**However**, users might land on the home page (`/`) after clicking the verification link. We need to handle this by:
1. Checking if the user just completed email verification on the Index page
2. Adding a redirect effect on the Index page for authenticated users who haven't used the app yet

**File: `src/pages/Index.jsx`**

Add an effect to redirect newly verified users:
```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Inside Index component:
const { user, isLoading } = useAuth();
const navigate = useNavigate();

useEffect(() => {
  // Check if user just verified their email and should go to chat
  const justRegistered = sessionStorage.getItem('justRegistered');
  if (user && !isLoading && justRegistered) {
    sessionStorage.removeItem('justRegistered');
    navigate('/chat');
  }
}, [user, isLoading, navigate]);
```

**File: `src/pages/Register.jsx`**

Set a flag when showing the verification screen:
```javascript
setShowOtp(true);
sessionStorage.setItem('justRegistered', 'true');
```

#### B. Google OAuth Redirect

The current `AuthContext` already handles the OAuth callback and sets the session. However, we need to ensure a redirect happens after OAuth completes.

**File: `src/contexts/AuthContext.tsx`**

Update the `handleOAuthCallback` function to redirect after session is set:
```typescript
if (data.session) {
  setSession(data.session);
  setUser(data.session.user);
  window.history.replaceState(null, '', '/chat');
  // Navigate to chat after OAuth
  window.location.href = '/chat';
}
```

**Alternative approach:** Since the Login and Register pages already have `useEffect` hooks that redirect when `user` is set, the OAuth flow should work automatically. We just need to ensure the user lands on a page that has this redirect logic.

The `signInWithGoogle` function uses `redirect_uri: window.location.origin`, which means users return to `/` after OAuth. We should update this to redirect to `/login` or handle the redirect on the Index page.

---

## 3. Mobile UI/UX Enhancements

### A. Model Selector - Professional Mobile Design

**Current State:** The mobile model selector uses a centered modal with basic styling.

**Enhancements:**

```text
+------------------------------------------+
|  [X]                    Choose Model     |
+------------------------------------------+
|  Your Plan: Sorix Pro       [==75%==]    |
|  1.1M / 1.5M tokens used                 |
+------------------------------------------+
|                                          |
|  FREE MODELS                             |
|  +--------------------------------------+|
|  | [icon] DeepSeek        [Selected]   ||
|  | AI coding & reasoning               ||
|  +--------------------------------------+|
|  | [icon] Gemini                       ||
|  | Multimodal AI                       ||
|  +--------------------------------------+|
|                                          |
|  BASIC MODELS                            |
|  +--------------------------------------+|
|  | [icon] ChatGPT         [2x tokens]  ||
|  | Conversational AI                   ||
|  +--------------------------------------+|
|                                          |
+------------------------------------------+
```

**Key Design Improvements:**
1. **Larger touch targets** - 56px minimum height for each model option
2. **Visual hierarchy** - Clear section headers with colored accents
3. **Token multiplier badges** - Show cost impact clearly
4. **Selected state** - Prominent checkmark with primary color background
5. **Lock indicators** - Elegant upgrade prompts for locked models
6. **Smooth animations** - Spring-based transitions for opening/closing

**File: `src/components/aichat/ModelSelector.tsx`**

Key changes:
- Increase modal padding and spacing
- Add model descriptions below names
- Use larger icons (32x32px on mobile)
- Add haptic feedback styling (scale on tap)
- Improve section separators with subtle gradients

### B. Landing Page Mobile Tab Design

The landing page uses several tabbed/toggle interfaces:

1. **Pricing Toggle** (Monthly/Yearly) - Already implemented with good UX
2. **Pricing Cards** - Uses horizontal scroll on mobile (good pattern)
3. **Features Section** - Grid layout that stacks on mobile

**Enhancements for Pricing Cards Mobile:**

```text
Current: Cards in horizontal scroll
Enhanced: 
+------------------------------------------+
|  [Monthly]  [===Yearly===] Save 20%      |
+------------------------------------------+
|                                          |
|  <- [Free] [Basic] [Pro*] [Premium] ->   |
|     (swipe indicator dots below)         |
|                                          |
+------------------------------------------+

* Active/selected card is slightly elevated
  and has a subtle pulsing border
```

**Key Changes:**
- Add snap points for smooth card-to-card scrolling (already implemented with `snap-center`)
- Add pagination dots below cards to indicate current position
- Improve card contrast when selected
- Add subtle shadow/elevation to active card

**File: `src/components/Pricing.jsx`**

Enhancements:
- Add scroll position indicator dots
- Improve card snap behavior
- Add entrance animations for cards

---

## Technical Summary

| File | Changes |
|------|---------|
| `src/components/aichat/settings/SubscriptionTab.tsx` | Fix import: `import useChatStore` to `import { useChatStore }` |
| `src/contexts/AuthContext.tsx` | Add redirect after OAuth callback completion |
| `src/pages/Register.jsx` | Set `justRegistered` flag in sessionStorage |
| `src/pages/Index.jsx` | Add effect to redirect newly verified users to `/chat` |
| `src/components/aichat/ModelSelector.tsx` | Enhanced mobile modal design with larger touch targets, better typography, and smoother animations |
| `src/components/Pricing.jsx` | Add scroll position indicator dots for mobile pricing cards |

---

## Implementation Order

1. **Fix build error** (SubscriptionTab.tsx import) - Immediate
2. **Post-registration redirect** - High priority
   - Update Register.jsx to set sessionStorage flag
   - Update Index.jsx to check flag and redirect
   - Update AuthContext.tsx for OAuth redirect
3. **Mobile UI enhancements** - After core functionality works
   - ModelSelector improvements
   - Pricing section scroll indicators

