
## Goal

Add a full set of new marketing/info pages, wire them into the Navbar mega-menus and Footer (legal-only group goes to Footer), and make every page SEO-perfect (unique title/description/canonical/OG, JSON-LD schema, semantic H1/H2, AI-Sorix-branded copy targeting "AI Sorix" + the topic).

## New Pages to Create

All pages use a shared structure: `Navbar` + `SEOHead` + JSON-LD + Hero + 3-5 content sections + CTA + `Footer`. Bilingual-friendly copy (EN primary, professional tone).

### Features group (3 pages)
1. `/sorix-security` — `SorixSecurityPage.tsx` — Zero-trust architecture, encryption at rest/transit, RLS, SOC 2 roadmap, data residency.
2. `/sorix-for-chrome` — `SorixForChromePage.tsx` — Chrome extension overview (Coming Soon CTA + waitlist), use-cases (summarize tab, ask any page, generate replies).
3. `/skills` — `SkillsPage.tsx` — Reusable AI Skills marketplace (writing, coding, research, design); how to install/run.

### Solutions group (8 pages — exact names, no "AI for" prefix)
Path pattern: `/solutions/{slug}` (extends existing `SolutionsPage.jsx` route, but we'll create distinct pages so SEO is hand-tuned).
4. `/solutions/coding` — `SolutionCoding.tsx`
5. `/solutions/customer-support` — `SolutionCustomerSupport.tsx`
6. `/solutions/financial-services` — `SolutionFinancial.tsx`
7. `/solutions/government` — `SolutionGovernment.tsx`
8. `/solutions/healthcare` — `SolutionHealthcare.tsx`
9. `/solutions/life-sciences` — `SolutionLifeSciences.tsx`
10. `/solutions/nonprofits` — `SolutionNonprofits.tsx`
11. `/solutions/security` — `SolutionSecurity.tsx`

Each: industry pain points → AI Sorix capabilities → workflow examples → ROI stats → CTA.

### Resources group (5 pages)
12. `/connectors` — `ConnectorsPage.tsx` — List of supported app integrations (Google Workspace, Slack, GitHub, Notion, Stripe, etc.) with "request a connector" form.
13. `/courses` — `CoursesPage.tsx` — AI Sorix Academy: free + paid courses (Prompt Engineering, Agent Building, FlowBuilder mastery).
14. `/events` — `EventsPage.tsx` — Webinars, hackathons, community meetups; calendar grid.
15. `/inside-sorix-code` — `InsideSorixCodePage.tsx` — Deep-dive into AI Sorix coding tool (architecture, capabilities, demos).
16. `/inside-sorix-cowork` — `InsideSorixCoworkPage.tsx` — Deep-dive into Sorix Agent / Cowork workspace.

### Company group (4 pages)
17. `/economic-futures` — `EconomicFuturesPage.tsx` — AI Sorix's research on AI's economic impact, jobs, opportunity.
18. `/research` — `ResearchPage.tsx` — Published papers, model evaluations, AI safety work.
19. `/security-and-compliance` — `SecurityCompliancePage.tsx` — SOC 2, GDPR, HIPAA roadmap, sub-processors, DPA.
20. `/transparency` — `TransparencyPage.tsx` — Model usage disclosures, training data principles, content policy.

### Legal (footer-only — 2 pages)
21. `/consumer-health-data-privacy` — `ConsumerHealthPrivacyPage.tsx`
22. `/usage-policy` — `UsagePolicyPage.tsx`

## Navbar Mega-Menu Updates (`src/components/Navbar.jsx`)

Extend `megaMenus`:
- **Features** column 2: append `Sorix Security`, `Sorix for Chrome`, `Skills`.
- **Solutions**: replace existing items with the 8 new industry items (Coding, Customer Support, Financial Services, Government, Healthcare, Life Sciences, Nonprofits, Security). Use 2-column layout (4 each). Keep existing icon library (Code2, Headphones, Landmark, Building2, HeartPulse, FlaskConical, HandHeart, ShieldCheck).
- **Resources** column 2: append `Connectors`, `Courses`, `Events`, `Inside Sorix Code`, `Inside Sorix Cowork`. Keep existing Blog/Case Studies/Docs/Developer API/Community/FAQs.
- **Company** column 2: append `Economic Futures`, `Research`, `Security & Compliance`, `Transparency`.

Mobile menu uses the same `megaMenus` source, so it updates automatically.

## Footer Updates (`src/components/Footer.jsx`)

- **Solutions column**: replace 6 existing items with the 8 new industry links.
- **Resources column**: append Connectors, Courses, Events, Inside Sorix Code, Inside Sorix Cowork.
- **Company column**: append Economic Futures, Research, Security & Compliance, Transparency.
- **Features column** (new or fold into existing Product column): add Sorix Security, Sorix for Chrome, Skills.
- **Legal column**: append `Consumer Health Data Privacy Policy` and `Usage Policy`.
- Adjust grid (currently 8 cols xl) so columns don't overflow — use a 2-row layout on xl, or expand to a clean 6-col + brand row.

## Routing (`src/App.jsx`)

Add `React.lazy` imports + `<Route>` entries for all 22 new pages. The `/solutions/:slug` dynamic route stays for backward compat but specific routes above take precedence (declared before the dynamic one).

## SEO Pattern (every new page)

```tsx
<SEOHead
  title="{Topic} | AI Sorix — {value prop}"
  description="{160-char professional copy mentioning AI Sorix + topic + benefits}"
  path="/{slug}"
/>
<script type="application/ld+json">{JSON.stringify({
  "@context":"https://schema.org",
  "@type":"WebPage" | "Article" | "Service",
  "name":"...",
  "url":"https://www.aisorix.com/{slug}",
  "publisher":{"@type":"Organization","name":"AI Sorix","url":"https://www.aisorix.com"},
  "about":"{topic}"
})}</script>
```

Plus: semantic `<h1>` with topic + "AI Sorix", `<h2>` subsections, FAQPage schema where relevant (Solutions + Resources), BreadcrumbList schema, internal links to /chat, /agent, /pricing.

Update `public/sitemap.xml` to include all 22 new URLs.

## Visual / UX

All pages reuse the existing dark-theme design tokens, glass cards, gradient accents, and Plus Jakarta Sans branding from current pages (`AboutUsPage`, `BlogPage`). Each page includes:
- Hero with gradient headline + subheading + 2 CTAs (Try Free / Learn More)
- Feature grid (3-6 cards with `lucide-react` icons)
- Detailed sections with screenshots/illustrations placeholders
- FAQ accordion (where applicable)
- Final CTA banner linking to `/register` or `/chat`

## Out of Scope

- No backend/database changes.
- No new translations file work beyond existing `t()` keys (new content is EN-first; can add BN later).
- No changes to existing pages' content.

## Files Touched (summary)

- Created: 22 new page components in `src/pages/`
- Edited: `src/App.jsx`, `src/components/Navbar.jsx`, `src/components/Footer.jsx`, `public/sitemap.xml`

