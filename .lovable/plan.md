# Sorix Scholars — AI Shikhun-style Redesign

Rebuild the Sorix Scholars home page and Scholars navbar as a pixel-faithful clone of the 10 attached reference screenshots. Content is rewritten for the AI Sorix / Sorix Scholars ecosystem; every course/workshop thumbnail uses the existing founder image (`src/assets/founder-rakib.png.asset.json`). Scholars area defaults to Bangla with a working EN/BN toggle scoped to Scholars.

## Sections to build (in order, matching reference)

1. **Hero (IMG_3083)** — pill badge, two-line serif display headline with second line in primary blue, sub-paragraph, 3 chip pills (Workshop / Course / Mentorship), primary dark CTA + white outline CTA, learner-count + 4.9★ rating chip. Soft grid background.
2. **"Why Sorix Scholars for you?" split (IMG_3084)** — left: heading w/ brand word highlighted, 2 paragraphs, 2×2 check-list (1:1 AI Mentorship / Online Courses / Live Workshops / eBooks & Resources). Right: rounded video/poster card with play button.
3. **"Why learn AI?" comparison (IMG_3085)** — two large rounded cards side-by-side. Left red-tinted "What you lose if you don't learn AI" with 4 ✕ items. Right green-tinted "What you gain by learning AI" with 4 ✓ items.
4. **"What we do" 2×2 grid (IMG_3086)** — cream background section, 4 numbered cards (০১–০৪) with icon chip, title, paragraph, "বিস্তারিত দেখুন →" link, big faded numeral watermark.
5. **Popular courses (IMG_3087)** — section header + single featured course card: left thumbnail uses **founder image** with "প্রিমিয়াম" pill + "৬ মডিউল" footer pill; right side title "AI for Professionals", body, price ৳৮৭০, "বিস্তারিত" pill button. Dark "সব কোর্স দেখুন →" pill below.
6. **Upcoming workshops (IMG_3088)** — full-bleed dark/violet section. Workshop card: left thumbnail uses **founder image** with "লাইভ ওয়ার্কশপ" red pill + Batch/date/time pills; right: Google Meet location, title, body, ৳৪৭০ ~~৳৯৯৯~~, "বিস্তারিত" pill. Red rounded "সব ওয়ার্কশপ দেখুন →" CTA.
7. **Testimonials (IMG_3089)** — heading + 5★ + "৫০০+ হ্যাপি লার্নারস". Horizontal scrolling row of white quote cards (5★ top-left, quote-mark badge top-right, italic Bangla/English quote, avatar initial + name + location). Peek edges on both sides.
8. **FAQ (IMG_3090)** — centered heading with "(FAQ)" in primary, sub-paragraph, single rounded container with 5 accordion rows.
9. **Contact CTA (IMG_3091)** — dark navy rounded panel: left support badge, headline w/ 2nd line in primary, paragraph, blue "হোয়াটসঅ্যাপে মেসেজ" CTA; right two stacked cards (Hotline +880 01933-554982 / Social: Facebook + YouTube) and Office address card.
10. **Footer (IMG_3092)** — replaces current `ScholarsFooter`. 3-column: brand logo + description + 3 social icons / গুরুত্বপূর্ণ লিংক / আইনি ও যোগাযোগ with location row.

## Files

**Edit**
- `src/components/scholars/ScholarsNavbar.tsx` — Bangla default labels, EN/BN toggle button (sun/globe-style), mobile sheet menu.
- `src/components/scholars/ScholarsFooter.tsx` — replaced with IMG_3092 layout.
- `src/components/scholars/ScholarsLayout.tsx` — wrap in `ScholarsI18nProvider`.
- `src/pages/scholars/ScholarsHome.tsx` — full rewrite into 10 sections above using new components.
- `src/data/academy.ts` — swap course/workshop `cover` to `founderAsset.url` for entries shown on home.

**Create**
- `src/contexts/ScholarsI18nContext.tsx` — `lang: 'bn' | 'en'`, default `'bn'`, persisted in `localStorage` (`scholars_lang`), `t(bn, en)` helper. Scoped to Scholars only; does NOT affect global `LanguageContext`.
- `src/components/scholars/sections/ScholarsHero.tsx`
- `src/components/scholars/sections/WhyScholars.tsx`
- `src/components/scholars/sections/WhyLearnAI.tsx`
- `src/components/scholars/sections/WhatWeDo.tsx`
- `src/components/scholars/sections/PopularCourses.tsx`
- `src/components/scholars/sections/UpcomingWorkshops.tsx`
- `src/components/scholars/sections/ScholarsTestimonials.tsx`
- `src/components/scholars/sections/ScholarsFAQ.tsx`
- `src/components/scholars/sections/ScholarsContactCTA.tsx`
- `src/components/scholars/LangToggle.tsx`

## Design tokens (locked, applied via Tailwind utilities + arbitrary HSL)

- Display serif (headings): `"Playfair Display", "Noto Serif Bengali", serif` via Google Fonts `<link>` already-loaded check; load in `index.html` if missing.
- Body: existing Plus Jakarta Sans + Noto Sans Bengali fallback.
- Primary brand blue (matches reference): `#1B2A6B` (dark navy) and `#1E3A8A` accent. Mapped through existing `--primary` token where possible; section-local arbitrary colors only when a token doesn't fit.
- Cream/paper background for "What we do": `#FAF7EE`.
- Workshop dark section: `#0B0413 → #1A0526` radial.
- Use existing `text-foreground / text-primary / bg-card / border-border` tokens for all neutral surfaces. No hard-coded `text-white` / `bg-black`.

## Content rewrites (BN default / EN alt)

- Brand: "AI Shikhun" → "Sorix Scholars" (or "AI Sorix" where the reference says "platform").
- Hotline / address / socials: keep AI Sorix global Dhaka HQ values already used in current `ScholarsFooter` / contact page (no new info invented).
- Price chips on course/workshop cards: keep the existing prices from `src/data/academy.ts`; do not invent.
- All Bangla copy follows reference tone; English fallback provided in `t()`.

## Responsive / mobile + tablet rules

- Mobile (`<640px`): single column for every grid; hero headline `text-3xl`, paragraph `text-sm`; horizontal scrollers (testimonials, course/workshop cards if >1) use `snap-x snap-mandatory overflow-x-auto -mx-4 px-4`; comparison cards stack; contact panel stacks; nav collapses into Sheet drawer with EN/BN toggle + links.
- Tablet (`640–1024px`): 2-col grids where reference shows 2-col; hero stays centered single column; "What we do" 2-col; FAQ container full width with `max-w-2xl`.
- Desktop (`≥1024px`): matches screenshots exactly.
- Bangla width rule from project memory: `whitespace-nowrap` only on short pill chips; otherwise allow wrap with `leading-snug`; chips use `min-w-0 truncate` where needed.

## Language toggle behavior

- `LangToggle` shows current language code (`BN` / `EN`) inside a small pill; click flips.
- Persisted in `localStorage`. Default `bn` on first visit to any `/sorixscholars/*` route.
- Only Scholars pages consume `useScholarsLang()`; global app language untouched.
- Navbar links, all 10 home sections, and footer all read through `t(bn, en)`.

## Out of scope

- No backend, RLS, or edge-function changes.
- No changes to course/workshop detail pages, certificates, or admin (handled in earlier rounds).
- No changes to the marketing site navbar/footer outside `/sorixscholars/*`.
- Pricing values, hotline number, and office address are reused from existing data — not invented.
