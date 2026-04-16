

## Professional UI/UX Overhaul: Footer, Navbar, and Content Pages

### 1. Footer Bottom Bar Fix (Mobile)

The bottom bar currently stacks 3 items vertically on mobile which looks cluttered (as shown in image 1). Fix:
- Center-align all 3 items on mobile with better spacing
- Stack copyright on top, GEO tagline in middle, email at bottom with consistent `text-center`
- Add slight padding and increase gap between items
- Use a subtle divider or cleaner vertical arrangement

### 2. Footer Professional Polish

- Tighten spacing: reduce `gap-8` to `gap-6` on mobile for denser, cleaner columns
- Add subtle `uppercase tracking-wider text-[11px]` for column headers (like ChatGPT/Vercel footers)
- Make "Developer API" link to `/developer-api` page instead of being a `<span>` — move "Coming Soon" badge inside the page itself

### 3. Mega-Menu Navbar (Desktop)

Inspired by the university-style dropdown menus in the uploaded reference images (Daffodil University). Add hover mega-dropdown menus for desktop navbar items:

**Desktop nav items become:** `Products` | `Solutions` | `Resources` | `Company` | `Pricing`

Each item opens a clean multi-column dropdown panel on hover:

- **Products** dropdown: 2 columns — AI Chat, Sorix Deck, Sorix Imagine, Sorix Health, Sorix Agro, Sorix Legends, AI Agents, FlowBuilder (with small descriptions)
- **Solutions** dropdown: Workflow Automation, AI for Educators, AI for Startups, AI for Researchers
- **Resources** dropdown: Blog, Case Studies, Documentation, Developer API, Community
- **Company** dropdown: About Us, Press & Media, Careers, Contact Us, Partners

`Pricing` remains a scroll-to link (no dropdown).

The dropdowns use glassmorphism styling (`bg-background/90 backdrop-blur-xl border-border/50 shadow-2xl rounded-2xl`), appear on hover with a smooth `animate-in fade-in` transition, and close on mouse leave.

**Mobile menu**: Add accordion-style expandable sections for the same categories.

### 4. Developer API Page

Create `src/pages/DeveloperApiPage.jsx`:
- SEO title: "Developer API | AI Sorix - Coming Soon"
- Hero with "Developer API" heading and "Coming Soon" badge prominently displayed
- Sections: What to expect (REST API, SDKs, Webhooks), Use cases, Email signup for waitlist (mailto:support@aisorix.com)
- Add route in App.jsx

### 5. Enrich All Content Pages

All pages currently have minimal placeholder content. Expand each with more detail, richer SEO copy, and unified `support@aisorix.com` as the single contact email:

**BlogPage.jsx**: Add 2-3 more blog post entries with deeper excerpts. Add a "Subscribe to Newsletter" CTA section at bottom (mailto link).

**CaseStudiesPage.jsx**: Add detailed stats, longer descriptions, a "Get Similar Results" CTA linking to contact.

**PressPage.jsx**: Add media kit download section, press contact email (`support@aisorix.com`), brand assets section, more press releases.

**CareersPage.jsx**: Expand job descriptions, add "Why Work at AI Sorix" benefits section (remote-first, cutting-edge AI, growth), "Our Culture" section. Change `careers@aisorix.com` to `support@aisorix.com`.

**PartnersPage.jsx**: Add partnership benefits, application process, success metrics, "Become a Partner" CTA with `support@aisorix.com`.

**DocsPage.jsx**: Add a "Need Help?" section at the bottom with support email. Add quick-start steps section.

**SolutionsPage.jsx**: Add more benefits, testimonial-style quotes, stronger CTAs with "Get Started Free" buttons.

### 6. Route & Sitemap Updates

- Add `/developer-api` route (lazy-loaded) in App.jsx
- Add to sitemap.xml

### Technical Details

**Navbar mega-menu implementation:**
- Use `onMouseEnter`/`onMouseLeave` on each nav item wrapper
- State: `activeDropdown` string or null
- Dropdown panels rendered conditionally below nav, positioned absolutely
- Each panel is a grid of link items with icons and short descriptions
- Close on scroll or route change

**Files to create:** `src/pages/DeveloperApiPage.jsx`

**Files to edit:**
- `src/components/Navbar.jsx` — Full rewrite of desktop nav to mega-menu + mobile accordion sections
- `src/components/Footer.jsx` — Bottom bar fix, header styling, Developer API link update
- `src/pages/BlogPage.jsx` — More posts, newsletter CTA
- `src/pages/CaseStudiesPage.jsx` — Richer content, CTAs
- `src/pages/PressPage.jsx` — Media kit, more releases
- `src/pages/CareersPage.jsx` — Benefits section, email fix
- `src/pages/PartnersPage.jsx` — Process section, email fix
- `src/pages/DocsPage.jsx` — Help section
- `src/pages/SolutionsPage.jsx` — More content, CTAs
- `src/App.jsx` — Developer API route
- `public/sitemap.xml` — Developer API URL

