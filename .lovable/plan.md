

## Generate AI Sorix Developer Function List (PDF)

Create a professionally designed, multi-page PDF document covering the complete AI Sorix platform architecture, all tools, services, edge functions, database schema, API endpoints, hooks, stores, and configuration — formatted for a developer audience.

### Document Structure

**Page 1 — Cover Page**
- AI Sorix logo text, "Developer Function Reference", version date, confidential badge

**Page 2 — Table of Contents**

**Section 1: Platform Overview**
- Tech stack (React 18, Vite 5, TypeScript, Tailwind CSS, Supabase)
- Architecture diagram (Client → Edge Functions → OpenRouter / AI APIs)
- Authentication flow (email signup, verify, login, password reset)

**Section 2: Application Routes (18 routes)**
- All routes with path, component, protection status, and description
- Public routes (landing, auth, policies, reviews)
- Protected routes (chat, health, agro, legends, imagine, deck, agent, dashboard)
- Payment callback routes
- Admin routes

**Section 3: AI Models Registry (30+ models)**
- Full model table: display name, backend ID (OpenRouter), tier, multiplier, daily limits
- Grouped by plan tier: Free (3), Basic (11), Pro (8), Premium (6)
- Smart Auto routing logic explanation
- Token limits per plan: Free 15K, Basic 800K, Pro 1.5M, Premium 3M

**Section 4: Edge Functions (16 functions)**
- Each function listed with: name, purpose, auth requirement, request/response format
- `chat` — OpenRouter streaming proxy
- `health-analysis` — Medical research AI
- `agro-analysis` — Agricultural intelligence
- `legends-chat` — Historical figure conversations
- `imagine` — AI image generation
- `deck-generate` — Presentation slide generation
- `cowork-agent` — Agentic AI with tool-calling loop
- `project-ai` — Project workspace AI
- `github-sync` — GitHub OAuth and file sync
- `stripe-payment`, `sslcommerz-payment`, `bkash-payment` — Payment gateways
- `payment-webhook` — Payment callback handler
- `subscription-email`, `renewal-reminder` — Email notifications
- `delete-account` — Account deletion

**Section 5: Database Schema (20 tables)**
- Every table with columns, types, defaults, nullable status
- RLS policies summary per table
- Foreign key relationships

**Section 6: Client Services & API Layer**
- `api.ts` — Streaming chat with OpenRouter SSE parsing
- `healthApi.ts`, `agroApi.ts`, `legendsApi.ts`, `imagineApi.ts`, `deckApi.ts`

**Section 7: State Management (Zustand Stores)**
- `chatStore.ts` — Chat state, models, user, multi-window, projects, attachments
- `coworkStore.ts` — Agent state, tasks, messages, connectors

**Section 8: Custom Hooks (20 hooks)**
- Each hook with purpose and return values
- Auth, chat, subscription, speech, project, GitHub hooks

**Section 9: Utility Libraries**
- `fileParser.ts` — Universal file parser (images, PDFs, DOCX, code, data)
- `smartRouting.ts` — Query complexity analysis and cost-optimized model routing
- `exportUtils.ts` — Chat export to PDF, DOCX, Markdown, ZIP
- `responseCache.ts` — Response caching layer
- `translations.ts` — Bilingual support (English/Bengali)

**Section 10: Component Architecture**
- Component tree organized by feature module
- `aichat/` — 25+ components (ChatArea, MessageList, ModelSelector, etc.)
- `cowork/` — Agent workspace components
- `health/`, `agro/`, `legends/`, `deck/`, `imagine/`, `voice/` modules
- Shared UI components (shadcn/ui)

**Section 11: Payment & Subscription System**
- 3 payment gateways: Stripe, SSLCommerz, bKash
- Plan tiers and pricing (BDT currency)
- Subscription lifecycle and token tracking

**Section 12: Connector Integrations (14 services)**
- Google Drive, Gmail, LinkedIn, Twitter/X, Facebook, Instagram, WhatsApp, WhatsApp Business, YouTube, Telegram, Slack, Discord, Pinterest, TikTok
- Current status (most "Coming Soon")

**Section 13: Security & RLS Architecture**
- Role-based access (admin, employee, user)
- `has_role()` security definer function
- Per-table RLS policy summary

### Implementation

- Generate using Python `reportlab` with professional typography
- Color scheme: Dark navy headers (#1E2761), cyan accents (#00BCD4), clean white pages
- Tables with alternating row shading
- Output to `/mnt/documents/AI_Sorix_Developer_Function_List.pdf`
- Visual QA with `pdftoppm`

