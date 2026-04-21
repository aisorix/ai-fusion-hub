

## Pro Polish Round 5: Navbar + Support Chat Tone + About Pages + Legends Tag + Subscription UI Fix

### 1. Navbar — rename Products → Features, add "AI for Freelancers", expand Agentic AI items
**File:** `src/components/Navbar.jsx`

- Rename top-level menu label **"Products" → "Features"** (key stays `products` internally; only the displayed `label` changes to `Features`).
- **Solutions** menu — add new item **"AI for Freelancers"** → `/solutions/ai-for-freelancers` (icon: `Briefcase`).
- **Features** (was Products) menu — add **2 more Agentic-AI / Agents-related entries** (navbar only, NOT footer):
  - **Sorix Agent OS** — "Multi-agent autonomous workspace" → `/agent`
  - **Agent Templates** — "Ready-to-use AI agent recipes" → `/agent` (anchor or reuse)
- Mobile accordion mirrors all changes automatically (already iterates `megaMenus`).

**File:** `src/pages/SolutionsPage.jsx` — add a new `ai-for-freelancers` slug with full SEO content (hero, benefits, stats, CTA, testimonial, schema). Match the existing pattern used for Creators / Professionals.

**File:** `public/sitemap.xml` — add `/solutions/ai-for-freelancers`.

### 2. Support Chat — make replies look professional & visually rich
**File:** `supabase/functions/support-chat/index.ts`

Rewrite the SYSTEM_PROMPT to enforce a clean, premium support format:

- Opening line: short warm greeting with a relevant emoji (👋, ✨, 💳, 🛠️, 🔐 etc. — chosen by topic).
- Use markdown structure: small heading or **bold** label, followed by a tight bullet list (`•` or `- `) with a leading emoji per bullet (✅, 📌, 🔹, ⚡, 📧).
- Keep it scannable — max ~6 bullets, no walls of text, no nested blockquotes.
- End with a subtle action line (e.g., "Need anything else? I'm here. — *Sorix Support Team* ✨").
- For payment/billing — single clean card-style block:
  > 💳 **Billing Help**
  > For payment & billing matters, please email us at **support@aisorix.com** with:
  > • Your account email
  > • Invoice / transaction ID
  > • A short description of the issue
  > Our team resolves these personally within hours. — *Sorix Support Team*
- Forbid raw `>` blockquotes mid-sentence (which produced the messy reply in the screenshot).

Keep model setup as-is (gpt-5-mini primary, deepseek fallback).

### 3. About pages — split "About Us" and "About SorixLab"
- Keep existing `/about-sorix-lab` (the parent R&D lab) as it is.
- Create a NEW page **`src/pages/AboutUsPage.jsx`** at route **`/about-us`** focused on AI Sorix the product/company:
  - Hero: "About AI Sorix — The Global AI Workspace"
  - Sections: Our Mission, Our Story, What We Build (10+ tools), Global Reach (Bangladesh → Asia → World), Trust & Security, Meet the Team (small note pointing to Sorix Lab page), CTA
  - Full SEO: `<SEOHead>`, JSON-LD `Organization` schema
  - Mobile-first responsive (`py-12 sm:py-20`, `text-3xl sm:text-5xl`)
- **`src/App.jsx`** — register lazy route `/about-us` → `AboutUsPage`.
- **`src/components/Navbar.jsx` (Company column):**
  - **About Us** → `/about-us` (new page)
  - **About SorixLab** → `/about-sorix-lab` (existing) — added as a separate entry under Company with icon `FlaskConical` and desc "Our parent R&D lab"
- **`src/components/Footer.jsx` (Company column):** same split — About Us + About SorixLab as two separate links.
- **`public/sitemap.xml`** — add `/about-us`.

### 4. Sorix Legends — remove "Premium" tag in Plans & Tokens
**File:** `src/components/aichat/settings/PlansTokensTab.tsx`

In the "Free Tools for Everyone" card, the Sorix Legends row currently shows an amber "Premium" badge and `opacity-60`. Remove the `Premium` badge and the dimming so it renders cleanly alongside Health / Agro / Deck (no badge, full opacity).

### 5. Subscription tab — show REAL billing dates (critical bug)
**File:** `src/components/aichat/settings/SubscriptionTab.tsx`

Current code uses `mockSubscription` with `currentPeriodEnd = now + 30 days`, which is why every manually activated user sees "Next Billing: today + 30 days" / "30 days remaining" no matter when they were activated.

Fix:
- On mount, fetch the active subscription row for the logged-in user from the `subscriptions` table:
  ```ts
  supabase.from('subscriptions')
    .select('id, plan_id, status, billing_cycle, amount, currency, current_period_start, current_period_end, paused_at, cancelled_at')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1).maybeSingle()
  ```
- Map result → `Subscription` state (parse dates with `new Date(...)`).
- `getDaysRemaining()` already computes from `currentPeriodEnd` — once real data flows in it will show correct values (e.g., a sub created 2026-04-08 with 1 month cycle now correctly shows ~17 days remaining, next billing 2026-05-08).
- Show a small skeleton while loading; if no row found → keep "free" empty state.
- Remove `mockSubscription`.

No DB migration needed — the underlying rows are already correct (verified via query). This is purely a frontend wiring fix.

### 6. Mobile / Polish audit
- Verify new `/about-us` and `/solutions/ai-for-freelancers` look perfect at 390 px (consistent `px-4 sm:px-6`, responsive type scale).
- Verify navbar mega-menu still fits at lg: breakpoint with the renamed "Features" label and 2 extra agent items (`minWidth: 480` already accommodates).

### Files touched
| File | Change |
|------|--------|
| `src/components/Navbar.jsx` | Rename Products→Features label; add 2 agent items + AI for Freelancers; split About Us / About SorixLab |
| `src/components/Footer.jsx` | Split About Us / About SorixLab in Company column |
| `src/pages/AboutUsPage.jsx` | **NEW** — company-focused About page with full SEO |
| `src/App.jsx` | Lazy route `/about-us` |
| `src/pages/SolutionsPage.jsx` | Add `ai-for-freelancers` slug content |
| `public/sitemap.xml` | Add `/about-us` & `/solutions/ai-for-freelancers` |
| `supabase/functions/support-chat/index.ts` | Premium emoji/markdown formatted reply prompt |
| `src/components/aichat/settings/PlansTokensTab.tsx` | Remove Premium badge & opacity from Sorix Legends row |
| `src/components/aichat/settings/SubscriptionTab.tsx` | Fetch real subscription from DB; remove mock |

