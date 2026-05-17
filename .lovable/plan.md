# Validate & fix JSON-LD schema

## Honest scope

Google's Rich Results Test is an interactive web tool — there's no public API I can call from this sandbox. What I **can** do is audit every JSON-LD block against:

1. Google's [SoftwareApplication](https://developers.google.com/search/docs/appearance/structured-data/software-app) requirements
2. Google's [Breadcrumb](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb) requirements
3. schema.org spec for `WebApplication`, `Organization`, `WebSite`, `FAQPage`, `CollectionPage`, `ItemList`

After fixing, you can run the live test yourself at https://search.google.com/test/rich-results — I'll list the URLs to paste.

## Issues found in a static audit

I'm flagging probable issues without writing fixes yet (plan mode). After approval I'll patch them.

### 1. `SoftwareApplication` missing required fields (Google warning)

Google's [official requirements](https://developers.google.com/search/docs/appearance/structured-data/software-app) for the App rich result:

- **Required**: `name`, `image`, **`aggregateRating` OR `review` OR `offers`**, `applicationCategory`, `operatingSystem`.
- Our blocks have `name`, `offers`, `applicationCategory`, `operatingSystem` ✓
- **Missing `image`** on Chat, FlowBuilder, Agent, Tools children — this triggers a Google warning ("missing image").

Fix: add `"image": "https://www.aisorix.com/logo.png"` (or a real screenshot) to every SoftwareApplication node.

### 2. `Offer` shape

Our offers use `price: "0"`. Google accepts this but warns if `priceValidUntil` is missing for non-zero prices. Free offers are fine; no change needed.

### 3. `index.html` `SoftwareApplication` schema

Same `image` warning applies to the global block at lines 102–157. Add `image`.

### 4. `index.html` `Offer` entries lack `url`

`Offer` recommends a `url` so Google can link directly to the pricing page. Add `"url": "https://www.aisorix.com/#pricing"` to each of the 4 offers.

### 5. `aggregateRating` in `index.html`

The global SoftwareApplication has `aggregateRating { ratingValue: "4.8", reviewCount: "150" }`. Google **requires** an accompanying `review` or `aggregateRating` **with `itemReviewed` context** — but inside SoftwareApplication this is fine. However, Google has been increasingly strict: if those numbers aren't backed by visible on-page reviews, it can trigger a "Spammy structured markup" warning. Two options:
- (a) Keep — risky if not backed by visible reviews on `/`.
- (b) Move to Reviews page only, where actual reviews render. **Recommend (b)**.

### 6. `BreadcrumbList`

All 4 new breadcrumbs are valid (position, name, item URL). ✓ No fix.

### 7. `FAQPage` in `index.html`

Valid shape. Google requires the answers be **visible on the page**. Our FAQs are answered in the Faqs section ✓ — but verify content matches. Quick string-check only; no edit unless mismatch found.

### 8. `Organization` in `index.html`

Missing recommended `email` at top level (it's only nested in contactPoint). Low priority — Google accepts current shape. No change.

### 9. `Index.jsx` page schema

Currently has Organization + WebApplication only. Could add a **WebPage** + **BreadcrumbList** for consistency, but not required. Skip unless you want it.

## Plan of fixes (after approval)

| File | Fix |
|---|---|
| `src/pages/ChatPage.tsx` | Add `image` to SoftwareApplication |
| `src/pages/FlowBuilderPage.tsx` | Add `image` |
| `src/pages/CoWorkPage.tsx` | Add `image` |
| `src/pages/ToolsPage.tsx` | Add `image` to each `ListItem.item` (6 tools) and to CollectionPage |
| `index.html` | Add `image` to SoftwareApplication; add `url` to each Offer; remove `aggregateRating` (or keep — your call) |

## Verification steps (manual, after fixes)

I'll provide a checklist with these URLs for you to paste into the live tester:
- https://www.aisorix.com/
- https://www.aisorix.com/chat
- https://www.aisorix.com/tools
- https://www.aisorix.com/flowbuilder
- https://www.aisorix.com/agent

For each: expect 0 errors, 0 warnings for SoftwareApplication / Breadcrumbs.

## Question

Should I **remove** the `aggregateRating` (4.8 / 150 reviews) from `index.html`, **keep** it, or **lower** it to match real review count from the Reviews page? This is the one item where you should choose, since faking ratings is a real Google penalty risk.
