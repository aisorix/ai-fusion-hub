## Scope

Nine connected changes spanning the public footer and the admin dashboard.

---

### 1. Footer — shrink SSLCommerz "Pay With" banner by 40%

File: `src/components/Footer.jsx`
- Wrap the existing SSLCommerz strip in a centered container at `max-w-[60%]` (≈40% smaller) with `mx-auto`.
- Keep the rounded border card; reduce vertical padding (`py-3`) and image `max-h` accordingly.
- No logic changes.

---

### 2. Admin sidebar — branded look (logo color, AI Sorix Admin name, adaptive text)

File: `src/admin/layout/AdminLayout.tsx` (+ small CSS tokens in `src/index.css`)
- Sidebar background = brand gradient matching the AI Sorix logo (cyan→teal, already used elsewhere). Add admin-scoped tokens `--admin-sidebar`, `--admin-sidebar-fg` in `index.css` (light + dark variants).
- Header block: logo mark + "AI Sorix Admin" in Plus Jakarta Sans, `gap-1.5`.
- Text auto-contrast rule: use `text-admin-sidebar-fg` token so on white surfaces text becomes black, on dark/colored surfaces text becomes white. Same for active/hover states (replace any hardcoded `text-white`/`text-black`).
- Active nav item gets a translucent overlay (`bg-white/15` on color, `bg-black/5` on white).

---

### 3. Role-Based Access Control for admin pages

Roles already exist: `admin`, `admin_super`, `admin_manager`, `admin_viewer`. Wire them into the UI.

File: `src/admin/guards/AdminGuard.tsx`
- Extend guard to accept `requiredRole?: AdminRole[]` and `mode?: "read"|"write"`.
- Add `<RoleGate roles={[...]}>` wrapper for in-page write actions.

File: `src/App.jsx`
- Per route, declare minimum role:
  - Viewer (read-only): Dashboard, AI Usage/Tokens/Live, Revenue, Subscriptions, Invoices, Audit, Feedback, System Health, Users (list).
  - Manager: Coupons CRUD, Flags toggle, Announcements, Prompts, Tickets reply, Broadcasts.
  - Super only: API Keys, Settings, Secrets, role assignment, destructive user actions.
- Hide sidebar items the user cannot access (filter in `AdminLayout` based on `roles`).
- Edge functions already check `canWrite`/`isSuper` server-side — keep authoritative.

---

### 4. Broadcast messaging — "one-click message all users" (email + in-app notification)

New admin page: `src/admin/pages/AdminBroadcasts.tsx` (sidebar entry under "Communications").
- Compose form: subject, body (markdown), audience (All / Plan filter / Country filter / Specific role), channel checkboxes (Email, In-app banner, Both).
- Preview pane + send button (manager+).
- History table of past broadcasts with delivery counts.

New DB migration:
- Table `broadcasts` (id, subject, body, audience jsonb, channels text[], created_by, created_at, recipient_count, sent_count, status). Standard GRANT block, RLS: admins only via `is_admin_user`.
- Reuse existing `announcements` table for in-app banner channel (insert a row when "in-app" selected).

New edge function: `supabase/functions/admin-broadcast-send/index.ts`
- requireAdmin + canWrite.
- Resolves audience → `profiles` query → email list from `auth.users` via service role.
- For email channel: new React Email template `supabase/functions/_shared/transactional-email-templates/admin-broadcast.tsx` (subject, body, brand header, unsubscribe footer auto-appended). Register in `registry.ts`. Loops one-by-one through `send-transactional-email` with idempotency key `broadcast-{id}-{userId}`.
- For in-app channel: inserts `announcements` row (already has `get_active_announcements` RPC consumed by `AnnouncementBanner.jsx`).
- Writes `broadcasts` row + audit log.

Prereq: email infra must be set up (check status; scaffold if missing).

---

### 5. Dark / Light mode in admin dashboard

- `AdminLayout` already inherits app theme. Add explicit `ThemeToggle` (reuse `src/components/ThemeToggle.jsx`) in the admin top bar.
- Audit admin pages/components for hardcoded colors (`bg-white`, `text-black`, `bg-gray-*`) and replace with semantic tokens (`bg-card`, `text-foreground`, `bg-muted`). Files: `KpiCard`, `DataTable`, `ChartCard`, `StatusPill`, `JsonDiff`, all `AdminXxx.tsx` pages.

---

### 6. Real-time traffic analytics on Admin Dashboard (image 2 style)

