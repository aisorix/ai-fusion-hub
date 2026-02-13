
# Comprehensive Fix Plan: Cross-Device Sync, Language, Performance, UI/UX, SEO, and Plan Updates

This is a large set of fixes and improvements. Here is each item broken down into actionable tasks.

---

## 1. Cross-Device Chat History and Token Sync

**Problem:** Chat history and token usage are stored in Zustand with `localStorage` persistence, meaning each device has its own separate data.

**Solution:**
- Store chat history in the database (new `user_chats` table) so it syncs across devices
- Store token usage (`tokensUsed`) in the `subscriptions` table or a new `token_usage` table
- On login, load chats and token usage from the database instead of localStorage
- Save chats to database on every new message/chat creation
- Use the existing Zustand store as a fast local cache, but seed it from the database on login

**Database changes:**
- Create `user_chats` table: `id`, `user_id`, `title`, `messages (jsonb)`, `created_at`, `updated_at`
- Add `tokens_used` column to `subscriptions` table (or create a `token_usage` table with `user_id`, `tokens_used`, `period_start`)
- RLS policies for both tables (users can only access their own data)

---

## 2. Language Change Sync Between Landing Page and Chatbox

**Problem:** The landing page uses `LanguageContext` (React Context with `useState`), while the chatbox uses `useChatStore` (Zustand). These are completely separate state systems.

**Solution:**
- Sync `LanguageContext` and `useChatStore.language` bidirectionally
- When the landing page `LanguageContext` changes, update `useChatStore.language`
- When the chatbox `GeneralTab` changes language, update `LanguageContext`
- Add a `useEffect` bridge in `App.jsx` or create a shared wrapper that keeps both in sync

---

## 3. Faster AI Model Responses

**Problem:** Response speed depends on backend model routing through OpenRouter.

**Solution:**
- Use `google/gemini-2.5-flash-lite` (Lovable AI) as a fast fallback for simple queries instead of routing through OpenRouter
- Optimize the edge function to reduce cold-start latency (keep-alive patterns)
- For Sorix Legends, switch from `deepseek/deepseek-r1-0528` to a faster model like `google/gemini-2.5-flash` via Lovable AI for quicker responses while maintaining quality
- Set shorter timeout and optimize streaming chunk processing

---

## 4. Sidebar: Rename History Section and Add Hide Button

**Solution:**
- Rename the "Today" / "This Week" / "Older" section header area to show "History" as a section title
- Add a toggle button (eye/chevron icon) next to "History" to collapse/expand the chat list
- Store the collapsed state in Zustand

---

## 5. Collapsed Sidebar: Access Tools, Settings, Upgrade

**Problem:** When sidebar is collapsed, some features may not be accessible.

**Solution:**
- In the collapsed sidebar view, add icon buttons for: More Tools (dropdown), Settings, Upgrade Plan
- Ensure the collapsed sidebar dropdown menu includes all navigation options

---

## 6. Fix Duplicate Notifications (Top + Bottom)

**Problem:** Both `<Toaster />` (from `use-toast`) and `<Sonner />` are rendered in `App.jsx`, causing duplicate notifications.

**Solution:**
- Remove `<Toaster />` component from `App.jsx` (the shadcn/ui toaster)
- Keep only `<Sonner />` with `position="top-center"` for all notifications
- OR: Remove `<Sonner />` and keep only `<Toaster />` -- need to check which one the codebase uses more
- Audit all notification calls to use only one system consistently

---

## 7. Sorix Legends Faster Responses

**Solution:**
- Change the legends-chat edge function to use a faster model (e.g., `google/gemini-2.5-flash` via Lovable AI) instead of `deepseek/deepseek-r1-0528` which is slow due to reasoning tokens
- Keep the persona/roleplay system prompts intact for character accuracy

---

## 8. Professional Google SEO and Meta Tags

**Solution:**
- Update `index.html` with:
  - Proper canonical URL
  - Better structured data (Organization, FAQ, Product)
  - Updated meta descriptions with relevant keywords
  - Proper Open Graph tags with updated model names (GPT-5, Claude Sonnet 4.5, etc.)
  - hreflang tags for English and Bengali
  - robots meta tag
- Add dynamic page titles for key routes via React Helmet or document.title updates

---

## 9. Navbar Logo: Navigate to Home from Anywhere

**Problem:** Logo uses `<a href="#">` which scrolls to top but doesn't navigate to `/` from other pages.

**Solution:**
- Change the logo from `<a href="#">` to `<Link to="/">` using React Router
- This ensures clicking the logo from `/chat`, `/health`, `/legends`, etc. navigates back to the landing page

---

## 10. Settings Buttons Working Properly

**Solution:**
- Audit all settings tabs to ensure buttons are functional
- Verify General (theme/language), Profile (save), Plans & Tokens (upgrade), Subscription, Payment History, Report Bug, Help Center, and Terms tabs all work correctly
- Fix any non-functional buttons

---

## 11. Upgrade Plan Changes

Update both `Pricing.jsx` (landing page) and `UpgradePlanModal.tsx` (chatbox):

**Free Plan:**
- Add Sorix Legends as included (`included: true`)

**Basic Plan:**
- Remove "20 imgs/month" subtext from Image Gen
- Change "2 Sorix Legends" to just "Sorix Legends"

**Pro Plan:**
- Remove "50 imgs/month" subtext from Image Gen
- Change "5 Sorix Legends" to just "Sorix Legends"

**Premium Plan:**
- Remove "100 imgs/month" subtext from Image Gen
- Change "All Sorix Legends" to just "Sorix Legends"

---

## 12. Logged-in User Buying Plan from Landing Page

**Problem:** When authenticated users click "Get Started" on a paid plan, they are redirected to login/register even though they are already logged in.

**Solution:**
- Fix `handlePlanSelect` in `Pricing.jsx` -- the `isAuthenticated` check is already there but may not be loading properly
- Ensure `useAuth()` correctly returns the authenticated state on the landing page
- Debug the timing issue where `isLoading` may still be true when user clicks

---

## 13. Token Calculations from All Interfaces

**Solution:**
- Ensure main chat, multi-window chat, and Sorix Legends all properly deduct tokens from the same Zustand store
- Verify the `updateTokenUsage` function is called consistently
- Sorix Health and Agro should NOT deduct tokens (already excluded)
- Sync token usage to the database (ties into item 1)

---

## 14. Token Limit Upgrade Pop-up

**Problem:** When tokens run out, user should see an upgrade prompt.

**Solution:**
- The existing code in `useAIChat.ts` already shows a toast when 100% is reached
- Enhance this to show the `UpgradePlanModal` instead of just a toast
- Add a check before sending any message: if tokens >= limit, show the upgrade modal directly

---

## Technical Summary

| Area | Files to Modify |
|------|----------------|
| Cross-device sync | New DB migration, `chatStore.ts`, `ProtectedRoute.tsx`, new sync hooks |
| Language sync | `App.jsx`, `GeneralTab.tsx`, `LanguageContext.jsx` |
| Response speed | Edge functions (`chat/index.ts`, `legends-chat/index.ts`) |
| Sidebar UI | `ChatSidebar.tsx`, `MobileSidebar.tsx`, `chatStore.ts` |
| Duplicate notifications | `App.jsx` |
| SEO | `index.html`, route components |
| Navbar logo | `Navbar.jsx` |
| Plan updates | `Pricing.jsx`, `UpgradePlanModal.tsx`, `PlansTokensTab.tsx` |
| Auth + payment fix | `Pricing.jsx` |
| Token limit popup | `useAIChat.ts`, `ChatArea.tsx` |

