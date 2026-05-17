# Add JSON-LD to main product pages

All four pages already have (or will get) `<SEOHead>` for title/description/canonical/OG. This plan adds **schema.org structured data** so Google can render rich results and AI search engines can correctly identify each product.

## Current state

| Page | Route | SEOHead | JSON-LD |
|---|---|---|---|
| ChatPage | `/chat` | ✓ | ✗ |
| ToolsPage | `/tools` | ✗ | ✗ |
| FlowBuilderPage | `/flowbuilder` | ✓ | ✗ |
| CoWorkPage (Agent) | `/agent` | ✓ | ✗ |

## What I'll add

Each page gets two inline `<script type="application/ld+json">` blocks (same pattern as `Index.jsx`):

1. **SoftwareApplication / WebApplication** — names the tool, its category, the parent Organization (AI Sorix), URL, feature list, and free-offer (`price: "0"`). This drives Google's app-style rich result.
2. **BreadcrumbList** — `Home → AI Sorix → {Page}` so Sitelinks show the hierarchy.

`isPartOf` references the global `WebSite` already declared in `index.html`, and `publisher`/`provider` references the global `Organization` (also in `index.html`) — keeping a single source of truth for brand identity.

## Per-page specifics

**ChatPage (`/chat`)**
- `@type: SoftwareApplication`, name "AI Sorix Chat"
- `applicationCategory: BusinessApplication`, `featureList`: 15+ models (GPT-5, Claude, Gemini, DeepSeek, Grok…), file attachments, voice mode, multi-window chat, projects, sharing.
- Add `ToolsPage`-style breadcrumb.

**ToolsPage (`/tools`)**
- Also wire in `<SEOHead>` (currently missing).
- `@type: CollectionPage` with an embedded `ItemList` of the 6 active tools (Health, Agro, Legends, Deck, FlowBuilder, Imagine) — each as a `SoftwareApplication` `ListItem`. This is the correct schema for a gallery/index page.

**FlowBuilderPage (`/flowbuilder`)**
- `@type: SoftwareApplication`, name "Sorix FlowBuilder"
- `applicationCategory: DesignApplication`, `featureList`: Mermaid diagrams, templates, themes, SVG/PNG export, history.

**CoWorkPage (`/agent`)**
- `@type: SoftwareApplication`, name "Sorix Agent"
- `applicationCategory: BusinessApplication`, `featureList`: autonomous task execution, web search, document generation, integrations (Google, FB, LinkedIn, WhatsApp, Telegram), real-time progress.

## Implementation pattern

Same shape as `src/pages/Index.jsx` (no new component, no Helmet rewrite):

```jsx
const jsonLd = [ { /* SoftwareApplication */ }, { /* BreadcrumbList */ } ];
return (
  <>
    <SEOHead title="…" description="…" path="/chat" />
    {jsonLd.map((d, i) => (
      <script key={i} type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
    ))}
    {/* existing page JSX */}
  </>
);
```

## Files to edit

- `src/pages/ChatPage.tsx` — add JSON-LD next to existing SEOHead.
- `src/pages/ToolsPage.tsx` — add `<SEOHead>` + JSON-LD (CollectionPage + ItemList).
- `src/pages/FlowBuilderPage.tsx` — add JSON-LD next to existing SEOHead.
- `src/pages/CoWorkPage.tsx` — add JSON-LD next to existing SEOHead.

## Out of scope

- No content, layout, or behavior changes.
- No edits to `index.html` (global Organization/WebSite schema already correct).
- No sitemap changes (already current).
- No new components — inline schema blocks only, matching the existing Index.jsx pattern.
