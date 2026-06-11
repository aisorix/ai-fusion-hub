# Admin Dashboard — Weeks 4 + 5 (Final Loop)

Resumes from `.lovable/admin-progress.md`. Everything mounts under the existing `/admin` `AdminGuard` + `AdminLayout`, inheriting `@aisorix.com` gating, RBAC (`admin_super` / `admin_manager` / `admin_viewer`), and audit logging via `_shared/adminAuth.ts`.

---

## Week 4 — Content, Support, Feedback

### Migration 1 (single file)
- `feature_flags` (key unique, description, enabled, rollout_percent, audience jsonb, updated_by, timestamps)
- `announcements` (title, body_md, severity, audience, starts_at, ends_at, active)
- `prompt_templates` (tool unique, name, body, model, updated_by) + `prompt_template_versions` (template_id, version, body, created_by)
- `feedback_entries` (user_id, feature, rating 1-5, nps 0-10, comment, metadata)
- Extend `chat_conversations`: add `status` (open/pending/resolved/closed), `priority` (low/normal/high/urgent), `assignee_id uuid`, `tags text[]`, `internal_notes text`.
- All tables: GRANT to authenticated + service_role, ENABLE RLS, admin-only write via `is_admin_user(auth.uid())`.
- Public-read helpers (SECURITY DEFINER): `get_active_announcements()`, `get_enabled_flags()` — so the marketing app can read without exposing the table.
- Add `feature_flags` and `announcements` to `supabase_realtime` publication.

### Edge functions
- `admin-flags-crud` (list/upsert/delete + audit)
- `admin-announcements-crud`
- `admin-prompts-crud` (writes new row to `prompt_template_versions` on every update)
- `admin-tickets-update` (status/priority/assignee/tags/internal_notes on `chat_conversations` + audit)
- `admin-feedback-list` (aggregates NPS, rating distribution, recent comments)

### Pages
- `/admin/content/flags` — toggle table, inline rollout % slider, audience JSON editor.
- `/admin/content/announcements` — CRUD with markdown preview, severity pills, schedule pickers.
- `/admin/content/prompts` — left list (tools), right editor with version history drawer.
- `/admin/support/tickets` — list (filter status/priority/assignee) + detail drawer with reply (reuses existing `chat_messages`), status/priority/assignee controls, internal notes.
- `/admin/feedback` — NPS score card, rating histogram, recent comments feed.

### Hooks
- `useFeatureFlag(key)` — public-read via `get_enabled_flags()` RPC, cached + Realtime subscription.
- `useAdminRealtime(table, filter?)` — generic helper used by Live Feed, Flags, Tickets list.

---

## Week 5 — System, Audit, Settings, Polish

### Migration 2 (single file)
- `system_settings` (key unique, value jsonb, updated_by, updated_at) — seeded with `general`, `branding`, `email`, `limits`, `integrations` rows.
- `secret_audit` (secret_name, action enum: rotated/viewed_presence, actor_id, created_at).
- Admin-only RLS.

### Edge functions
- `admin-system-health` — pings Lovable AI Gateway + OpenRouter, measures DB round-trip, computes last-hour error rate from `ai_events`, reads storage usage from `storage.objects`.
- `admin-secrets-list` — hardcoded allow-list of expected secret names; returns `{ name, present: boolean, last_rotated }`. Never returns values. Logs `viewed_presence` to `secret_audit`.
- `admin-audit-list` — paginated, filterable (actor, action, resource, severity, date range).
- `admin-settings-get`, `admin-settings-update` — JSON patch per key, full audit + previous/new diff.

### Pages
- `/admin/system/health` — 5 gauge cards (AI Gateway, OpenRouter, DB, Edge Functions error rate, Storage), auto-refresh 30s.
- `/admin/system/api-keys` — table of expected secrets with presence dot + last-rotated date + "Manage in Settings" deep-link. No values ever rendered.
- `/admin/audit` — DataTable with filter bar; row click opens drawer with JsonDiff (previous_value vs new_value).
- `/admin/settings` — tabs: General, Branding (logo upload to existing `profile-avatars` bucket), Email, Limits, Integrations.

### Shared admin components
- `src/admin/components/`: `DataTable.tsx` (sort/paginate/filter wrapper around shadcn Table), `ChartCard.tsx`, `ConfirmDialog.tsx`, `JsonDiff.tsx`, `StatusPill.tsx`, `EmptyState.tsx`.

### Polish
- Framer Motion: route fade/slide transition wrapper on `<Outlet />`, staggered KpiCard mount.
- Keyboard shortcuts (global in `AdminLayout`): `g d` Dashboard, `g u` Users, `g r` Revenue, `g a` Audit, `?` cheat-sheet modal.
- Empty states with lucide illustrations on every list page.
- Print CSS for `/admin/revenue/invoices` and `/admin/audit` detail.
- Dark-mode pass: ensure all admin pages respect existing `data-admin-theme` light shell (no dark-mode toggle inside admin — explicitly out of scope; admin is always the polished light theme).

---

## Routing changes
`src/App.jsx`: replace the remaining `AdminPlaceholder` routes with real imports for:
`content/flags`, `content/announcements`, `content/prompts`, `support/tickets`, `feedback`, `system/health`, `system/api-keys`, `audit`, `settings`.

Sidebar (`AdminLayout.tsx`): add `Content › Prompts`, `Support › Tickets` already present, `System › API Keys`, `Audit Log` already present, `Feedback` new entry under SUPPORT.

---

## Deliberately deferred (called out, not built)
- Real Stripe refund call (still a stub on the Subscriptions page from Week 3).
- Docker / GitHub Actions / nginx / Redis — irrelevant on Lovable Cloud.
- Per-IP rate limiting at gateway — platform-handled.
- In-admin dark-mode toggle — admin is a fixed light shell by design.

---

## Progress file
On completion, mark Weeks 4 + 5 ✅ in `.lovable/admin-progress.md`.

## File count estimate
- 2 migrations
- 11 edge functions
- 11 admin pages
- 6 shared admin components + 2 hooks
- ~3 edits (`App.jsx`, `AdminLayout.tsx`, progress file)

Approve and I'll build it end-to-end in this loop. If credits run low partway, the progress file will record the last completed module so the next loop resumes cleanly.
