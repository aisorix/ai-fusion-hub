
# Integration Plan: AI Chatbox from GitHub Repository

## Overview
This plan integrates the complete AI chatbox code from `https://github.com/rakibeslam8/test-chat-box` into your existing landing page project. The integration will be done exactly as the code is provided in the repository - no modifications, no random changes.

## Source Repository Analysis

The GitHub repository contains a comprehensive AI chatbox with these components:

### File Structure (from repository):
```text
src/
├── stores/
│   └── chatStore.ts (Zustand state management)
├── services/
│   ├── api.ts (Chat API service)
│   └── healthApi.ts (Health analysis API)
├── lib/
│   ├── fileParser.ts (Universal file parser)
│   ├── translations.ts (EN/BN translations)
│   └── exportUtils.ts (PDF/DOCX/ZIP export)
├── hooks/
│   ├── useChat.ts (Chat logic hook)
│   ├── useAutoScroll.ts
│   ├── useOnlineStatus.ts
│   ├── useProjectAI.ts (Project workspace AI)
│   ├── useSpeechRecognition.ts (Voice input)
│   └── useSpeechSynthesis.ts (Voice output)
├── pages/
│   └── Index.tsx (renders ChatContainer)
├── components/
│   ├── chat/
│   │   ├── index.ts (exports)
│   │   ├── ChatContainer.tsx (main wrapper)
│   │   ├── Sidebar.tsx (full sidebar with themes/projects)
│   │   ├── ChatArea.tsx (chat area with model selector)
│   │   ├── ChatInput.tsx (with drag-drop, camera, attachments)
│   │   ├── MessageList.tsx
│   │   ├── MessageBubble.tsx (with reactions, export)
│   │   ├── MarkdownRenderer.tsx (with health charts)
│   │   ├── CodeBlock.tsx (with JS execution)
│   │   ├── ModelSelector.tsx (plan-based model selection)
│   │   ├── EmptyState.tsx (welcome screen)
│   │   ├── ShareModal.tsx
│   │   ├── SettingsModal.tsx (tabs: General, Plans, etc.)
│   │   ├── UpgradePlanModal.tsx (payment integration)
│   │   ├── PaymentMethodModal.tsx (SSLCommerz/Stripe/bKash)
│   │   ├── MultiWindowChat.tsx (multi-model comparison)
│   │   ├── ProjectsModal.tsx (project management)
│   │   ├── ProjectWorkspace.tsx
│   │   ├── WindowModelSelector.tsx
│   │   ├── SharedChatInput.tsx (reusable input)
│   │   ├── SourcesWidget.tsx (citations display)
│   │   ├── ExportDropdown.tsx
│   │   ├── FileChip.tsx
│   │   ├── OfflineBanner.tsx
│   │   └── settings/
│   │       ├── GeneralTab.tsx
│   │       ├── PlansTokensTab.tsx
│   │       ├── ProfileTab.tsx
│   │       ├── SubscriptionTab.tsx
│   │       ├── PaymentHistoryTab.tsx
│   │       ├── ReportBugTab.tsx
│   │       ├── HelpCenterTab.tsx
│   │       └── TermsTab.tsx
│   ├── health/
│   │   ├── index.ts
│   │   ├── HealthFeaturesModal.tsx
│   │   ├── HealthAnalysisChart.tsx
│   │   ├── HealthModeToggle.tsx
│   │   └── HealthResultsCard.tsx
│   └── voice/
│       ├── index.ts
│       ├── LiveVoiceOverlay.tsx
│       ├── VoiceVisualizer.tsx
│       └── VoicePersonaSelector.tsx
```

## Integration Steps

### Phase 1: Install New Dependencies

Add these packages not currently in your project:

