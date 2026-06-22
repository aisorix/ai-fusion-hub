## Goals

1. Lock **Sorix Cineshoot** to Premium Plus / Max / Enterprise, but allow every other plan a **2-render free trial**.
2. Fix the **Pricing / plan packages** so all plans render correctly on mobile (and any other broken responsive spots in the same component).
3. Fix **Text-to-Speech** and **Speech-to-Text** "failed to fetch" errors with graceful fallbacks.
4. Fix **mobile chat** layout/update issues.
5. Fix **Sorix Scholars** mobile view issues.

All work is frontend + edge-function hardening + a tiny backend counter for free-trial renders. No business-logic rewrites beyond what is needed for the above.

---

## 1) Cineshoot free trial (2 renders for non-eligible plans)

**Backend**
- New migration: add `cineshoot_free_renders_used INTEGER NOT NULL DEFAULT 0` on `profiles` (or `subscriptions`, whichever already tracks per-user counters — will confirm during build and pick the existing one). GRANTs + RLS preserved.
- `cineshoot-start` edge function:
  - If user plan meets `premium_plus` → unchanged.
  - Else if `cineshoot_free_renders_used < 2` → allow, and on successful completion (in `cineshoot-status` finalize path) increment the counter atomically via a `SECURITY DEFINER` RPC `increment_cineshoot_free_render()`.
  - Else → return `{ error: 'free_trial_exhausted' }` (402).

**Frontend (`src/pages/CineshootPage.tsx`)**
- Replace the hard `PlanLockScreen` block with:
  - Eligible plan → current full UI.
  - Non-eligible plan with `freeRendersUsed < 2` → show full UI plus a prominent "Free trial: X of 2 renders left — upgrade for unlimited" banner; gate the Generate button to open `UpgradePlanModal` once exhausted.
  - Non-eligible plan with trial exhausted → keep `PlanLockScreen`.
- Read counter via existing `useSubscription` (extend it to expose `cineshootFreeRendersUsed`) or a small dedicated hook.
- Handle the `free_trial_exhausted` server error by opening `UpgradePlanModal`.

**Pricing copy (`src/components/Pricing.jsx`)**
- For plans below Premium Plus, show "Sorix Cineshoot — 2 free renders" instead of hiding it.

---

## 2) Mobile pricing / plan packages

`src/components/Pricing.jsx`
- Audit the plan grid: currently uses a desktop-first grid that clips cards on small screens.
- Switch to a horizontally scrollable snap carousel on `<md` (Tailwind `flex overflow-x-auto snap-x snap-mandatory` with `min-w-[85%]` cards) and the existing grid on `md+`.
- Ensure every plan card (Free, Basic, Pro, Premium, Premium Plus, Max, Enterprise) renders with full feature list, no truncation, no overflow.
- Repeat the same audit on other plan-comparison spots (`UpgradePlanModal`, any plan grids inside Dashboard) and apply the same responsive treatment where they break.

---

## 3) Text-to-Speech + Speech-to-Text reliability

**TTS — `src/hooks/useTtsPlayback.ts` + `supabase/functions/tts-speak/index.ts`**
- Edge function: on provider failure, return `200 { fallback: true, reason }` instead of 502 so the client never throws "failed to fetch".
- Client: detect `Content-Type: application/json` and `fallback: true` → seamlessly fall back to `window.speechSynthesis` with the requested language voice. Also fallback on any network throw.
- Preserve the gesture chain: create `SpeechSynthesisUtterance` synchronously in the click handler before any `await`.

**STT — `src/hooks/useVoiceDictation.ts` + `supabase/functions/stt-transcribe/index.ts`**
- Edge function: same pattern, return `200 { fallback: true }` on provider error.
- Client: on fallback / network error, switch to the browser `SpeechRecognition` API (where available) and emit the transcript through the existing `onTranscript` callback. Surface a single sonner toast only when both premium + browser fallback fail.
- Cancel in-flight uploads cleanly on `cancel()`.

---

## 4) Mobile chat fixes

`src/pages/ChatPage.tsx` + `src/components/aichat/*` + `src/hooks/useChatSync.ts`
- Ensure root container uses `h-[100dvh]` and the message list is the only scroll container (fixes iOS Safari "doesn't update" bug caused by nested scrollers).
- Fix the input bar so it stays above the iOS keyboard (`env(safe-area-inset-bottom)` padding, `position: sticky` instead of `fixed` where needed).
- Verify realtime subscription resubscribes on visibility change (mobile tab suspension currently drops it silently).
- Ensure messages re-render after streaming completes on mobile (force scroll-to-bottom via the existing `useAutoScroll` hook with `will-change: scroll-position`).

---

## 5) Sorix Scholars mobile

`src/components/scholars/ScholarsLayout.tsx`, `ScholarsNavbar.tsx`, `pages/scholars/ScholarsHome.tsx`, `CourseDetailPage.tsx`, `WorkshopDetailPage.tsx`, `CompetitionDetailPage.tsx`, `sections/*`
- Navbar: collapse to hamburger under `md`, ensure language toggle stays visible.
- Hero + section grids: switch to single-column on `<md`, add `min-w-0` and `truncate`/`whitespace-nowrap` for the Bangla strings per memory rule (BN is 20-30% wider).
- Detail pages: standardized 10-section layout must stack cleanly on mobile (no horizontal scroll, no overlapping CTAs).
- Footer: ensure links wrap rather than overflow.

---

## Technical notes

- New migration file under `supabase/migrations/` with grants + RLS + RPC.
- Edge function changes: `cineshoot-start`, `cineshoot-status`, `tts-speak`, `stt-transcribe`. JWT verification stays on; forwarded Auth header preserved.
- No changes to payments, no changes to existing token-cost logic for Cineshoot (paid plans still spend tokens; free-trial renders cost 0 tokens but increment the trial counter).
- All new toasts use `sonner` per project memory.
- Brand styling (Plus Jakarta Sans, gap-1.5) preserved.

---

## Files expected to change

```
supabase/migrations/<new>_cineshoot_free_trial.sql
supabase/functions/cineshoot-start/index.ts
supabase/functions/cineshoot-status/index.ts
supabase/functions/tts-speak/index.ts
supabase/functions/stt-transcribe/index.ts
src/hooks/useTtsPlayback.ts
src/hooks/useVoiceDictation.ts
src/hooks/useSubscription.ts
src/pages/CineshootPage.tsx
src/components/Pricing.jsx
src/components/aichat/UpgradePlanModal.tsx          (plan grid responsive)
src/pages/ChatPage.tsx
src/components/aichat/*                              (input bar / scroll containers)
src/components/scholars/ScholarsLayout.tsx
src/components/scholars/ScholarsNavbar.tsx
src/components/scholars/ScholarsFooter.tsx
src/components/scholars/sections/*                   (responsive)
src/pages/scholars/ScholarsHome.tsx
src/pages/scholars/{CourseDetail,WorkshopDetail,CompetitionDetail}Page.tsx
```
