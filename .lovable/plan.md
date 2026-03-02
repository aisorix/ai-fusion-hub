

## Complete Bangla Translation: Professional i18n Coverage

### Problem
The app has **two separate translation systems** that are out of sync, and many components still have hardcoded English strings that don't translate when the user switches to Bangla:

**Two translation files:**
1. `src/contexts/LanguageContext.jsx` — used by landing page components (Navbar, Hero, Pricing, Footer, etc.)
2. `src/lib/translations.ts` — used by chat page components (Sidebar, ChatInput, EmptyState, Settings, etc.)

**Hardcoded English strings found in:**

| Component | Hardcoded Strings |
|-----------|------------------|
| `Navbar.jsx` | Desktop/mobile menu labels ("Features", "Pricing", "FAQs", "About Us"), "Go to Chat", "Sign Out", "Support Dashboard", "Switch Language" |
| `Hero.jsx` | "Powered by the world's most advanced AI models", "+3 more" |
| `Footer.jsx` | "Features", "Pricing", "FAQs" (product links) |
| `Workflow.jsx` | "Premium Models", "Unlock Perplexity, Kimi, Claude, Grok & Mistral..." |
| `Pricing.jsx` | "+X more features" |
| `ModelSelector.tsx` | "FREE MODELS", "BASIC MODELS", "PRO MODELS", "PREMIUM MODELS" |
| `ChatSidebar.tsx` | Various labels not using translation keys |
| `AnnouncementBanner.jsx` | "Built by Sorixlab" |

### Plan

**Step 1: Expand both translation dictionaries with ALL missing keys**

Add to `LanguageContext.jsx` translations (landing page):
- `features`, `pricing`, `faqs`, `aboutUs` (nav labels — English `en` section is missing these)
- `goToChat`, `signOut`, `supportDashboard`, `switchLanguage`
- `poweredByModels`, `moreModels`
- `premiumModels`, `unlockPremiumModels`
- `moreFeatures`
- `builtBySorixlab`

Add to `src/lib/translations.ts` (chat page):
- `freeModels`, `basicModels`, `proModels`, `premiumModels` (model tier labels)
- Any other missing chat-specific keys

**Step 2: Update components to use `t()` instead of hardcoded strings**

Files to update (13 files):
1. **`Navbar.jsx`** — Replace hardcoded "Features"/"Pricing"/"FAQs"/"About Us" in both desktop and mobile menus with `t('features')`, `t('pricing')`, `t('faqs')`, `t('aboutUs')`. Replace "Go to Chat", "Sign Out", "Support Dashboard", "Switch Language".
2. **`Hero.jsx`** — Replace "Powered by the world's most advanced AI models" and "+3 more" with `t()` calls.
3. **`Footer.jsx`** — Replace hardcoded "Features"/"Pricing"/"FAQs" product links with `t()`.
4. **`Workflow.jsx`** — Replace "Premium Models" and unlock description with `t()`.
5. **`Pricing.jsx`** — Replace "+X more features" with translated string.
6. **`AnnouncementBanner.jsx`** — Replace "Built by Sorixlab" with `t()`.
7. **`ModelSelector.tsx`** — Replace "FREE MODELS"/"BASIC MODELS"/"PRO MODELS"/"PREMIUM MODELS" section titles with translated keys from `src/lib/translations.ts`.
8. **`ChatSidebar.tsx`** — Audit and replace any remaining hardcoded strings.
9. **`UpgradePlanModal.tsx`** — Verify all plan feature text uses translations.
10. **`settings/PlansTokensTab.tsx`** — Verify translated labels.
11. **`settings/GeneralTab.tsx`** — Verify translated labels.
12. **`settings/ProfileTab.tsx`** — Verify translated labels.
13. **`settings/HelpCenterTab.tsx`** — Verify translated labels.

**Step 3: Ensure both translation stores stay in sync**
- The `LanguageSyncBridge` component already syncs the two systems bidirectionally — no changes needed here.

### Scope
- ~13 component files updated to use `t()` calls
- 2 translation dictionary files expanded with ~25-30 new keys each (en + bn)
- No structural/layout changes — purely string replacement

