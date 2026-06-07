## Goal

Introduce two new paid tiers (**Sorix Premium Plus** — ৳3,999/mo, **Sorix Max** — ৳9,999/mo) and an **Enterprise** card across the entire pricing surface, with full enforcement (UI + edge functions + payments).

## New plan matrix


| Plan ID        | Display name           | Price (BDT/mo) | Tokens/mo      | Exclusive unlocks                                             |
| -------------- | ---------------------- | -------------- | -------------- | ------------------------------------------------------------- |
| `free`         | Free                   | 0              | 15,000         | —                                                             |
| `basic`        | Sorix Basic            | 499            | 800,000        | —                                                             |
| `pro`          | Sorix Pro              | 999            | 1,500,000      | —                                                             |
| `premium`      | Sorix Premium          | 1,999          | 3,000,000      | + Sorix Agent                                                 |
| `premium_plus` | **Sorix Premium Plus** | **3,999**      | **7,000,000**  | + Sorix Cineshoot, more memory                                |
| `max`          | **Sorix Max**          | **9,999**      | **17,000,000** | + extra Cineshoot/Imagine/Agent capacity, max memory          |
| `enterprise`   | Enterprise             | Custom         | Pooled         | Book demo → [support@aisorix.com](mailto:support@aisorix.com) |


Tool-tier rules per your spec:

- **Sorix Agent** → `premium`, `premium_plus`, `max`
- **Sorix Cineshoot** → `premium_plus`, `max`
- Image/agent/memory quantity is bounded only by the user's token budget (no extra hard caps).

## Files to update

### 1. Plan type and limits (single source of truth)

- `src/stores/chatStore.ts`
  - Extend `UserPlan` union to include `'premium_plus' | 'max'` (and `'enterprise'` for display only).
  - Extend `PLAN_TOKEN_LIMITS` with `premium_plus: 7_000_000`, `max: 17_000_000`.
  - Update `PLAN_RANK` ordering used by model gating helpers.
  - Add `premium_plus` / `max` to every model `plans` array that currently lists `premium` so paid users don't lose access to existing models when they upgrade.

### 2. Backend gates (edge functions)

Update plan limits + tier checks in:

- `supabase/functions/cineshoot/index.ts` — reject anything below `premium_plus` ("Cineshoot requires Premium Plus or above"); add new tokens to `PLAN_LIMITS`; widen `PLAN_RANK`.
- `supabase/functions/cowork-agent/index.ts` and `supabase/functions/agent-router/index.ts` — require `premium` or higher (current rule already restricts paid; tighten to reject `free/basic/pro`).
- `supabase/functions/flowbuilder-generate/index.ts`, `deck-generate/index.ts`, `imagine/index.ts`, `health-analysis/index.ts`, `agro-analysis/index.ts`, `legends-chat/index.ts`, `chat/index.ts`, `project-ai/index.ts` — add `premium_plus` & `max` to their `planLimits` / `PLAN_LIMITS` maps so token quota is honored.

### 3. Pricing UI

- `src/components/Pricing.jsx` — add three new cards rendered **below** the existing 4-card row (Premium Plus, Max, Enterprise) as a second row (3-column on desktop, snap-scroll on mobile per existing pattern). Use new badges:
  - Premium Plus → "Power" badge (purple/violet gradient)
  - Max → "Ultimate" badge (gold/orange gradient)
  - Enterprise → small mailto card matching the screenshot (icon + "Flexible pooled usage" + "Custom plan — book a demo" + `mailto:support@aisorix.com` CTA)
- Feature lists per the brief, including footnotes like "Sorix Cineshoot (Premium Plus & above)" / "Sorix Agent (Premium & above)".

### 4. Other pricing surfaces

- `src/components/aichat/settings/PlansTokensTab.tsx` — render all six tiers in the upgrade list; show current plan + upgrade buttons for `premium_plus` and `max`.
- `src/components/aichat/UpgradePlanModal.tsx` — add new tier options.
- `src/components/aichat/PlanIcons.tsx` — add icons/colors for `premium_plus` (Crown+) and `max` (Zap/Diamond).
- `src/components/PaymentModal.tsx` — map new `plan_id`s to BDT amounts (3999 / 9999) for SSLCommerz, bKash, Stripe.
- `supabase/functions/sslcommerz-payment/index.ts`, `bkash-payment/index.ts`, `stripe-payment/index.ts`, `payment-webhook/index.ts`, `subscription-email/index.ts` — accept new `plan_id` values, persist correct amount, send proper emails.
- `src/pages/PaymentSuccess.tsx` — friendly names for new tiers.

### 5. Tool gating UX (lock + upgrade prompts)

- `src/pages/CineshootPage.tsx` / `src/components/cineshoot/*ModelSelector.tsx` — if `currentPlan` rank < `premium_plus`, show lock screen with "Upgrade to Premium Plus" CTA opening `UpgradePlanModal` pre-selected to `premium_plus`.
- Same pattern for Sorix Agent (`src/pages/CoWorkPage.tsx`) requiring `premium`+.
- Tools gallery `src/pages/ToolsPage.tsx` — add tier badges on Cineshoot and Agent cards.

### 6. Translations

- `src/lib/translations.ts` — add English + Bangla strings for new tier names, the "requires Premium Plus" copy, and Enterprise CTA. Apply Bangla wider-text utilities (truncate / whitespace-nowrap).

### 7. Database / no schema changes

The `subscriptions.plan_id` column is free-form `text`, so no migration is needed; new IDs (`premium_plus`, `max`, `enterprise`) are accepted as-is. Enterprise customers stay on a `free` row until manually upgraded by support.

## Technical notes (for reviewers)

- Single rank order used everywhere: `free=0, basic=1, pro=2, premium=3, premium_plus=4, max=5`. Update `PLAN_RANK` constants in `chatStore.ts` and every edge function in lockstep so model/tool tier checks pass.
- All payment edge functions verify amount server-side before creating the `payment_intents` row, so new prices must be added in **both** `PaymentModal.tsx` (display) and the matching payment edge function (validation) to avoid mismatch errors.
- Cineshoot/Agent lock screens reuse existing `UpgradePlanModal` — pass `initialPlan="premium_plus"` / `"premium"` prop (added in this change) so the modal highlights the right card.
- Enterprise card is informational: no checkout flow — only a `mailto:support@aisorix.com?subject=Enterprise%20Demo%20Request` link, matching the reference screenshot.

## Out of scope

- Yearly billing discount changes for the new tiers (will inherit existing 20% yearly logic automatically).
- Admin tooling to manually upgrade Enterprise customers (existing service-role pattern still applies).