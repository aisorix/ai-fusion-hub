# Admin Dashboard — Weeks 3–5 Build Plan

Resumes from `.lovable/admin-progress.md`. Stack stays the same: React + Vite + shadcn + Recharts + Lovable Cloud (Supabase Postgres + Edge Functions + Realtime). All new pages mount under the existing `/admin` `AdminGuard` + `AdminLayout`, so email gating (`*@aisorix.com`), RBAC (`admin_super` / `admin_manager` / `admin_viewer`), and audit logging are inherited automatically.

---

## Week 3 — AI Monitoring, Revenue, Subscriptions

### Pages
- `/admin/ai/usage` — Per-feature usage (Chat, Imagine, Cineshoot, Deck, Agent, Health, Agro, Legends, FlowBuilder). Stacked bar (last 30d) + per-feature breakdown table (calls, unique users, avg tokens, error rate).
- `/admin/ai/tokens` — Token consumption: line chart by day, per-model donut (gpt-4o, gemini, claude, perplexity, flux, etc.), top 20 users table with "View" → user profile.
- `/admin/ai/abuse` — Rate-limit hits, repeated failures, suspicious prompt flags. Row actions: Suspend / Reset tokens (writes audit log).
- `/admin/ai/live` — Realtime feed of last 100 AI calls via Supabase Realtime on a new `ai_events` table.
- `/admin/revenue` — KPIs: MRR, ARR, ARPU, LTV (simple formula), churn %, refund rate. Charts: MRR trend, plan distribution, payment method split, geo split.
- `/admin/revenue/subscriptions` — Searchable table from `subscriptions`. Filters: plan, status, billing cycle. Row: Change plan / Cancel / Refund last invoice (refund is a stub posting to `payment_history` + audit; real Stripe refund deferred to opt-in).
- `/admin/revenue/invoices` — Paginated `payment_history`. Export CSV.
- `/admin/revenue/coupons` — CRUD on new `coupons` table.

### Data
- New table `ai_events` (feature, model, user_id, tokens_in/out, latency_ms, status, error_code, created_at) — appended by a thin helper added inside existing AI edge functions (chat, imagine, cineshoot-start, deck-generate, etc.). Added to `supabase_realtime` publication.
- New table `coupons` (code, percent_off, amount_off, currency, max_redemptions, redeemed_count, expires_at, active).
- RLS: admin-only read/write via `is_admin_user(auth.uid())`.

### Edge functions
- `admin-ai-overview` (per-feature + per-model aggregates, date-range param).
- `admin-ai-tokens` (per-day series + top users).
- `admin-revenue-overview` (MRR/ARR/ARPU/churn).
- `admin-subscriptions-list`, `admin-subscription-update` (plan change writes to `subscriptions` + audit).
- `admin-invoices-list`, `admin-invoices-export` (CSV stream).
- `admin-coupons-crud`.

All use the existing `_shared/adminAuth.ts` (`requireAdmin` + `audit` + `canWrite`).

---

## Week 4 — Feature Flags, Announcements, Support, Feedback

### Pages
- `/admin/content/flags` — Toggle UI for new `feature_flags` table (key, description, enabled, rollout_percent, audience JSON). Live-applies via Realtime; existing app code reads through a new `useFeatureFlag(key)` hook.
- `/admin/content/announcements` — CRUD on `announcements` (title, body markdown, severity, audience, starts_at, ends_at, active). Drives the existing `AnnouncementBanner.jsx`.
- `/admin/content/prompts` — Editor for system-prompt templates per tool (Chat, Health, Agro, Legends, etc.) backed by `prompt_templates` table. Version history (`prompt_template_versions`).
- `/admin/support/tickets` — Uses existing `chat_conversations` + `chat_messages` as the ticket source (already powering `/admin/chat`), but adds: status (open/pending/resolved/closed), priority, assignee, tags, internal notes. New columns added via migration. Detail page with reply box, status toggles, assign-to dropdown.
- `/admin/feedback` — New `feedback_entries` table (rating 1–5, NPS, comment, feature, user_id). Charts: NPS score, rating distribution, recent comments.

### Data
- New tables: `feature_flags`, `announcements`, `prompt_templates`, `prompt_template_versions`, `feedback_entries`.
- Extend `chat_conversations` with `status`, `priority`, `assignee_id`, `tags text[]`, `internal_notes`.
- All RLS admin-write, with public-read where needed (flags + active announcements via a SECURITY DEFINER function).

