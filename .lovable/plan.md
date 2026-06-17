## Scope

Fixes and small features across navigation, scholars area, admin polish, and one auth bug. No backend logic changes outside the new `workshops` table and one analytics view fix.

---

### 1. Navbar & Footer — restructure

**Company menu** (Navbar + Footer):
- Remove "Sorix Scholars" from Company. Add "About SorixLab" back, linking to `/about-sorix-lab` (existing `AboutSorixLab.jsx`, re-enabled).
- Keep "Built by SorixLab" CTA → `/about-sorix-lab` (currently redirects to scholars; revert).

**Resources menu**:
- Keep "Sorix Scholars" → `/sorixscholars` (only place it appears).

**Features menu** — new order:
1. Sorix Agent  2. Cineshoot  3. Sorix Health  4. Sorix Agro  5. Sorix Imagine  6. AI Chat  7. Multi-Chat  8. Sorix Deck  9. FlowBuilder  10. Legends  11. Code

**Solutions menu** — new order:
1. Workflow Automation  2. Professional Services  3. (then current rest: Customer Support, Coding, Healthcare, Financial, Government, Life Sciences, Nonprofits, Security)

Files: `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `src/App.jsx` (route-revert for `/about-sorix-lab` redirect).

---

### 2. AboutSorixLab page — restore + add team cards

- Re-enable `/about-sorix-lab` route (remove redirect, keep page intact).
- Add a "Team" section with two cards using the uploaded Rakib photo for both (placeholder for supporting dev):
  - **Rakib Eslam** — Founder & CEO, AI Sorix Limited · Software Engineer
  - **Supporting Developer** — Engineering Team (same photo, placeholder name "TBD")
- Upload Rakib photo via `lovable-assets` from `/mnt/user-uploads/image-347.png` → `src/assets/founder-rakib.jpg.asset.json`.

Files: `src/pages/AboutSorixLab.jsx`.

---

### 3. Workshops module (real DB + admin CRUD)

**Migration** — new table `public.workshops` with: `slug`, `title`, `summary`, `description`, `cover_url`, `mentor_name`, `mentor_role`, `mentor_bio`, `mentor_avatar_url`, `duration_hours`, `price_bdt`, `starts_at`, `is_published`. GRANTs: `SELECT` to anon/authenticated (published only via policy), full to service_role. RLS: anon/authenticated SELECT WHERE `is_published=true`; admins (`has_role` admin*) full access.

**Frontend**:
- `src/pages/scholars/WorkshopsPage.tsx` (list)
- `src/pages/scholars/WorkshopDetailPage.tsx` (detail + mentor card + Buy CTA)
- Routes under `/sorixscholars/workshops` and `/sorixscholars/workshops/:slug` in `src/App.jsx`.
- Add "Workshops" link to `ScholarsNavbar` + `ScholarsFooter`.

**Admin**:
- `src/admin/pages/AdminWorkshops.tsx` — CRUD list + create/edit dialog, role-gated `write`.
- Sidebar entry in `AdminLayout.tsx`.

---

### 4. Mentor info card on Course/Workshop/Competition detail pages

Reusable component `src/components/scholars/MentorCard.tsx` (avatar, name, role, bio, social/contact). Removed from `ScholarsHome` and embedded in:
- `CourseDetailPage.tsx`
- `CompetitionDetailPage.tsx`
- `WorkshopDetailPage.tsx`

Data source: mentor fields already on course/workshop, plus default fallback (Rakib).

---

### 5. Mobile / tablet polish

**ScholarsLayout / Navbar / Footer**: add mobile menu sheet, `px-4 sm:px-6`, stack hero, reduce hero font on `<sm`, fix overflow on mentor section.

**AdminLayout**: convert fixed sidebar to a `Sheet` on `<lg`, collapsible burger button in topbar, tables wrap in `overflow-x-auto`, KPIs `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`, `WorldUsersMap` responsive container.

Files: `src/components/scholars/*`, `src/pages/scholars/ScholarsHome.tsx`, `src/admin/layout/AdminLayout.tsx`, `src/admin/pages/AdminDashboard.tsx`.

---

### 6. Admin input contrast (light & dark)

Audit admin pages using raw `<input>`/`<textarea>` with dark bg. Replace with shadcn `Input`/`Textarea` (semantic tokens already correct) OR add `text-foreground bg-background` explicitly. Targets identified: `AdminCoupons.tsx` (new-coupon dialog shown in screenshot), `AdminBroadcasts.tsx` audience `<select>`, `AdminPrompts.tsx`, `AdminAnnouncements.tsx`. Sweep all `src/admin/pages/*.tsx` for `className="...bg-` without `text-foreground`.

---

### 7. Reset password — redirect bug

Symptom: after clicking the recovery email link, user lands in `/chat` without setting a new password.

Cause: `AuthContext`/router auto-navigates on `SIGNED_IN` event; Supabase fires `SIGNED_IN` (event subtype `PASSWORD_RECOVERY`) on the recovery link too.

Fix:
- In `src/pages/ResetPassword.jsx`: read hash params, if `type=recovery` set a `sessionStorage` flag `pw_recovery=1` before any redirect logic runs.
- In `src/contexts/AuthContext.tsx`: when `event === 'PASSWORD_RECOVERY'` OR `pw_recovery` flag set, do NOT trigger any post-login navigation; force route to `/reset-password`.
- Ensure `ProtectedRoute`/landing redirects respect the flag and don't bounce to `/chat`.
- Clear flag after `updateUser({ password })` success, then navigate to `/login`.

Files: `src/pages/ResetPassword.jsx`, `src/contexts/AuthContext.tsx`, `src/components/ProtectedRoute.tsx` (only if it forces redirects).

---

### 8. Admin analytics data accuracy

Issue: visitors / page views / counts don't match real DB.

Fix in `supabase/functions/admin-traffic-overview/index.ts` and `admin-dashboard-overview/index.ts`:
- Replace estimated counts with exact `SELECT count(*)` from `page_views`, `profiles`, `subscriptions`, `chat_conversations`, `payment_history` using service-role client.
- Visitors = distinct `session_id` in range; Page views = total rows; Unique users = distinct `user_id IS NOT NULL`.
- Honour the `range` param from `AdminRangeContext` (currently ignored in some queries).
- Geographic counts from `page_views.country` group-by (real data, drop hard-coded sample).

Also fix `AdminDashboard.tsx` KPI cards to display the returned values verbatim (no client-side multipliers).

---

### Technical details

**Files created**
- `src/assets/founder-rakib.jpg.asset.json`
- `src/components/scholars/MentorCard.tsx`
- `src/pages/scholars/WorkshopsPage.tsx`
- `src/pages/scholars/WorkshopDetailPage.tsx`
- `src/admin/pages/AdminWorkshops.tsx`
- migration: `workshops` table + RLS + GRANTs

**Files edited**
- `src/components/Navbar.jsx`, `src/components/Footer.jsx`
- `src/App.jsx` (route revert + workshop routes)
- `src/pages/AboutSorixLab.jsx`
- `src/components/scholars/ScholarsNavbar.tsx`, `ScholarsFooter.tsx`, `ScholarsLayout.tsx`
- `src/pages/scholars/ScholarsHome.tsx` (remove mentor section duplication if redundant)
- `src/pages/CourseDetailPage.tsx`, `src/pages/CompetitionDetailPage.tsx`
- `src/admin/layout/AdminLayout.tsx`, `src/admin/pages/AdminDashboard.tsx`
- `src/admin/pages/AdminCoupons.tsx`, `AdminBroadcasts.tsx`, `AdminPrompts.tsx`, `AdminAnnouncements.tsx` (contrast)
- `src/contexts/AuthContext.tsx`, `src/pages/ResetPassword.jsx`
- `supabase/functions/admin-traffic-overview/index.ts`, `admin-dashboard-overview/index.ts`

**Out of scope**
- Real payment/buy-flow for workshops (uses existing `PaymentModal`).
- Issuing certificates for workshops (will reuse existing `user_certificates` with `kind='workshop'`).
- New design tokens.
