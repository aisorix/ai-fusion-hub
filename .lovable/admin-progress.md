# AI Sorix Admin Dashboard — Build Progress

Use this file to resume the build across multiple loops. On each loop, the
agent reads from the top, finds the first ⏳ row, builds it, and marks ✅.

| Week | Scope | Status |
|------|------|--------|
| 1 | Foundation: auth gating, owner seed, RBAC schema, design tokens, layout shell, routes | ✅ shipped |
| 2 | Dashboard overview KPIs + charts + user list + user profile (5 tabs) + CSV export | ✅ shipped (CSV export deferred to Week 3) |
| 3 | AI monitor (per-feature + per-model + abuse + live feed), Revenue dashboard, Subscription manager, Invoices, Refunds, Coupons | ⏳ next |
| 4 | Feature flags editor, Announcements, Prompt template editor, Tickets module deepening, Feedback NPS | ⏳ |
| 5 | System health gauges, API key manager, full Audit timeline, Settings tabs, Polish (Framer Motion, keyboard shortcuts) | ⏳ |

## Notes
- Stack adapted: Supabase Postgres + Edge Functions + Realtime (not Mongo/Express/Redis/Socket.io).
- Owner account `support@aisorix.com` is seeded automatically by `admin-bootstrap` edge function on first /admin/login visit.
- Only `*@aisorix.com` emails with an admin role row in `user_roles` can access `/admin/*`.
- Admin role enum: `admin_super` (full) | `admin_manager` (write) | `admin_viewer` (read-only). Legacy `admin` role also treated as super.
- All write actions log to `audit_logs`.
