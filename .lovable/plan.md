# Plan: Rebuild Course Detail Page (AI for Professionals)

Full rewrite of `src/pages/CourseDetailPage.tsx` to match the 9 attached screenshots, section-by-section in Bangla. All content is hard-coded for the single `ai-for-professionals` course (also widening `Course` data shape in `src/data/academy.ts` where new fields are needed).

## Sections (top → bottom)

1. **Hero (dark blue grid bg)** — left: "ভর্তি হন এখনই" pill, big serif "AI for Professionals" title, Bangla tagline, two CTAs: "কোর্সে ভর্তি হোন →" (primary blue, scrolls to enroll card) and "📖 কারিকুলাম দেখুন" (outline, scrolls to curriculum). Right: rounded video placeholder card with play button overlay (uses existing course cover image; clicking play does nothing for now or opens a YouTube embed if URL provided).

2. **"এই সমস্যাগুলোর সাথে কি আপনি রিলেট করতে পারছেন?"** (light bg) — 2×2 grid of soft white cards, each with red ⚠ icon + Bangla problem text. Below: dark navy banner with the "এই কোর্সে আমরা ধাপে ধাপে…" reassurance text.

3. **"কোর্সে কী কী শিখতে পারবেন"** (dark bg) — 2×3 grid of dark glass cards, each with blue ▶ icon, Bangla/English title, and Bangla description (6 outcomes).

4. **"কোর্স সামারি" + "আপনি পাবেন"** (split: light card on left, dark card on right) — Left: Bangla summary paragraph + 2×2+1 grid of stat tiles (১৫ দিনের execution roadmap, ৫টি practical module, ১৫টি office use-case class, লাইফটাইম অ্যাক্সেস, সকল ডিভাইস সাপোর্ট with monitor icon). Right: 2×3 dark grid (লাইফটাইম এক্সেস, সার্টিফিকেট, কমিউনিটি এক্সেস, মেন্টর সাপোর্ট, প্রম্পট ই-বুক, কুইজ) each with ✓ icon, title, and Bangla description.

5. **"কোর্স কারিকুলাম"** (dark bg) — Centered title + pill "মোট ৬ টি মডিউল • ৪৩ টি ক্লাস". Vertical timeline (left circle numbers in Bangla numerals) with 6 accordion modules. Each closed row shows title + "X টি ক্লাস". Open module reveals lessons list with ▶ icons and Bangla numeral index. First module open by default. Module data: Foundation (5), AI in Writing (7), AI in Presentation & Graphics (13), AI in Research (6), AI in Data Analysis (6), AI in Personal Productivity (6) — total 43.

6. **"শিক্ষার্থীদের মন্তব্য"** (light heading band → dark section) — Mentor card with rounded photo (founder-rakib.jpg) on left, "আপনার মেন্টর" pill, name "Md. Rakibul Islam" (large serif), role "Founder, AI Sorix", and Bangla bio on right.

7. **"সচরাচর জিজ্ঞাসিত প্রশ্নাবলী"** (light bg) — Centered title, accordion FAQ list (reuse existing FAQs from data).

8. **"এখনই প্রিবুক করুন"** (light bg, large dark enroll card) — Title + Bangla subtitle. Card: left = checklist of 6 features. Right = strikethrough "৳৮৭০" + "০% ছাড়" red pill, large "৳ ৮৭০" price, promo code input + "প্রয়োগ করুন" blue button, big white "📖 এখনই প্রিবুক করুন →" CTA, "১০০% নিরাপদ পেমেন্ট ও ইনস্ট্যান্ট এক্সেস" footer. Yellow "⭐ বেস্ট ভ্যালু" badge top-right. CTA opens existing `ContactModal`.

## Button behavior
- Hero "কোর্সে ভর্তি হোন" → smooth-scroll to `#enroll` section.
- Hero "কারিকুলাম দেখুন" → smooth-scroll to `#curriculum`.
- Promo "প্রয়োগ করুন" → no-op visual (toast "শীঘ্রই আসছে" via sonner).
- "এখনই প্রিবুক করুন" → opens `ContactModal` with subject "Pre-book: AI for Professionals".
- Back link → `/sorixscholars/courses`.

## Files to change
- `src/pages/CourseDetailPage.tsx` — full rewrite.
- `src/data/academy.ts` — extend `ai-for-professionals` curriculum to the 6 modules / 43 lessons shown in screenshots; add `problems[]`, `learnings[]`, `summary`, `perks[]`, `stats[]` fields on the Course (optional, typed).
- No new assets; reuse `course-prompt.jpg` and `founder-rakib.jpg.asset.json`.

## Out of scope
- Real video playback (placeholder only).
- Real promo code / payment processing.
- Other pages.
