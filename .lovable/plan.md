# Sync Footer Features with Navbar + Admin Mobile Polish

## 1. Footer Features list — match Navbar order exactly

`src/components/Footer.jsx` Features column currently starts with AI Chat / Multi-window then Agents. Navbar's mega-menu puts the tool-first ordering at the top. Reorder the footer `<ul>` to mirror Navbar `megaMenus.products` exactly:

1. AI Agents → /agent
2. Sorix Agent OS → /agent
3. Sorix Cineshoot → /cineshoot
4. Sorix Health → /health
5. Sorix Agro → /agro
6. Sorix Imagine → /imagine
7. AI Chat → /chat
8. Multi-window Chat → /chat?multi=1
9. Sorix Deck → /deck
10. Flow Builder → /flowbuilder
11. Sorix Legends → /legends
12. Sorix Security → /sorix-security
13. Sorix for Chrome → /sorix-for-chrome
14. Skills → /skills

Same icons, same labels, same routes as Navbar — single source of truth visually.

Also verify Footer Solutions column matches the Navbar Solutions reorder (Workflow → Professional Services → Professionals → Educators → Startups → Researchers → Creators → Freelancers → rest). Patch any drift.

## 2. Admin mobile + tablet polish (all `/admin/*` pages)

Goal: every admin page is usable and clean at 360–768px without horizontal scroll bleed or cramped controls.

### 2a. Shared layout (`src/admin/layout/AdminLayout.tsx`)
- Header: stack `DateRangePicker` below the title on `<sm` (move it into a second row); shrink title to `text-sm` with truncation.
- Show `DateRangePicker` on mobile too (currently hidden `sm:block`) but full-width in the second row.
- Reduce main padding to `p-3` on mobile (already done) and ensure `overflow-x-auto` is only on the table wrapper, not the whole `<main>`, so sticky header doesn't shift.

### 2b. Shared components
- `src/admin/components/DataTable.tsx`: wrap `<table>` in `overflow-x-auto rounded-md border`; add `min-w-[640px]` on table so columns don't squish. Make pagination/footer wrap (`flex-wrap gap-2`).
- `src/admin/components/KpiCard.tsx`: ensure responsive grid usages (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`) — audit all pages.
- `src/admin/components/ChartCard.tsx`: enforce `w-full` and `h-[260px] sm:h-[320px]`; titles wrap.
- `src/admin/components/DateRangePicker.tsx`: full-width trigger on mobile (`w-full sm:w-auto`), popover `align="start"` and `w-[calc(100vw-2rem)] sm:w-auto`.

### 2c. Per-page sweep
For each page below: convert KPI rows to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`, wrap tables in the shared scroll container, stack filter/search rows (`flex-col sm:flex-row gap-2`), make action buttons `w-full sm:w-auto`, and shrink section paddings.

- AdminDashboard, AdminUsers, AdminUserProfile
- AdminAIUsage, AdminAITokens, AdminAILive
- AdminRevenue, AdminSubscriptions, AdminInvoices, AdminCoupons
- AdminFlags, AdminAnnouncements, AdminPrompts, AdminWorkshops
- AdminBroadcasts
- ChatDashboard (`src/pages/admin/ChatDashboard.tsx`): on mobile show either the conversation list OR the chat window (toggle with back arrow), since the 320px sidebar + chat doesn't fit. Hide the stats row on `<sm`.
- AdminTickets, AdminFeedback
- AdminDatabase, AdminSystemHealth, AdminApiKeys, AdminAudit, AdminSettings

### 2d. Modals/dialogs
- Audit `ConfirmDialog`, any inline `Dialog` usages: `max-w-[calc(100vw-1.5rem)] sm:max-w-lg`, scrollable body (`max-h-[85vh] overflow-y-auto`).

## Out of scope
- No backend/edge-function changes.
- No design-token or theme changes.
- No new pages or features.
- No scholars/landing page work (already covered prior round).

## Files to edit
- `src/components/Footer.jsx`
- `src/admin/layout/AdminLayout.tsx`
- `src/admin/components/DataTable.tsx`, `KpiCard.tsx`, `ChartCard.tsx`, `DateRangePicker.tsx`, `ConfirmDialog.tsx`
- All `src/admin/pages/Admin*.tsx`
- `src/pages/admin/ChatDashboard.tsx`
