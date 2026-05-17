## Goal

Three coordinated changes — keep navbar/footer in perfect sync and lift the older pages to the same professional UI/UX as the new info pages, without losing their existing content.

---

## 1. Solutions section — re-add legacy items with short titles

Add back the 7 legacy solution entries (already supported by `/solutions/:slug` in `SolutionsPage.jsx`) to **both** Navbar and Footer Solutions sections. Use short, clean labels — **no "AI for …" prefix**.

| Slug | Navbar/Footer label | Icon |
|---|---|---|
| `workflow-automation` | Workflow Automation | Workflow |
| `ai-for-educators` | Educators | GraduationCap |
| `ai-for-startups` | Startups | Rocket |
| `ai-for-researchers` | Researchers | FlaskConical |
| `ai-for-creators` | Creators | Palette |
| `ai-for-freelancers` | Freelancers | Briefcase |
| `ai-for-professionals` | Professionals | UserCheck |

Final Solutions list (15 items) in Navbar mega-menu (3 columns × 5 items) and Footer Solutions column:

Coding • Customer Support • Financial Services • Government • Healthcare • Life Sciences • Nonprofits • Security • Workflow Automation • Educators • Startups • Researchers • Creators • Freelancers • Professionals

Navbar dropdown widens to fit 3 columns (`minWidth: 780`).

---

## 2. Features section — add Multi-window Chat, unify Navbar ↔ Footer

Add **Multi-window Chat** (icon: `Columns3`, route: `/chat?multi=1` — Multi-Window already lives inside ChatPage) to the Features group.

Footer: **remove the standalone "Tools" column** and merge its 7 entries into the Features column. The Footer Features column then mirrors the Navbar Features mega-menu 1:1.

Final Features list (13 items, identical in Navbar and Footer):

AI Chat • Multi-window Chat • AI Agents • Sorix Agent OS • Sorix Deck • Sorix Imagine • Flow Builder • Sorix Health • Sorix Agro • Sorix Legends • Sorix Security • Sorix for Chrome • Skills

Navbar mega-menu renders as 2 columns × ~7 items.

---

## 3. Restyle old pages to match new InfoPage look

Refactor these legacy pages to wrap their existing content in the same hero + section + CTA shell used by `InfoPage.tsx` (gradient hero, eyebrow chip, glass cards, FAQ accordion, gradient CTA banner, JSON-LD schema, `SEOHead`). **Original copy is preserved verbatim**; only layout/shell changes. Each page gets 2–3 added SEO paragraphs focused on "AI Sorix + topic" keywords (no replacement of original content).

Pages to restyle:
- `BlogPage.jsx`
- `CaseStudiesPage.jsx`
- `DocsPage.jsx`
- `PressPage.jsx`
- `CareersPage.jsx`
- `PartnersPage.jsx`
- `DeveloperApiPage.jsx`
- `AboutUsPage.jsx`
- `AboutSorixLab.jsx`
- `SolutionsPage.jsx` (the dynamic `/solutions/:slug` legacy template)
- `Reviews.jsx`

Legal pages (`PrivacyPolicy`, `TermsOfService`, `CookiePolicy`, `RefundPolicy`) get the same hero + container shell but keep their dense legal body untouched.

Approach: extract a small reusable `<PageShell>` wrapper (hero + SEO + CTA banner) from `InfoPage.tsx` so existing JSX can be dropped inside without rewriting it. Each page keeps its original components and lists; we only swap the outer wrapper, add the gradient hero, and append the CTA banner + JSON-LD.

---

## Technical Details

**Files edited**
- `src/components/Navbar.jsx` — extend `megaMenus.products` (add Multi-window Chat), extend `megaMenus.solutions` to 3 columns × 5, widen dropdown `minWidth` to 780.
- `src/components/Footer.jsx` — delete Tools `<div>`, expand Features column to 13 items, expand Solutions column to 15 items, adjust grid (`xl:grid-cols-6`).
- `src/pages/SolutionsPage.jsx` — wrap existing content in new shell, keep `solutionsData` unchanged.
- `src/components/marketing/PageShell.tsx` — new: hero + SEO + CTA banner + JSON-LD, accepts `children` for existing page body.
- 10 legacy pages listed above — swap outer `<Navbar/Footer>` wrap for `<PageShell>` and feed their existing JSX as children.
- `public/sitemap.xml` — no changes (all routes already listed).

**Out of scope**
- No new routes (legacy `/solutions/:slug` already exists).
- No changes to existing page copy/lists/testimonials.
- No backend/database changes.
- Legal page body text is untouched.
