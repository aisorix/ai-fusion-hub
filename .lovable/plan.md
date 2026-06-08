## Goals

1. Friendly full-page lock screen on `/cineshoot` (requires `premium_plus`+) and `/agent` (requires `premium`+) for under-tier users.
2. Premium Plus, Max, and Enterprise everywhere upgrade plans are shown (chat Settings → Plans & Tokens, UpgradePlanModal, PaymentModal flow).
3. Cineshoot generation is rock-solid: any model, any duration, always returns a video or a true failure — and tokens are only deducted on real success.

---

## 1. Tier lock screens (full-page unlock UX)

New shared component `src/components/shared/PlanLockScreen.tsx`:

- Props: `toolName`, `tagline`, `requiredPlan` (`'premium' | 'premium_plus'`), `accentGradient`, `icon`, `features[]`, `onBack`.
- Layout: centered card with the tool icon in a gradient halo, headline like “Sorix Cineshoot is a Premium Plus tool”, 4–5 feature bullets, “Required plan” badge, two CTAs: **Upgrade plan** (opens `UpgradePlanModal`) and **Back** (navigates `-1`).
- Pure presentation, no business logic. Uses semantic tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`).

Gating helper `src/lib/planAccess.ts`:

```ts
export const PLAN_RANK = { free:0, basic:1, pro:2, premium:3, premium_plus:4, max:5, enterprise:6 } as const;
export const meetsPlan = (plan: UserPlan, required: keyof typeof PLAN_RANK) =>
  (PLAN_RANK[plan] ?? 0) >= PLAN_RANK[required];
```

Wire-up:

- `src/pages/CineshootPage.tsx`: read `currentPlan` from `useSubscription`; if `!meetsPlan(currentPlan, 'premium_plus')`, render `<PlanLockScreen toolName="Sorix Cineshoot" requiredPlan="premium_plus" .../>` instead of the workspace. Keep `SEOHead` so the route still has metadata.
- `src/pages/CoWorkPage.tsx`: same pattern, `requiredPlan="premium"`, gradient cyan→teal, icon `Bot`.
- Server-side gating already exists in `cineshoot` and `cowork-agent` edge functions — UI lock is purely cosmetic on top.

---

## 2. Upgrade surfaces — add Premium Plus, Max, Enterprise

### 2a. `src/components/aichat/UpgradePlanModal.tsx`

- Extend the `plans` array with three new entries that mirror `Pricing.jsx`:
  - `premium_plus` (৳3,999/mo, 7M tokens, icon `Diamond`, gradient `from-violet-500 to-fuchsia-600`, badge “Power”).
  - `max` (৳9,999/mo, 17M tokens, icon `Rocket`, gradient `from-amber-500 via-orange-500 to-red-500`, badge “Ultimate”).
  - `enterprise` (price `null`, icon `Building2`, gradient `from-slate-600 to-slate-800`, `buttonText: 'Book a Demo'`, opens `mailto:support@aisorix.com?subject=AI Sorix Enterprise Demo Request`, no PaymentModal).
- Feature lists copied from `Pricing.jsx` (Cineshoot only on Premium Plus+, Agent on Premium+).
- Grid: desktop becomes `xl:grid-cols-4` with two rows (4 core + 3 advanced wrapping to a second row). Mobile horizontal-scroll already iterates `plans.map` — works as is.
- Enterprise card uses a dedicated handler (`window.location.href = mailto:...`) instead of `setSelectedPlan`.

### 2b. `src/components/aichat/settings/PlansTokensTab.tsx`

- Already maps all 7 plans in `planFeatures`. Update CTA: button label becomes “Manage Plan” only for `max`/`enterprise`, “Upgrade” otherwise.
- Add small badge below plan name when `user.plan === 'premium_plus' | 'max'` highlighting Cineshoot/Agent access.
- Append “Sorix Cineshoot” entry to the tools list with a “Premium Plus+” pill (color reused from existing Free/Included badges).

### 2c. `src/components/PaymentModal.tsx`

- No new gateways needed. Just confirm it can accept the new plan objects (`premium_plus`, `max`) — current code uses `plan.name`/`plan.price` from the caller, so it already works.
- Add a defensive guard: if `plan.price <= 0`, hide gateways and show “Contact sales” copy (covers Enterprise if ever passed in).

### 2d. Backend price validation

- `supabase/functions/sslcommerz-payment/index.ts`, `bkash-payment/index.ts`, `stripe-payment/index.ts`: extend the allowed `(planId, amount)` map to include `premium_plus → 3999` and `max → 9999` (monthly) plus the 20% yearly equivalents. Reject Enterprise.
- `supabase/functions/payment-webhook/index.ts`: already contains `PLAN_NAMES` with the new tiers per the last loop summary — re-verify after edits.

---

## 3. Cineshoot: professional async pipeline

### Problem

Current `cineshoot/index.ts` opens the OpenRouter video job and polls inline for up to ~140s. Edge Function execution can be killed at the platform timeout, but OpenRouter still finishes the render and charges credits. The client then shows “Failed to generate.” The user’s OpenRouter spend is real but the user sees a failure.

### New flow (Async + client polling)

Database migration `video_jobs`:

```sql
CREATE TABLE public.video_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued',  -- queued | rendering | uploading | completed | failed
  provider_job_id text,
  provider_polling_url text,
  model text NOT NULL,
  prompt text NOT NULL,
  aspect_ratio text NOT NULL,
  resolution text NOT NULL,
  duration_sec int NOT NULL,
  sound boolean NOT NULL DEFAULT false,
  source_type text NOT NULL DEFAULT 'text',
  image_data_url text,
  tokens_estimated int NOT NULL,
  tokens_charged int,           -- only set when status='completed'
  video_url text,
  error text,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.video_jobs TO authenticated;