| Package | Version | Purpose |
|---------|---------|---------|
| framer-motion | ^12.23.26 | Animations throughout UI |
| react-textarea-autosize | ^8.5.9 | Auto-resizing input |
| copy-to-clipboard | ^3.3.3 | Copy functionality |
| docx | ^9.5.1 | Word export |
| file-saver | ^2.0.5 | File downloads |
| jspdf | ^4.0.0 | PDF export |
| jszip | ^3.10.1 | ZIP export |
| katex | ^0.16.27 | Math rendering |
| remark-gfm | ^4.0.1 | GitHub Markdown |
| remark-math | ^6.0.0 | Math in Markdown |
| rehype-katex | ^7.0.1 | KaTeX rendering |
| axios | ^1.13.2 | HTTP client |
| @types/file-saver | ^2.0.7 | TypeScript types |
| @tailwindcss/typography | ^0.5.16 | Prose styling |

### Phase 2: Create Core Files (Exact Code from Repository)

#### 2.1 State Management
- `src/stores/chatStore.ts` - Complete Zustand store with:
  - Theme management
  - Sidebar state
  - Multi-window chat
  - User plan & tokens
  - Projects management
  - Chat history
  - Model selection (23 models with plan restrictions)
  - Health mode
  - Attachments

#### 2.2 Services
- `src/services/api.ts` - Chat streaming API
- `src/services/healthApi.ts` - Health analysis API

#### 2.3 Utilities
- `src/lib/fileParser.ts` - Universal file parser (images, PDF, code, etc.)
- `src/lib/translations.ts` - English/Bangla UI translations
- `src/lib/exportUtils.ts` - Export to PDF/DOCX/Markdown/ZIP

#### 2.4 Hooks
- `src/hooks/useChat.ts` - Main chat logic
- `src/hooks/useAutoScroll.ts` - Auto-scroll messages
- `src/hooks/useOnlineStatus.ts` - Connection detection
- `src/hooks/useProjectAI.ts` - Project AI integration
- `src/hooks/useSpeechRecognition.ts` - Voice input
- `src/hooks/useSpeechSynthesis.ts` - Voice output with personas

### Phase 3: Create Chat Components

#### 3.1 Main Chat Structure
- `src/components/chat/index.ts` - Central exports
- `src/components/chat/ChatContainer.tsx` - Main wrapper
- `src/components/chat/Sidebar.tsx` - Full sidebar (1112 lines)
- `src/components/chat/ChatArea.tsx` - Chat display area
- `src/components/chat/OfflineBanner.tsx` - Offline detection

#### 3.2 Input & Messages
- `src/components/chat/ChatInput.tsx` - Full input (729 lines) with:
  - Drag & drop files
  - Camera capture
  - Clipboard paste
  - File size limits by plan
  - Health mode toggle
- `src/components/chat/SharedChatInput.tsx` - Reusable version
- `src/components/chat/MessageList.tsx` - Message container
- `src/components/chat/MessageBubble.tsx` - Individual messages with:
  - Emoji reactions
  - Copy, share, export
  - Voice read-aloud
- `src/components/chat/FileChip.tsx` - File attachment display

#### 3.3 Rendering
- `src/components/chat/MarkdownRenderer.tsx` - Markdown with:
  - Code syntax highlighting
  - Math (KaTeX)
  - Health charts
- `src/components/chat/CodeBlock.tsx` - Code with:
  - Syntax highlighting
  - Copy button
  - Collapse/expand
  - JavaScript execution in browser

#### 3.4 Model & Sources
- `src/components/chat/ModelSelector.tsx` - Model dropdown (395 lines)
- `src/components/chat/WindowModelSelector.tsx` - Per-window selector
- `src/components/chat/SourcesWidget.tsx` - Citations display
- `src/components/chat/EmptyState.tsx` - Welcome screen

#### 3.5 Modals
- `src/components/chat/ShareModal.tsx` - Share functionality
- `src/components/chat/SettingsModal.tsx` - Settings hub
- `src/components/chat/UpgradePlanModal.tsx` - Plan upgrade (548 lines)
- `src/components/chat/PaymentMethodModal.tsx` - Payment selection
- `src/components/chat/ProjectsModal.tsx` - Project management (791 lines)
- `src/components/chat/ProjectWorkspace.tsx` - Project chat
- `src/components/chat/MultiWindowChat.tsx` - Multi-model comparison (647 lines)
- `src/components/chat/ExportDropdown.tsx` - Export options