### Edge functions
- `admin-flags-crud`, `admin-announcements-crud`, `admin-prompts-crud`, `admin-tickets-update`, `admin-feedback-list`.

---

## Week 5 — System Health, API Keys, Audit, Settings, Polish

### Pages
- `/admin/system/health` — Gauges for: Lovable AI Gateway status (synthetic ping), OpenRouter status, Supabase DB (round-trip ms), Edge Functions error rate (last hour from `ai_events.status`), storage usage. Auto-refresh every 30s.
- `/admin/system/api-keys` — Lists configured backend secrets (names only, never values) by calling a `admin-secrets-list` function that reads a hardcoded allow-list and reports presence + last-rotated timestamp from a new `secret_audit` table. Rotation is manual (deep-link to settings) — never reveals values.
- `/admin/audit` — Full timeline of `audit_logs` with filters (actor, action, resource, severity, date range). Detail drawer shows `previous_value` / `new_value` diff.
- `/admin/settings` — Tabs: General (site name, support email), Branding (logo upload to `profile-avatars` bucket reused), Email (from-address, footer), Limits (default per-plan token caps), Integrations (toggle Google/GitHub OAuth visibility — wired to existing flags).
- Polish across all admin pages: Framer Motion route transitions + card mount animations, keyboard shortcuts (`g d` dashboard, `g u` users, `g r` revenue, `?` cheat-sheet modal), empty states with illustrations, print-friendly CSS for invoices/audit.

### Data
- New tables: `system_settings` (single-row key/value JSON), `secret_audit`.

### Edge functions
- `admin-system-health` (pings + aggregates).
- `admin-secrets-list` (allow-list only, no values).
- `admin-audit-list` (paginated, filterable).
- `admin-settings-get`, `admin-settings-update`.

---

## Cross-cutting
- **Routing:** `src/App.jsx` — replace the `AdminPlaceholder` routes added in Week 1 with real page imports; add new routes (`ai/abuse`, `ai/live`, `revenue/invoices`, `revenue/coupons`, `content/prompts`, `feedback`, `system/api-keys`).
- **Sidebar:** `src/admin/layout/AdminLayout.tsx` — extend nav with new sections + badges (e.g. open ticket count from Realtime).
- **Shared admin UI:** `src/admin/components/` — `KpiCard`, `DataTable` (wrapping shadcn Table with sort/paginate/filter), `ChartCard`, `ConfirmDialog`, `JsonDiff`, `StatusPill`. Reused across all new pages.
- **Hooks:** `useAdminRealtime(table, filter)` for live feeds; `useFeatureFlag(key)` for client-side flag reads.
- **Audit:** every write edge function calls `audit(...)` from `_shared/adminAuth.ts`.
- **Progress:** mark Weeks 3–5 ✅ in `.lovable/admin-progress.md` as each ships.

## Deliberately deferred (call out, do not build)
- Real Stripe refund API call (stub now, opt-in switch later — needs `STRIPE_SECRET_KEY`).
- Docker / GitHub Actions / nginx — irrelevant on Lovable Cloud.
- Redis cache — Postgres + edge runtime cache headers are sufficient at this scale.
- Per-IP rate limiting at the gateway — handled by Lovable Cloud platform.

## Technical details
- Charts: `recharts` (already in deps).
- Tables: shadcn `Table` + manual pagination (no new dep).
- Animations: `framer-motion` (already in deps).
- Realtime: `supabase.channel().on('postgres_changes', ...)` — tables added to `supabase_realtime` publication in their migration.
- All migrations follow project convention: `CREATE TABLE` → `GRANT` (authenticated + service_role; no anon) → `ENABLE RLS` → policies using `public.is_admin_user(auth.uid())`.
- All admin edge functions: `verify_jwt = false`, validate via `requireAdmin()`, write via service role, log via `audit()`.
- File count estimate: ~6 migrations, ~18 edge functions, ~20 admin pages, ~8 shared admin components, ~3 hooks, ~2 edits to `App.jsx` and `AdminLayout.tsx`.

## Scope per loop
Building all of Weeks 3–5 in one loop will likely exceed the credit budget. Proposed chunking:
- **Loop A (this approval):** Week 3 in full (AI monitoring + Revenue + Subscriptions).
- **Loop B:** Week 4 (Flags, Announcements, Prompts, Tickets deepening, Feedback).
- **Loop C:** Week 5 (System health, API keys, Audit, Settings, Polish).

Confirm and I'll start with Loop A, or tell me to attempt all three in one go and stop when credits run out (progress tracked in `.lovable/admin-progress.md` so the next loop resumes cleanly).
