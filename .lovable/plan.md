## Goal
Make the Scholars sub-pages (Workshops, Competitions) match the home-page section design language — light background, centered Bangla heading in Playfair + Noto Serif Bengali, short subtitle, simple card grid. Drop the big "hero with badge + tagline" blocks. Use the same card visual treatment as `PopularCourses` / `UpcomingWorkshops` on the home page so the whole site feels consistent.

The Workshops page result should look exactly like the attached screenshot: heading "আমাদের ওয়ার্কশপসমূহ", 2-line Bangla subtitle, then a 2-column card grid.

## Changes

### 1. `src/pages/scholars/WorkshopsPage.tsx` — full rewrite
- Remove the gradient hero, badge ("Sorix Scholars · Workshops"), the Supabase fetch, loading skeletons, and empty state.
- Render only:
  - `SEOHead`
  - Centered heading **"আমাদের ওয়ার্কশপসমূহ"** (Playfair Display + Noto Serif Bengali, same sizing as `PopularCourses`)
  - Bangla subtitle (same copy as screenshot: "সরাসরি এক্সপার্টদের কাছ থেকে শিখুন। আমাদের প্র্যাক্টিক্যাল লাইভ ওয়ার্কশপগুলোতে জয়েন করে আপনার স্কিলকে নিয়ে যান নেক্সট লেভেলে।")
  - 2-column responsive grid (`sm:grid-cols-2`) of rounded-3xl cards with:
    - Cover banner image (16/10), red "লাইভ ওয়ার্কশপ" badge top-left, date pill + "রাত ৯ টা" time pill bottom-left
    - Body: `MapPin` + "Google Meet", Bangla title (Playfair/Noto Serif), 2-line description
    - Footer row: price ৳ value (with optional strikethrough old price in rose), "বিস্তারিত →" link to `/sorixscholars/workshops/${slug}`
- Static `WORKSHOPS` array (two items matching screenshot):
  1. `slug: "ai-private-batch-2month"` · ২ মাসের AI প্রাইভেট ব্যাচ · ৳5000 · 1 জুলাই – 31 আগস্ট
  2. `slug: "ai-smart-productivity-3day"` · ৩ দিনের AI লাইভ ওয়ার্কশপ · ৳470 (old ৳999) · 16,17,18 জুলাই
  - Both cover images use existing `founder-rakib.jpg` asset (banner-style images will be uploaded by user later).

### 2. `src/pages/CompetitionsPage.tsx` — full rewrite to match
- Remove gradient hero, badge, large headline, "why" 3-card grid.
- Render:
  - `SEOHead`
  - Centered heading **"আমাদের কম্পিটিশনসমূহ"** (Playfair + Noto Serif Bengali)
  - Bangla subtitle
  - 2-column grid of rounded-3xl cards using existing `competitions` data from `@/data/academy`. Each card: cover image with "প্রিমিয়াম"/status pill top-left, prize pill bottom-left, title, tagline, prize amount + "বিস্তারিত →".

### 3. Out of scope
- `ScholarsCertificates.tsx` — authenticated user dashboard, different purpose; leaving its layout alone.
- Workshop / competition detail pages — unchanged.
- No backend / data-source changes.
