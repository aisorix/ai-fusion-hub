
# AI Sorix Admin Dashboard — Weeks 1–2 (Lovable Cloud build)

Stack adapted from your spec (Node/Mongo/Redis/Socket.io) to the actual project stack:
React 18 + Vite + TailwindCSS + shadcn + **Lovable Cloud (Supabase Postgres + Edge Functions + Realtime)**. All "Redis cache / Socket.io" features become Supabase Realtime + edge-cached views. All "Mongo collections" become Postgres tables with RLS.

We'll ship Weeks 1–2 this loop and leave a `.lovable/admin-progress.md` tracker so Weeks 3–5 resume cleanly next loop.

---

## Week 1 — Foundation, Auth, RBAC, Layout

### 1.1 Owner account auto-seed (your requirement)
New edge function `admin-bootstrap` (public, no JWT):
- Uses service role to check if `support@aisorix.com` exists in `auth.users`.
- If missing, creates it via Admin API with the password you gave and `email_confirm: true`.
- Inserts `user_roles (user_id, role='admin_super')`.
- Called once from the `/admin/login` page on first mount (idempotent — exits early if seed already done; protected by `INTERNAL_WEBHOOK_SECRET` to block public abuse).

### 1.2 Admin-only email gating
- `/admin/*` routes wrapped in `<AdminGuard>`:
  - Requires authenticated session.
  - Requires `user.email.endsWith('@aisorix.com')`.
  - Requires a row in `admin_users` (active = true) with one of `SUPER_ADMIN | MANAGER | VIEWER`.
- Non-admin emails see a friendly "Admin portal — restricted access" screen with a Back-to-app link.
- Public app login/signup at `/login` `/register` is untouched.

### 1.3 RBAC schema (migration)
New tables (all with GRANTs + RLS):
- `admin_users` — `user_id uuid PK → auth.users`, `role admin_role`, `is_active`, `last_login_at`, `last_login_ip`.
- `audit_logs` — `actor_id`, `action`, `resource`, `resource_id`, `previous_value jsonb`, `new_value jsonb`, `ip`, `user_agent`, `created_at`.
- `announcements` — title, body, type, is_active, start_at, end_at.
- `feature_flags` — key (unique), name, description, enabled, enabled_for_plans text[], enabled_for_user_ids uuid[].
- `support_tickets` (if not already present — confirm existing `chat_conversations` covers it; if yes, reuse).
- New enum `admin_role` = `SUPER_ADMIN | MANAGER | VIEWER`.
- New SECURITY DEFINER function `public.is_admin(_user_id uuid)` + `public.admin_has_permission(_user_id, _perm text)`.
- RLS: all admin tables restricted to `is_admin(auth.uid())`; `audit_logs` insert-only from edge functions (service role).

Existing `user_roles` table already enforces the separate-roles-table rule — we extend the enum.

### 1.4 Design system & layout shell
- `src/admin/` folder isolates the dashboard from the main app.
- Brand tokens added to `src/index.css` under `[data-admin-theme]` scope so the marketing site is unaffected:
  navy `#0A1628`, blue `#1A6FD8`, cyan `#00B4D8`, surface `#F8FAFC`, etc. (all HSL).
- `AdminLayout` = collapsible sidebar (240↔64px, persisted) + topbar (page title, Cmd+K spotlight stub, notifications bell, admin avatar menu).
- Sidebar groups: Overview · Users · AI Monitor · Revenue · Content · Support · System.
- shadcn primitives already cover Button/Input/Modal/Badge/Table/Card/Avatar/Tooltip/Dropdown/Toast/Skeleton — we wrap them with admin-themed variants instead of duplicating.

### 1.5 Routes (lazy-loaded)
```
/admin/login           AdminLogin (calls admin-bootstrap on mount)
/admin                 → /admin/dashboard
/admin/dashboard       Week 2
/admin/users           Week 2
/admin/users/:id       Week 2
/admin/ai/*            Week 3 (placeholder)
/admin/revenue/*       Week 3 (placeholder)
/admin/content/*       Week 4 (placeholder)
/admin/support/*       Week 4 (placeholder — reuse existing /admin/chat)
/admin/system/*        Week 5 (placeholder)
/admin/audit           Week 5 (placeholder)
/admin/settings        Week 5 (placeholder)
```
Placeholders render a "Coming in Week N" card so navigation works end-to-end immediately.

---

## Week 2 — Dashboard Overview + User Management

