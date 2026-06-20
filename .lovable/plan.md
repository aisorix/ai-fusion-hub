## Goals

1. Every button on the Scholars home **and footer** does something useful.
2. AI Sorix and Sorix Scholars show the **same canonical office address** everywhere.
3. Inside Course / Workshop / Competition detail pages, the mentor card uses the founder image shown in the reference screenshot.

---

## 1. Canonical office address

Single source of truth — short, matching what the user provided:

- **EN:** `Uttara, Dhaka 1230, Bangladesh`
- **BN:** `উত্তরা, ঢাকা ১২৩০, বাংলাদেশ`
- Short label: `Uttara, Dhaka`

Create `src/lib/companyInfo.ts` exporting `OFFICE_ADDRESS_EN`, `OFFICE_ADDRESS_BN`, `OFFICE_SHORT`, `SUPPORT_EMAIL` (`support@aisorix.com`), `WHATSAPP_URL` (`https://wa.me/8801933554982`), and the social URL list.

Consume it from (replace any existing address text — including the old Aftabnagar string in scholars):

- `src/components/Footer.jsx`
- `src/components/ContactUs.jsx` (replace `"Uttara, Dhaka"` / `"ঢাকা"` + description)
- `src/pages/AboutUsPage.jsx` (`Registered Address` row)
- `src/components/scholars/ScholarsFooter.tsx`
- `src/components/scholars/sections/ScholarsContactCTA.tsx`

---

## 2. Scholars home buttons

| Button | Fix |
|---|---|
| Hero CTAs | already route, keep |
| `WhyScholars` play overlay (dead `<button>`) | scroll to `#upcoming-workshops` |
| `UpcomingWorkshops` "বিস্তারিত" | route to `/sorixscholars/workshops/${slug}` instead of list |
| `UpcomingWorkshops` "সব ওয়ার্কশপ দেখুন" | keep |
| `PopularCourses` buttons | keep |
| `ScholarsFAQ` accordion | keep |
| `ScholarsContactCTA` Live Chat / WhatsApp / Email | keep |
| Add `id="upcoming-workshops"` anchor on `UpcomingWorkshops` section | for the play-button scroll |

---

## 3. Scholars footer buttons (make every link work)

Audit `src/components/scholars/ScholarsFooter.tsx` and fix dead links:

- **Brand block:** wordmark stays English, link to `/sorixscholars`.
- **Quick links column:** `Home → /sorixscholars`, `Courses → /sorixscholars/courses`, `Workshops → /sorixscholars/workshops`, `Competitions → /sorixscholars/competitions`, `Certificates → /sorixscholars/certificates`.
- **Company column:** `About → /about`, `Careers → /careers`, `Contact → scroll to ScholarsContactCTA via `#contact` anchor (add the anchor in `ScholarsHome.tsx`)`, `AI Sorix → /`.
- **Legal column:** `Privacy → /privacy-policy`, `Terms → /terms`, `Refund → /refund-policy`, `Cookies → /cookie-policy` (use existing routes from `App.jsx`).
- **Social icons:** swap `#` placeholders for the real URLs from `companyInfo.ts` (Facebook, Instagram, YouTube, Twitter, LinkedIn) with `target="_blank" rel="noreferrer"` and aria-labels.
- **Support row:** email → `mailto:support@aisorix.com`, WhatsApp → `WHATSAPP_URL`, Live chat button → `openScholarsChat()` from `scholarsChatRef.ts`.
- **Address line:** pull from `companyInfo.ts` (bilingual via `useScholarsLang`).
- Verify every route exists in `src/App.jsx`; if a target page is missing, fall back to the closest existing page rather than leaving a 404.

---

## 4. Mentor card parity (Courses / Workshops / Competitions)

The screenshot shows the blue "Mentor" pill, **Rakib Eslam**, "Founder & CEO, AI Sorix Limited · Software Engineer", bio, and three pills — that's already what `MentorCard` (compact=false) renders, but the default avatar still points at the old `mentor-rakib.jpg`.

- `src/components/scholars/MentorCard.tsx` — switch default `avatarUrl` to `@/assets/founder-rakib.jpg.asset.json`.
- `CourseDetailPage.tsx`, `WorkshopDetailPage.tsx`, `CompetitionDetailPage.tsx` — no code change; they inherit the new default.
- Delete `src/assets/mentor-rakib.jpg.asset.json` via `assets--delete_asset` once unreferenced.

---

## Out of scope

Backend/RLS, course/workshop content rewrites, detail-page layout overhauls beyond the mentor block.

## Files touched

- New: `src/lib/companyInfo.ts`
- Edit: `Footer.jsx`, `ContactUs.jsx`, `AboutUsPage.jsx`, `ScholarsFooter.tsx`, `ScholarsContactCTA.tsx`, `ScholarsHome.tsx`
- Edit: `scholars/MentorCard.tsx`, `scholars/sections/WhyScholars.tsx`, `scholars/sections/UpcomingWorkshops.tsx`
- Delete: `src/assets/mentor-rakib.jpg.asset.json`