#### 3.6 Settings Tabs
- `src/components/chat/settings/GeneralTab.tsx` - Theme/language
- `src/components/chat/settings/PlansTokensTab.tsx` - Plan display
- `src/components/chat/settings/ProfileTab.tsx`
- `src/components/chat/settings/SubscriptionTab.tsx`
- `src/components/chat/settings/PaymentHistoryTab.tsx`
- `src/components/chat/settings/ReportBugTab.tsx`
- `src/components/chat/settings/HelpCenterTab.tsx`
- `src/components/chat/settings/TermsTab.tsx`

### Phase 4: Create Health Components
- `src/components/health/index.ts`
- `src/components/health/HealthFeaturesModal.tsx`
- `src/components/health/HealthAnalysisChart.tsx` - Recharts visualization
- `src/components/health/HealthModeToggle.tsx`
- `src/components/health/HealthResultsCard.tsx`

### Phase 5: Create Voice Components
- `src/components/voice/index.ts`
- `src/components/voice/LiveVoiceOverlay.tsx` - Full voice mode (494 lines)
- `src/components/voice/VoiceVisualizer.tsx` - ChatGPT-style orb
- `src/components/voice/VoicePersonaSelector.tsx` - Voice selection

### Phase 6: Create Chat Page & Update Routing

#### 6.1 New Chat Page
- `src/pages/Chat.tsx` - Renders `ChatContainer`

#### 6.2 Update App.jsx
- Add `/chat` route pointing to Chat page
- Keep landing page at `/`

#### 6.3 Update Login/Register
- Redirect to `/chat` after successful authentication
- Update OAuth redirect URLs

### Phase 7: Tailwind Configuration
- Add `@tailwindcss/typography` plugin for prose styling

## Technical Notes

### Models Included (23 total)
- **Free**: GPT-4o, DeepSeek, Gemini 2.5 Flash
- **Basic**: GPT-5 mini/nano, Gemini 3 Flash, Grok 4, DeepSeek V3, LLaMA Smart, Qwen Flash
- **Pro**: Perplexity, Qwen Pro, GPT-5.1/5.2, Gemini 2.5 Pro, Grok 4 fast, DeepSeek Chat/Reasoner, LLaMA Pro
- **Premium**: Claude Sonnet/Opus 4.5, Gemini 3 Pro, Grok 4.1 fast, LLaMA Ultra, Kimi-K2, Mistral Codestral

### Token Limits by Plan
- Free: 5,000 tokens
- Basic: 800,000 tokens
- Pro: 1,500,000 tokens
- Premium: 3,000,000 tokens

### File Size Limits by Plan
- Free: 1 MB
- Basic: 5 MB
- Pro: 10 MB
- Premium: 15 MB

## Files to Create (60+ files)

All files will be created with **exact code from the GitHub repository** - no modifications, no random implementations.

## Routing Summary

| Route | Component | Purpose |
|-------|-----------|---------|
| `/` | Index.jsx | Landing page (existing) |
| `/chat` | Chat.tsx | AI Chatbox interface |
| `/login` | Login.jsx | Redirects to /chat after auth |
| `/register` | Register.jsx | Redirects to /chat after auth |

## Expected Result
After implementation, users will:
1. See the existing landing page at `/`
2. After login/register, be redirected to `/chat`
3. Have full access to the professional AI chatbox with:
   - Multi-model selection
   - Multi-window comparison
   - File attachments (drag-drop, camera, paste)
   - Health mode with visual charts
   - Live voice mode
   - Project management
   - Settings with plan/subscription management
   - Export conversations (PDF/DOCX/ZIP)
   - EN/BN language support