### 2.1 Dashboard Overview (`/admin/dashboard`)
KPI row (6 cards): Total Users · Active Today · MRR (BDT) · Total Tokens Used (this month) · Open Tickets · New Signups Today.
Charts (Recharts, already installed):
- User Growth line (30d) — `profiles.created_at` aggregation.
- Plan Distribution donut — from `subscriptions`.
- Top AI Features bar — from existing tool tables (`image_generations`, `presentations`, `video_jobs`, `analysis_history`, `cowork_tasks`, `agent_runs`).
- AI Model usage pie — from same.
Recent Signups (10) + Recent Tickets (10) tables.
Alerts panel: Supabase Realtime subscription on `audit_logs` for `severity='high'` events.

Data via one edge function `admin-dashboard-overview` returning a single payload (cached 30s in-memory per instance).

### 2.2 User Management
**List** `/admin/users`:
- Server-side paginated query (edge function `admin-users-list`) supporting `search, plan, status, sortBy, sortOrder, country, page, limit`.
- Filters + stats strip + bulk selection.
- Bulk Email / Bulk Suspend / Bulk Export CSV.
- Row actions: View Profile · Edit Plan · Send Email · Suspend · Ban · Delete (soft).

**Profile** `/admin/users/:id` — 5 tabs:
- **Overview**: profile card, plan card with "Change Plan" modal (calls `admin-user-update` → writes to `subscriptions` + audit).
- **AI Usage**: 30-day bar (from existing usage tables) + per-feature donut + paginated log.
- **Billing**: subscription card + invoices from `payment_history` + "Issue Refund" stub (Week 3 wires Stripe).
- **Tickets**: list from `chat_conversations` filtered by `user_id`.
- **Activity Log**: logins + admin actions from `audit_logs` where `resource_id = user_id`.

All write actions go through edge functions that:
1. Verify caller is admin via `getClaims()` + `is_admin()`.
2. Check permission for the action.
3. Perform mutation with service role.
4. Insert into `audit_logs`.

### 2.3 CSV export
- `admin-users-export` edge function streams CSV with applied filters; respects `MANAGER`+ permission.

---

## Edge functions added this loop
```
admin-bootstrap            seed support@aisorix.com once
admin-dashboard-overview   single-payload KPIs + charts data
admin-users-list           paginated list + filters
admin-user-get             full profile + tabs payload
admin-user-update          plan/status/token edits, audit
admin-user-action          ban/unban/suspend/delete/email, audit
admin-users-export         CSV export
```
All set `verify_jwt = false` per project convention and validate via `getClaims()` + RLS-aware service-role queries.

---

## Progress tracker
Create `.lovable/admin-progress.md`:
```
Week 1: ✅ shipped
Week 2: ✅ shipped
Week 3: ⏳ AI monitor, revenue, subscriptions, invoices, coupons
Week 4: ⏳ feature flags UI, announcements UI, prompt editor, tickets module, feedback
Week 5: ⏳ system health, API keys, audit UI, settings, polish
```
On every subsequent loop, agent reads this file and continues from the first `⏳` row, marking ✅ as it goes — so if credits run out mid-feature, the next loop knows exactly where to resume.

---

## Files touched (high level)
**New (~25):**
- `supabase/migrations/<ts>_admin_dashboard_foundation.sql`
- 7 edge functions under `supabase/functions/admin-*/`
- `src/admin/layout/{AdminLayout,Sidebar,Topbar,PageWrapper}.tsx`
- `src/admin/guards/AdminGuard.tsx`
- `src/admin/lib/{rbac.ts,adminApi.ts}`
- `src/admin/pages/{AdminLogin,Dashboard,UserList,UserProfile,Placeholder}.tsx`
- `src/admin/components/{KpiCard,UserTable,UserActions,ChangePlanModal,...}.tsx`
- `.lovable/admin-progress.md`

**Edited (~5):**
- `src/App.jsx` — register `/admin/*` routes (lazy).
- `src/index.css` — `[data-admin-theme]` tokens.
- `tailwind.config.ts` — admin color tokens.
- `src/integrations/supabase/types.ts` — auto-regen after migration.

---

## What's NOT in this loop (deferred to Weeks 3–5)
Stripe refund wiring, real Socket.io live AI feed (will use Supabase Realtime), feature-flag UI editor, announcement editor, prompt template editor (Monaco), system health gauges, API key reveal flow, full audit timeline UI, settings tabs, Framer Motion polish, Docker/CI (not applicable on Lovable — handled by platform).

---

## QA checklist (end of Week 2)
- Visit `/admin/login` from a fresh browser → can sign in as `support@aisorix.com` with the seeded password.
- Non-`@aisorix.com` user hitting `/admin/dashboard` sees the restricted screen.
- Dashboard renders 6 KPIs + 4 charts + 2 tables with real data.
- User list paginates, filters, exports CSV.
- Editing a user's plan writes to `subscriptions` and creates an `audit_logs` row.
- Sidebar collapse persists across reload.
