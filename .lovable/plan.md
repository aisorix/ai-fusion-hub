# Sorix Scholars — Rebrand, Restructure & New Layout

## 1. Global Rename: "SorixLab Scholars" → "Sorix Scholars"

Search-and-replace across all user-facing strings:

- `src/components/Navbar.jsx` (mega-menu / link label)
- `src/components/Footer.jsx`
- `src/pages/AboutSorixLab.jsx` (the landing page, renamed in routes)
- `src/pages/CoursesPage.tsx`, `CourseDetailPage.tsx`
- `src/pages/CompetitionsPage.tsx`, `CompetitionDetailPage.tsx`
- `src/data/academy.ts` text references
- SEO `<title>` / meta / sitemap entries
- `public/sitemap.xml`, `public/llms.txt`
- Translations file `src/lib/translations.ts`

Keep internal identifiers (file names, slugs in `academy.ts`) unchanged to avoid breakage; only display strings change.

## 2. Route Restructure (nested under `/sorixscholars`)

New canonical URLs:

- `/sorixscholars` → Scholars landing (currently `/about-sorixlab` → rename component usage)
- `/sorixscholars/courses` → list (was `/courses`)
- `/sorixscholars/courses/:slug` → detail (was `/courses/:slug`)
- `/sorixscholars/competitions` → list
- `/sorixscholars/competitions/:slug` → detail
- `/sorixscholars/certificates` → **NEW** Certificate Collection page

Implementation in `src/App.jsx`: wrap these 5 routes in a parent `<Route element={<ScholarsLayout/>}>` block so they share the dedicated Scholars navbar/footer.

Backward compatibility: add `<Navigate>` redirects from old paths (`/about-sorixlab`, `/courses`, `/courses/:slug`, `/competitions`, `/competitions/:slug`) to the new `/sorixscholars/...` equivalents so existing links and the sitemap don't 404.

Update `scripts/generate-sitemap.ts` (or `public/sitemap.xml`) entries to the new URLs.

## 3. Dedicated Scholars Layout & Navbar

New files:

- `src/components/scholars/ScholarsLayout.tsx` — `<ScholarsNavbar/> <Outlet/> <ScholarsFooter/>`
- `src/components/scholars/ScholarsNavbar.tsx`
- `src/components/scholars/ScholarsFooter.tsx` (lighter variant; reuse main footer legal links)

Navbar spec (matches the uploaded video reference):

- Left: "Sorix Scholars" wordmark + small graduation-cap mark (Lucide `GraduationCap`)
- Center links: Home · Courses · Competitions · Certificates · Mentor
- Right: existing auth buttons (reuses `useAuth` — same login system; no separate auth)
- Sticky, translucent backdrop-blur, theme-aware tokens (no hardcoded colors)
- Mobile: hamburger sheet

Design parity with the project: Plus Jakarta Sans wordmark, `gap-1.5` between mark and text (per brand memory).

## 4. Scholars Landing Page (`/sorixscholars`)

Restructure `AboutSorixLab.jsx` into `src/pages/scholars/ScholarsHome.tsx` keeping the same visual sections shown in the video:

- Hero: "Sorix Scholars — Learn. Build. Get certified."
- Stat strip (learners, courses, competitions, certificates issued)
- Featured Courses grid (pulls from `academy.ts`)
- Competitions strip
- **Mentor section** — single highlighted mentor card:
  - Photo: upload provided image via Lovable Assets → `src/assets/mentor-rakib.jpg.asset.json`
  - Name: **Rakib Eslam**
  - Title: **Founder & CEO, AI Sorix Limited | Software Engineer**
  - Bio (~80 words): builder of the AI Sorix ecosystem, ships frontier multi-model AI products used worldwide; mentors learners on prompt engineering, AI agents, and shipping production AI features. Speaker at global AI meetups.
  - Tags: Frontier AI · Agents · Product
  - CTA: "Book a mentor session"
- Certificates teaser → links to `/sorixscholars/certificates`
- Final CTA band

Text content only — no layout change from existing AboutSorixLab.

## 5. Certificate Collection Page (NEW)

`src/pages/scholars/ScholarsCertificates.tsx`:

- Hero: "Your Certificate Collection"
- If unauthenticated → CTA to log in
- If authenticated → grid of earned certificates
- Empty state with EmptyState component: "Finish a course, competition or workshop to earn your first certificate" + browse links
- Each card: certificate title, source type badge (Course / Competition / Workshop), issued date, "View" + "Download PDF" buttons (PDF download stubbed via existing `exportUtils` jsPDF flow — generates a simple certificate with user name + course title; can be wired to real issuance later)
- Data source: new lightweight Supabase table `user_certificates (id, user_id, kind, title, source_slug, issued_at)` with RLS `user_id = auth.uid()` + standard GRANTs. No edge function needed (direct select). Migration includes the required `GRANT SELECT, INSERT ON public.user_certificates TO authenticated; GRANT ALL TO service_role;` block.

## 6. Sitemap, SEO, llms.txt

- Update `scripts/generate-sitemap.ts` entries to new `/sorixscholars/...` paths
- SEO `<title>` and meta on each Scholars page → "Sorix Scholars" branding
- `public/llms.txt` rename section

## 7. Memory Update

Add a project memory `mem://features/sorix-scholars` capturing:

- Brand name is **Sorix Scholars** (never "SorixLab")
- All Scholars routes live under `/sorixscholars/*`
- Dedicated `ScholarsLayout` with its own navbar/footer
- Reuses main auth (`useAuth`) — no separate login
  Update `mem://index.md` to reference it.

## Files

**New**

- `src/components/scholars/ScholarsLayout.tsx`
- `src/components/scholars/ScholarsNavbar.tsx`
- `src/components/scholars/ScholarsFooter.tsx`
- `src/pages/scholars/ScholarsHome.tsx`
- `src/pages/scholars/ScholarsCertificates.tsx`
- `src/assets/mentor-rakib.jpg.asset.json` (from uploaded photo via lovable-assets)
- `supabase/migrations/<ts>_user_certificates.sql`

**Edited**

- `src/App.jsx` (nested routes + redirects)
- `src/components/Navbar.jsx`, `Footer.jsx` (rename + link to `/sorixscholars`)
- `src/pages/CoursesPage.tsx`, `CourseDetailPage.tsx`, `CompetitionsPage.tsx`, `CompetitionDetailPage.tsx` (rename strings, link bases now `/sorixscholars/...`)
- `src/data/academy.ts` (display copy)
- `src/lib/translations.ts`
- `scripts/generate-sitemap.ts`, `public/llms.txt`
- `mem://index.md` + new memory file

**No removals.** Old paths kept as redirects.

## Out of scope

- Real certificate issuance pipeline (stubbed PDF + manual rows)
- New auth flow (Scholars uses existing login)
- Visual redesign of cards (kept identical to current Courses/Competitions UI)
