# AI Sorix Academy — Courses Hub Rebuild

Inspired by the reference layout (hero → why-now → what-we-offer 2×2 grid → catalog → footer CTA), but rewritten with original copy, AI Sorix design tokens, and a more polished, modern execution. No regional references, English-first with existing i18n hooks.

## Scope

**Fully functional pages** (real routes, content, working CTAs):
1. `/courses` — Academy hub (catalog + 4-pillar overview)
2. `/courses/:slug` — Course detail (curriculum, outcomes, instructor, enroll form)
3. `/competitions` — Competitions hub (AI Competition + Startup Funding tracks)
4. `/competitions/ai-challenge` — AI Competition detail (rules, prize pool, timeline, apply form)
5. `/competitions/startup-funding` — Startup Funding Competition detail (criteria, pitch deck upload prompt, apply form)

**Surfaced as "Coming soon" cards on the hub** (no dedicated routes yet, per user):
- Mentorship 1:1
- eBooks & Resources
- Live Workshops

**Forms**: all enroll / apply / contact submissions go through a new edge function `academy-contact` that emails `support@aisorix.com` via Lovable Email (no DB tables).

**Payments**: paid courses show price + "Contact to Enroll" / "Coming soon" — no checkout wired.

## Hero change (landing page)

Add a new **SorixLab Project** button to the left of "Start Free Trial" and "View Pricing" in `src/components/Hero.jsx`. Same pill style as the secondary CTA, distinct accent (outline + sparkle icon), routes to `/courses`.

```text
[ ⚡ SorixLab Project ]  [ ▸ Start Free Trial ]  [ ▶ View Pricing ]
```

On mobile, stacks vertically with SorixLab on top.

## Page architecture (`/courses`)

```text
┌──────────────────────────────────────────────────┐
│  HERO                                            │
│  Eyebrow: "SorixLab Project · AI Sorix Academy"  │
│  H1:  "Master frontier AI. Build what's next."   │
│  Sub:  one-sentence value prop                   │
│  CTAs: [Browse Courses] [Join a Competition]     │
│  Stat strip: 4 metrics (Learners · Hours ·       │
│              Projects shipped · Countries)       │
├──────────────────────────────────────────────────┤
│  WHY LEARN AI NOW   (two-column comparison)      │
│  ✗ Falling behind   │   ✓ Compounding advantage  │
│  4 bullets each, ai-sorix red/green tokens       │
├──────────────────────────────────────────────────┤
│  WHAT WE OFFER  (2×2 bento grid)                 │
│  01 Courses (active)     02 Competitions (active)│
│  03 Mentorship (soon)    04 eBooks (soon)        │
│  Each card → link or "Coming soon" badge         │
├──────────────────────────────────────────────────┤
│  FEATURED COURSES  (responsive grid)             │
│  6 course cards (image, level chip, title, desc, │
│  duration, price, "View course" → /courses/slug) │
├──────────────────────────────────────────────────┤
│  COMPETITIONS BANNER  (split-screen)             │
│  Left: AI Challenge   Right: Startup Funding     │
│  Each → respective competition detail page       │
├──────────────────────────────────────────────────┤
│  INSTRUCTOR-LED PROMISE (3 trust pillars)        │
├──────────────────────────────────────────────────┤
│  FINAL CTA — "Start with one course this week"   │
└──────────────────────────────────────────────────┘
```

## Course detail (`/courses/:slug`)

- Sticky right rail: price card, duration, level, "Enroll / Contact" button → opens modal with name + email + message
- Left: hero image, eyebrow, title, overview, **What you'll learn** (8 bullets), **Curriculum** (accordion of modules), **Instructor** (avatar, bio), **Outcomes**, FAQ
- Bottom: related courses

## Competition detail pages

- Hero with prize amount, deadline countdown chip, eligibility
- Sections: Tracks, Judging criteria, Timeline (numbered steps), Prizes, Rules, FAQ
- Bottom: Apply form modal (name, email, project name, short pitch, optional URL) → `academy-contact` with `type: "competition"`

## Data model (in-code, not DB)

`src/data/academy.ts` — typed arrays for `courses`, `competitions`. Easy for the user to edit later. 6 original course entries spanning beginner → advanced (e.g., "Prompt Engineering Foundations", "Build AI Agents with Sorix Agent", "AI for Product Managers", "Computer Vision for Builders", "AI for Researchers & Writers", "LLM Ops & Evaluation").

## Edge function

`supabase/functions/academy-contact/index.ts`
- POST `{ type: "enroll" | "competition" | "general", payload: {...} }`
- Validates with Zod, rate-limits per IP (in-memory), sends via Lovable Email queue to `support@aisorix.com`
- Returns `{ ok: true }`; client toasts via Sonner

Requires email domain check first (`email_domain--check_email_domain_status`); if not configured, surface the domain setup dialog before proceeding.

## Navigation wiring

- `Resources → Courses` in Navbar already points to `/courses` ✔
- Add `/competitions` to Navbar Resources mega-menu (Competitions · NEW badge)
- Update `public/sitemap.xml`: add `/courses`, `/courses/:slug` (top 6), `/competitions`, `/competitions/ai-challenge`, `/competitions/startup-funding`
- Add SEO via existing `SEOHead` on every new page

## Files

**New**
- `src/pages/CoursesPage.tsx` (full rewrite — replace existing InfoPage stub)
- `src/pages/CourseDetailPage.tsx`
- `src/pages/CompetitionsPage.tsx`
- `src/pages/CompetitionDetailPage.tsx`
- `src/components/academy/AcademyHero.tsx`
- `src/components/academy/WhyLearnNow.tsx`
- `src/components/academy/OfferingsGrid.tsx`
- `src/components/academy/CourseCard.tsx`
- `src/components/academy/EnrollModal.tsx`
- `src/components/academy/CompetitionCard.tsx`
- `src/components/academy/ApplyModal.tsx`
- `src/data/academy.ts`
- `supabase/functions/academy-contact/index.ts`

**Edited**
- `src/components/Hero.jsx` — add SorixLab Project button
- `src/App.jsx` — register 4 new routes (lazy)
- `src/components/Navbar.jsx` — add Competitions entry in Resources
- `public/sitemap.xml` — new URLs

## Design notes

- Use existing semantic tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`). No raw colors.
- Bento `OfferingsGrid` uses subtle gradient borders matching the brand cyan-teal direction already used by Sorix Agent.
- Course cards: `rounded-2xl`, image 16:9, level chip (`bg-primary/10 text-primary`), price right-aligned, hover lift.
- Animations via existing `framer-motion` patterns used in `PageHero` (no new deps).

## Copy guidelines

All content original — written professionally for a global audience, no copy/paste from the reference. Bangla translations via existing `t()` keys added to `src/lib/translations.ts` for the new strings so the BN toggle keeps working.

## Out of scope

- Database tables (per user: forms → email only)
- Payment checkout (per user: Coming soon / Contact)
- Mentorship and eBook detail pages (per user: not provided yet — shown as "Coming soon" cards on hub)