## Scope

Continuation round: three small UI fixes the user just asked for, plus the five remaining items from last round.

---

### 1. AboutSorixLab — remove team images
`src/pages/AboutSorixLab.jsx`: remove the founder + supporting-developer photo cards added previously. Keep all other content intact (text-only About page).

### 2. "Built by SorixLab" CTA → `/about-sorix-lab`
- `src/components/AnnouncementBanner.jsx`: change `<Link to="/sorixscholars">` to `to="/about-sorix-lab"`.
- Sweep `Hero.jsx`, `Footer.jsx`, `Navbar.jsx` for any other "Built by SorixLab" link and repoint to `/about-sorix-lab`.

### 3. Solutions menu reorder (Navbar + Footer)
New order in `src/components/Navbar.jsx` Solutions dropdown and `src/components/Footer.jsx` Solutions column:

1. Workflow Automation
2. Professional Services
3. Professionals
4. Educators
5. Startups
6. Researchers
7. Creators
8. Freelancers
9. Then existing rest: Customer Support, Coding, Healthcare, Financial, Government, Life Sciences, Nonprofits, Security

If Educators / Startups / Researchers / Creators / Freelancers aren't already Solutions entries, add them as links to existing `/solutions` (anchor or page) — confirmed on file read first.

---

### 4. Footer Features/Solutions reorder (clean rewrite)
Last attempt failed due to ellipsis match. Rewrite the Features + Solutions columns of `src/components/Footer.jsx` to mirror the navbar order exactly:
- **Features**: Sorix Agent, Cineshoot, Sorix Health, Sorix Agro, Sorix Imagine, AI Chat, Multi-Chat, Sorix Deck, FlowBuilder, Legends, Code.
- **Solutions**: order from item 3 above.

### 5. Scholars pages mobile-polish pass
- `src/components/scholars/ScholarsNavbar.tsx`: add mobile sheet/burger menu, stack actions.
- `src/components/scholars/ScholarsFooter.tsx`: `grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`, smaller paddings on `<sm`.
- `src/pages/scholars/ScholarsHome.tsx`: reduce hero font on `<sm`, stack CTA, fix card grids to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`, `px-4 sm:px-6`.
- `CoursesPage`, `CompetitionsPage`, `WorkshopsPage`, `ScholarsCertificates`: same grid/padding pass + `overflow-x-auto` on any tables.

### 6. Admin contrast sweep (remaining pages)
Audit `src/admin/pages/AdminPrompts.tsx` and `AdminAnnouncements.tsx` for raw `<input>`/`<textarea>`/`<select>` with dark bg and no `text-foreground`. Replace with shadcn `Input`/`Textarea`/`Select`, or add `bg-background text-foreground border-border` explicitly so both themes are legible.

### 7. Global DateRangePicker wiring
Wire `useAdminRange()` (from `AdminRangeContext`) into:
- `AdminRevenue.tsx`
- `AdminSubscriptions.tsx`
- `AdminAIUsage.tsx`
- `AdminAITokens.tsx`
- `AdminFeedback.tsx`
- `AdminInvoices.tsx`
- `AdminTickets.tsx`

Each page reads `{ from, to }` from context, passes it to its data fetch/edge function body, and re-queries when the range changes. No new UI — picker already lives in `AdminLayout` topbar.

### 8. Admin traffic accuracy follow-up
In `supabase/functions/admin-traffic-overview/index.ts`:
- Honour `range` param everywhere (some queries still ignore it).
- Visitors = `count(distinct session_id)` from `page_views` in range.
- Page views = `count(*)` from `page_views` in range.
- Unique users = `count(distinct user_id) where user_id is not null` in range.
- Top pages = group by `path` in range, order by count desc, limit 10.
- Geographic = group by `country` in range (drop any hard-coded sample data).
- Bounce/sessions derived from real `session_id` grouping, not estimates.

Mirror the same fixes in `admin-dashboard-overview/index.ts` KPI block.

---

### Files edited
- `src/pages/AboutSorixLab.jsx`
- `src/components/AnnouncementBanner.jsx`, `Hero.jsx` (if applicable)
- `src/components/Navbar.jsx`, `src/components/Footer.jsx`
- `src/components/scholars/ScholarsNavbar.tsx`, `ScholarsFooter.tsx`
- `src/pages/scholars/ScholarsHome.tsx`, `CoursesPage.tsx`, `CompetitionsPage.tsx`, `WorkshopsPage.tsx`, `ScholarsCertificates.tsx`
- `src/admin/pages/AdminPrompts.tsx`, `AdminAnnouncements.tsx`
- `src/admin/pages/AdminRevenue.tsx`, `AdminSubscriptions.tsx`, `AdminAIUsage.tsx`, `AdminAITokens.tsx`, `AdminFeedback.tsx`, `AdminInvoices.tsx`, `AdminTickets.tsx`
- `supabase/functions/admin-traffic-overview/index.ts`, `admin-dashboard-overview/index.ts`

### Out of scope
- No DB migrations, no new pages, no design-token changes.
- No new payment/buy flows.
