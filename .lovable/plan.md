## Goal
Rebuild `/sorixscholars/courses` so it shows **only** the heading "আমাদের কোর্সসমূহ", a short subtitle, and **one** sample course card — "AI for Professionals" (৳870, 6 মডিউল, Premium badge) — exactly like the screenshot. Remove every other section and every other course from this page.

## Changes

### 1. `src/data/academy.ts`
- Replace the `courses` array with a single entry:
  - `slug: "ai-for-professionals"`
  - `title: "AI for Professionals"`
  - `tagline: "অফিসের real কাজ মাথায় রেখে তৈরি practical masterclass — Email, report, presentation, research…"`
  - `level: "Intermediate"`
  - `duration: "6 মডিউল"`
  - `priceLabel: "৳870"`
  - `cover`: existing `course-prompt.jpg` placeholder (kept for now — banner will be updated when the user uploads the AI for Professionals banner)
  - Full `overview`, `outcomes`, 6-module `curriculum`, `instructor` (Md. Rakibul Islam — founder), `faqs`
- Remove all other course imports/objects. Keep `competitions` untouched (used elsewhere).

### 2. `src/pages/CoursesPage.tsx`
Rewrite the page to render only:
- `SEOHead`
- Centered heading **"আমাদের কোর্সসমূহ"** (Playfair + Noto Serif Bengali, same as `PopularCourses`)
- Bangla subtitle paragraph
- A single course card (same visual style as `PopularCourses` — rounded-3xl, cover image, "প্রিমিয়াম" badge top-left, "6 মডিউল" pill bottom-left, title, tagline, price ৳870, "বিস্তারিত →" link to `/sorixscholars/courses/ai-for-professionals`)
- Card is centered (`max-w-sm mx-auto`) so the layout matches the screenshot

Remove: hero section, stats strip, "Why learn AI" comparison, offerings bento, competitions banner, promises, final CTA, and the multi-course grid.

### 3. `src/components/scholars/sections/PopularCourses.tsx`
Update `featured` to `courses.slice(0, 1)` so the home page also shows only the single available course (avoids empty cards).

## Out of scope
- Course detail page (`/sorixscholars/courses/ai-for-professionals`) keeps current layout; only its data changes via `academy.ts`.
- No changes to competitions, workshops, footer, or any other page.
- Cover image swap to the actual "AI for Professionals" banner will require the user to upload the banner asset — current image remains as placeholder.
