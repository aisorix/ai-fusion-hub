# Sorix Scholars — Full Admin Control + Payments

Bring courses, workshops, and competitions fully into the database, give admins end-to-end control from the Admin panel, wire SSLCommerz checkout for purchases/registrations, and surface enrollments + revenue analytics. Make every new admin screen polished and responsive (mobile / tablet / desktop).

---

## 1. Database (one migration)

New tables (all in `public`, with GRANTs + RLS + admin-write / public-read-on-published patterns matching the existing `workshops` table):

- **`courses`** — slug, title, tagline, level, duration_label, price_bdt, old_price_bdt, cover_url, banner_url, overview, outcomes (jsonb), instructor (jsonb), faqs (jsonb), seats_total, is_published, sort_order
- **`course_modules`** — course_id, title, sort_order
- **`course_lessons`** — module_id, title, video_url, duration_sec, content_md, is_preview, sort_order
- **`competitions`** — slug, title, tagline, cover_url, banner_url, description, rules, prizes (jsonb), entry_fee_bdt, starts_at, deadline_at, max_participants, is_published
- **`workshop_bookings`** — workshop_id, user_id, seats, amount_paid, payment_intent_id, status (pending/confirmed/cancelled)
- **`competition_registrations`** — competition_id, user_id, team_name, amount_paid, payment_intent_id, status
- **`course_purchases`** — course_id, user_id, amount_paid, payment_intent_id, status

Extend existing:
- `workshops`: add `banner_url`, `seats_total`, `seats_booked` (maintained by trigger on confirmed bookings)
- `payment_intents`: allow `kind` in (`subscription`, `course`, `workshop`, `competition`) + `item_id`/`item_slug` columns (nullable)

RLS pattern per table:
- Public can `SELECT` rows where `is_published = true`
- Admins (`is_admin_user`) full CRUD
- Users can `SELECT` their own purchase/booking/registration rows
- Inserts to purchase/booking/registration tables only via the payment webhook (service_role) — no direct INSERT policy for `authenticated`

RPCs:
- `admin_scholars_overview()` — counts + revenue per kind for date range
- `admin_scholars_enrollments(_kind, _slug, _from, _to)` — user list with paid amount, progress, certificate status

Storage: reuse existing `profile-avatars` for now; add a new **public** bucket `scholars-media` for course/workshop/competition banners + lesson videos. RLS: public read, admin write.

## 2. Data migration

One-time seed from `src/data/academy.ts` and `src/data/workshops.ts` into the new tables (so nothing visually breaks), then switch the public pages to query from DB.

## 3. Admin panel (`/admin/...`)

New section **"Scholars"** in `AdminLayout` sidebar, grouped:

- **`/admin/scholars/courses`** — list + create/edit dialog with tabs: Details · Curriculum (modules/lessons drag-reorder, video upload) · Banner & Cover (image upload) · Pricing · FAQs · Publish toggle
- **`/admin/scholars/workshops`** — replaces current `AdminWorkshops`, extended with banner upload, seats, bookings tab showing every booked user (name, email, seats, amount, status, payment id, export CSV)
- **`/admin/scholars/competitions`** — full CRUD + registrations tab (participants, team, amount, status, CSV)
- **`/admin/scholars/enrollments`** — unified view across all kinds: filter by kind/slug/date, columns = user, item, progress, paid, certificate #, issued at; row click → user profile drawer
- **`/admin/scholars/revenue`** — KPI cards (Total scholars revenue, by kind, refunds), MRR-style trend chart, top items, recent transactions; reuses `KpiCard`, `ChartCard`, `DataTable`, `DateRangePicker`
- **`/admin/scholars/certificates`** — list issued certificates, search by SS-number / user, view PDF, revoke (sets a `revoked_at` flag — verify page already reads this)

All writes route through `RoleGate mode="write"` and existing `_shared/adminAuth.ts` audit logging. Forms use `react-hook-form` + `zod` (length limits per `<input-validation-security>`). Toasts via `sonner` (per memory).

## 4. SSLCommerz payments for Scholars

Reuse `supabase/functions/sslcommerz-payment` pattern. New edge function **`scholars-checkout`** (verify_jwt = true):

Input: `{ kind: 'course'|'workshop'|'competition', slug, seats?, team_name? }`
1. Look up item by slug, verify `is_published`, compute amount server-side (never trust client price)
2. For workshops, verify `seats_booked + seats <= seats_total`
3. Insert `payment_intents` row with `kind`, `item_slug`, `amount`
4. Call SSLCommerz, return `GatewayPageURL`

Extend **`payment-webhook`** to handle scholars intents:
- On `VALID`/`VALIDATED`: insert into `course_purchases` / `workshop_bookings` / `competition_registrations` (service_role), auto-enroll via existing `enroll_item` for courses, increment `seats_booked` for workshops
- On fail/cancel: mark intent failed
- Idempotent on `tran_id`

Frontend:
- Course/Workshop/Competition detail pages get a **"Enroll · ৳X"** primary button that opens a payment modal (reuse `PaymentModal` styling) → posts to `scholars-checkout` → redirects to gateway
- After redirect back, existing `/payment/success` page resolves the intent and shows the right success state per kind
- Free items (price 0) skip checkout and call `enroll_item` directly
- Mandatory T&C consent + coupon support (reuse `validate-coupon`) — per `mem://business/payment-gateway-sslcommerz`

## 5. Responsive polish

Every new admin page:
- Mobile-first layout: cards collapse to single column, tables convert to stacked list on `< sm`
- Sticky toolbar with search + filters that wraps on tablet
- Dialogs `max-h-[90dvh] overflow-y-auto`, full-screen on mobile
- Image uploads with live preview + drag-drop, lazy-loaded thumbnails
- Bangla-safe widths (`min-w-0`, `truncate`, `whitespace-nowrap` only where appropriate) per i18n memory

## 6. Technical notes

- All new admin pages live under `src/admin/pages/scholars/` and route in `App.jsx` inside the existing `AdminGuard` + `AdminLayout`
- Reuse existing admin primitives (`KpiCard`, `DataTable`, `ChartCard`, `ConfirmDialog`, `EmptyState`, `StatusPill`, `DateRangePicker`)
- Public Scholars pages refactored to read from Supabase with React Query; keep current visual design intact
- Video upload uses `scholars-media` bucket with signed-progress upload; large files (>50MB) prompt user to paste a hosted URL instead
- Audit every write through `_shared/adminAuth.ts`
- No client-side price calculation for payments — server recomputes from DB row
- Currency: BDT only (matches existing SSLCommerz integration)
- Seats trigger uses an `AFTER INSERT/UPDATE/DELETE` trigger on `workshop_bookings` to recompute `seats_booked`

## 7. Out of scope (call out)

- Live streaming for workshops (just video URL field; users join via the URL)
- Refund automation — admin can mark a purchase refunded which writes to `payment_history` (matches existing manual-refund pattern from `AdminSubscriptions`)
- Bkash/other gateways — SSLCommerz only per project memory

---

Once approved I will ship this in this order: (1) migration + seed, (2) admin CRUD pages, (3) checkout edge function + webhook extension, (4) public detail-page wiring, (5) revenue/enrollment dashboards, (6) responsive QA pass.