GRANT ALL ON public.video_jobs TO service_role;
ALTER TABLE public.video_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user reads own jobs" ON public.video_jobs FOR SELECT TO authenticated USING (user_id = auth.uid());
-- writes only via service_role through edge functions
```

Three edge functions:

1. **`cineshoot-start`** — validates plan, tier, prompt, computes `tokensCost`, calls OpenRouter `POST /videos`, stores `video_jobs` row (`status='rendering'`, `provider_job_id`, `provider_polling_url`, `tokens_estimated`), reserves no tokens yet, returns `{ jobId }`. Fast (<5s).
2. **`cineshoot-status`** — input `{ jobId }`; loads the row (RLS); on each call:
   - If `status` is terminal (`completed` / `failed`), return current row.
   - Otherwise hits `provider_polling_url` once. If provider returns `completed`, downloads, uploads to `cineshoot-videos` bucket, signs URL, sets `status='completed'`, sets `video_url` and `tokens_charged`, then **inside the same row update** increments `subscriptions.tokens_used` by `tokens_estimated` (atomic per job — `tokens_charged` doubles as an idempotency flag, so retries are safe).
   - If provider returns `failed`, sets `status='failed'`, stores `error`, never charges tokens.
   - If still rendering, increments `attempts` and returns `status='rendering'`. Returns within ~6s max so the client can poll every 4–6s.
3. **`cineshoot-recover` (scheduled, optional v2)** — sweeps jobs older than 10 min still in `rendering`, force-checks provider, fails them out so they don’t hang forever. Out of scope for this PR but the schema supports it.

The existing `video_generations` table is still written, but only as a **history view**: on successful completion `cineshoot-status` also inserts the historical row (so the existing Explorer/history components keep working unchanged).

### Client (`src/services/cineshootApi.ts` + `src/pages/CineshootPage.tsx`)

- Replace `cineshootApi.generateVideo` with `startJob(params): { jobId }` and `getJobStatus(jobId): Job`.
- `useCineshootJob(jobId)` hook polls `cineshoot-status` every 5s with exponential back-off cap of 8s; stops on `completed`/`failed`; surfaces structured states `{ phase: 'rendering' | 'uploading' | 'completed' | 'failed', videoUrl?, error? }`.
- `CineshootCanvas` already shows a generating state; extend it to display the elapsed timer + phase label ("Rendering… 00:42", "Finalizing…").
- On `completed` → set videoUrl, refresh history, update `tokensUsed` from the returned `totalTokensUsed`.
- On `failed` → toast `error`, never deduct tokens locally.
- Polling continues across tab focus changes; if the user navigates away mid-render, the job stays in DB and the explorer picks it up on return (history pulls latest `video_jobs` for `status in ('rendering','completed')`).

### Why this fixes the bug

- Tokens are only deducted when the row actually flips to `completed` with a stored `tokens_charged` value — so a UI failure never charges the user.
- The Edge Function never blocks 140s, so platform timeouts can no longer cause false failures.
- If OpenRouter renders successfully but the client closes, the next page visit polls the same `jobId` and resumes — no lost renders.

---

## 4. File touch list

```text
NEW
  src/components/shared/PlanLockScreen.tsx
  src/lib/planAccess.ts
  src/hooks/useCineshootJob.ts
  supabase/functions/cineshoot-start/index.ts
  supabase/functions/cineshoot-status/index.ts
  supabase migration: create video_jobs + grants + RLS

EDIT
  src/pages/CineshootPage.tsx           -- lock screen + async hook
  src/pages/CoWorkPage.tsx              -- lock screen
  src/components/aichat/UpgradePlanModal.tsx  -- add 3 plans + enterprise CTA
  src/components/aichat/settings/PlansTokensTab.tsx -- Cineshoot row + manage label
  src/components/PaymentModal.tsx       -- price=0 guard
  src/services/cineshootApi.ts          -- startJob/getJobStatus
  supabase/functions/sslcommerz-payment/index.ts -- new price map entries
  supabase/functions/bkash-payment/index.ts      -- new price map entries
  supabase/functions/stripe-payment/index.ts     -- new price map entries

KEEP / DEPRECATE
  supabase/functions/cineshoot/index.ts -- kept temporarily; CineshootPage no longer calls it. Remove in a follow-up loop once history confirms no in-flight callers.
```

## 5. QA checklist

- Free / Basic / Pro user → `/cineshoot` shows lock screen with “Premium Plus required”; clicking Upgrade opens `UpgradePlanModal` with all 7 tiers visible.
- Free / Basic / Pro user → `/agent` shows lock screen with “Premium required”.
- Premium user → `/agent` works, `/cineshoot` still locked.
- Premium Plus user → both work; Cineshoot 6s and 10s renders across Veo, Sora, Kling, Seedance all return playable URLs; tokens deducted only after success.
- Enterprise card opens default mail client to `support@aisorix.com`.
- Settings → Plans & Tokens lists Cineshoot with “Premium Plus+” pill; buying Premium Plus or Max via PaymentModal completes end-to-end (SSLCommerz / bKash / Stripe).
