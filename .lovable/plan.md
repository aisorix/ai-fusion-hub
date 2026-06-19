# Sorix Scholars polish pass

Scope is presentation-only. No backend, data-shape, or RLS changes.

## 1. Founder image — used only in banner slots, not as course thumbnails

The user-uploaded photo (`IMG_2900.jpeg`) is the real founder photo and should replace the previous `founder-rakib.png`. It is shown ONLY in dedicated banner spots — never repeated across every course/workshop card.

Actions:
- Upload `IMG_2900.jpeg` to Lovable Assets at `src/assets/founder-rakib.png.asset.json` (overwrite the existing pointer).
- `PopularCourses.tsx`: stop using `founderAsset.url` for every card. Use each course's existing `cover` (the original course illustrations in `src/data/academy.ts`: `course-prompt.jpg`, `course-agents.jpg`, `course-pm.jpg`, …) as the card thumbnail. No founder image on the popular-courses grid.
- `UpcomingWorkshops.tsx`: keep ONE workshop only (the existing "3-day live AI workshop") and keep the founder image as that single workshop banner (this is the "workshop banner — founder image only here" case). No other workshop card uses the founder image.
- Anywhere else the founder image is currently being used as a generic thumbnail (course detail covers, certificates page, etc.) is left untouched — they already use proper course covers.

## 2. Support / Contact CTA aligned with AI Sorix

Rebuild `ScholarsContactCTA.tsx` so it mirrors the main `aisorix.com` support pattern:

- Primary contact tile: support email — `support@aisorix.com` (mailto). This replaces the current Hotline-only block.
- Secondary tile: WhatsApp button (`https://wa.me/8801933554982`) — keep.
- New tile: "Live chat" button that triggers the same `ChatWidget` used on the AI Sorix marketing site. Mount `ChatWidget` inside `ScholarsLayout.tsx` and expose a small wrapper hook/ref so the CTA button can call `openChat()`. This gives Scholars the exact same live-chat experience as aisorix.com.
- Social media tile: replace placeholder `#` hrefs with the canonical AI Sorix links from `src/components/Footer.jsx` (`socialLinks`): Facebook, Instagram, YouTube, Twitter, LinkedIn — same icons, same URLs.
- Office address tile: use the same address string already used in the main Footer (Aftabnagar, Dhaka block) — already matches, keep as-is.

`ScholarsFooter.tsx` social row + address get the same treatment (real AI Sorix Facebook/Instagram/YouTube/Twitter/LinkedIn URLs).

## 3. Testimonials — expand and present "100+"

In `ScholarsTestimonials.tsx`:

- Grow the `reviews` array from 5 to ~14 realistic learner stories (mix of Dhaka, Chittagong, Sylhet, Mumbai, London, New York, Dubai, Toronto, Berlin, Singapore — names + cities + bilingual quotes describing concrete wins: automation saved hours, freelancing income, job switch, university research, etc.).
- Header chip changes from "৫০০+ হ্যাপি লার্নারস / 500+ happy learners" to "১০০+ লার্নার স্টোরি / 100+ learner stories" to match the request.
- Keep the existing snap-x horizontal scroller layout; it scales cleanly to 14 cards on every breakpoint.
- The Footer "Learner stories" link already targets `#testimonials` — no routing change needed.

## 4. Logo wordmark always in English

In `ScholarsNavbar.tsx` and `ScholarsFooter.tsx`, the brand text next to the graduation-cap mark is currently `t("সোরিক্স স্কলারস", "Sorix Scholars")`. Hard-code it to `Sorix Scholars` (English) regardless of language selection. The rest of the nav/footer copy stays bilingual.

Also: the copyright line in the footer's bottom bar uses the same wordmark — switch it to the English string too.

## 5. Files touched

- `src/assets/founder-rakib.png.asset.json` — overwrite via `lovable-assets` from the uploaded image
- `src/components/scholars/sections/PopularCourses.tsx` — use `c.cover`, drop founder import
- `src/components/scholars/sections/UpcomingWorkshops.tsx` — keep founder banner for the single workshop
- `src/components/scholars/sections/ScholarsTestimonials.tsx` — 14 entries, updated count chip
- `src/components/scholars/sections/ScholarsContactCTA.tsx` — email + WhatsApp + live-chat + real socials
- `src/components/scholars/ScholarsLayout.tsx` — mount `ChatWidget` + ref context
- `src/components/scholars/ScholarsNavbar.tsx` — English wordmark
- `src/components/scholars/ScholarsFooter.tsx` — English wordmark, real social URLs

## Out of scope

- Course detail pages, certificates page, workshops listing page styling
- Any change to `src/data/academy.ts` content (only consumed differently)
- Live-chat backend / `useChat` hook — reused as-is
- Admin / main site pages