File: `src/admin/pages/AdminDashboard.tsx` + new `supabase/functions/admin-traffic-overview/index.ts`
- New "Web Traffic" card: Visitors, Page views, Views/visit, Visit duration, Bounce rate (KPI strip) + 90-day line chart.
- New "Traffic breakdown" 4-column grid: Source, Page, Device, Country (tables with counts).
- Data source: derive from `ai_events` (already logs requests) + new lightweight `page_views` table.
  - Migration: `page_views(id, user_id nullable, session_id, path, referrer, device, country, created_at)` + GRANTs + RLS (insert: anyone via RPC `log_page_view`, select: admins only).
  - Tiny client hook `usePageView()` mounted in `App.jsx` to call `log_page_view` on route change (already-captured `country_code` on profile reused for auth users).
- Realtime: `useAdminRealtime('page_views')` keeps numbers ticking.

---

### 7. World map — country-wise users on Dashboard

- Add `react-simple-maps` + a topojson world atlas.
- New `WorldUsersMap.tsx` admin component. Choropleth colored by user count per `profiles.country_code` (already exists). Hover tooltip shows country + count + % of total.
- Placed under KPI strip on `AdminDashboard.tsx`.

---

### 8. Database explorer page (image 3 style)

New route `/admin/database` → `src/admin/pages/AdminDatabase.tsx`.
- Grid of cards: one per public table, showing name + live row count (realtime via channel).
- Click a card → drawer/sub-page `AdminDatabaseTable.tsx` with paginated row viewer, column headers, search, and JSON cell expansion.
- New edge function `admin-db-explorer/index.ts`:
  - `action: "list_tables"` → returns whitelist of public tables with counts (queried via `pg_class` / `information_schema`).
  - `action: "read_rows"` → params: table (validated against whitelist), limit, offset, order, filter. Uses service role + `requireAdmin` + viewer role allowed.
- "RLS policies" + "Backups" badge buttons are links to existing System Health / Audit pages (no Supabase dashboard link — Cloud-only).

---

### 9. Global date-range filter (Today / Yesterday / 24h / 7d / 14d / 30d / 90d / This month / Custom / **1 year**)

- New shared component `src/admin/components/DateRangePicker.tsx` (popover + presets matching image 4 plus "Last 1 year" and "Custom range" using existing `react-day-picker`).
- New context `src/admin/context/AdminRangeContext.tsx` providing `{from, to, preset, setRange}`, persisted in `localStorage`.
- `AdminLayout` top bar mounts the picker globally.
- Update every analytics edge function to accept `{from, to}` body params and filter accordingly:
  - `admin-dashboard-overview`, `admin-ai-overview`, `admin-ai-tokens`, `admin-ai-usage`, `admin-revenue-overview`, `admin-subscriptions-list`, `admin-invoices-list`, `admin-audit-list`, `admin-feedback-list`, `admin-system-health`, `admin-traffic-overview`.
- Each admin page reads range from context and refetches when it changes.

---

## Technical Notes

- All new tables: standard GRANT block (authenticated/service_role), RLS enabled, admin-only policies via `is_admin_user(auth.uid())`.
- All new edge functions use `_shared/adminAuth.ts` (`requireAdmin`, role check, `audit`).
- New deps: `react-simple-maps`, `d3-geo` (for map), topojson world atlas (`world-atlas` npm).
- No Stripe/bKash references reintroduced — payment surfaces unchanged.
- No client-side admin role check — guard + edge function both verify.
- Reuse existing realtime hook `useAdminRealtime` and chart primitives (`ChartCard`).

---

## Deliverables Summary

```text
NEW FILES
  src/admin/pages/AdminBroadcasts.tsx
  src/admin/pages/AdminDatabase.tsx
  src/admin/pages/AdminDatabaseTable.tsx
  src/admin/components/DateRangePicker.tsx
  src/admin/components/WorldUsersMap.tsx
  src/admin/components/RoleGate.tsx
  src/admin/context/AdminRangeContext.tsx
  src/hooks/usePageView.ts
  supabase/functions/admin-broadcast-send/index.ts
  supabase/functions/admin-traffic-overview/index.ts
  supabase/functions/admin-db-explorer/index.ts
  supabase/functions/_shared/transactional-email-templates/admin-broadcast.tsx
  supabase/migrations/<ts>_admin_phase6.sql  (broadcasts, page_views, RPC)

EDITED FILES
  src/components/Footer.jsx                  (banner -40%)
  src/admin/layout/AdminLayout.tsx           (brand, theme toggle, range picker, role-filter nav)
  src/admin/guards/AdminGuard.tsx            (role-gated routes)
  src/admin/pages/AdminDashboard.tsx         (traffic card, world map)
  src/App.jsx                                (route role requirements, /admin/database, /admin/broadcasts, usePageView)
  src/index.css                              (admin sidebar tokens)
  supabase/functions/_shared/transactional-email-templates/registry.ts
  All admin-* edge functions                 (accept {from,to} range)
  All AdminXxx.tsx pages                     (consume range context, token-based colors)
```
