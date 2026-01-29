
# AI Chat Application Integration Plan

## Overview
This plan integrates the comprehensive AI chat application from your uploaded files with your existing AI Sorix landing page. After login/registration, users will be redirected to a full-featured chat interface with multi-model support, project management, and voice capabilities.

## Current State Analysis

### What You've Uploaded (Ready to Integrate)
- **Store**: `chatStore.ts` - Complete Zustand state management (578 lines)
- **Core Hooks**: `useChat.ts`, `useProjectAI.ts`, `useAuth.ts`, `useAutoScroll.ts`, `useOnlineStatus.ts`
- **Voice Hooks**: `useSpeechRecognition.ts`, `useSpeechSynthesis.ts`
- **Chat Components**: `ChatContainer.tsx`, `Sidebar.tsx`, `MultiWindowChat.tsx`, `ChatArea.tsx`, `ChatInput.tsx`, `MessageList.tsx`, `MessageBubble.tsx`, `MarkdownRenderer.tsx`, `CodeBlock.tsx`, `EmptyState.tsx`, `ModelSelector.tsx`, `WindowModelSelector.tsx`
- **Modal Components**: `SettingsModal.tsx`, `ProjectsModal.tsx`, `ShareModal.tsx`, `UpgradePlanModal.tsx`, `PaymentMethodModal.tsx`
- **Utility Components**: `SourcesWidget.tsx`, `FileChip.tsx`, `ExportDropdown.tsx`, `OfflineBanner.tsx`, `CitationLink.tsx`
- **Pages**: `Index.tsx` (chat page), payment callback pages

### Files Still Required
| File | Purpose | Priority |
|------|---------|----------|
| `src/services/api.ts` | Chat API service | Critical |
| `src/services/healthApi.ts` | Health analysis API | Critical |
| `src/lib/fileParser.ts` | File parsing utilities | Critical |
| `src/lib/translations.ts` | Language strings | High |
| `src/lib/exportUtils.ts` | Export functionality | Medium |
| Settings tab components | Modal tabs content | Medium |
| Voice components folder | Voice mode UI | Medium |
| Health components folder | Health mode UI | Medium |

## Implementation Architecture

### Routing Structure
```text
/              → Landing Page (existing)
/chat          → AI Chat Interface (new)
/login         → Login → redirects to /chat
/register      → Register → redirects to /chat
/admin/chat    → Employee Dashboard (existing)
/payment/*     → Payment callbacks (new)
```

### Component Hierarchy
```text
App.jsx
├── Index (Landing) - "/"
├── ChatPage - "/chat" (new)
│   └── ChatContainer
│       ├── Sidebar (chat history, projects)
│       ├── ChatArea
│       │   ├── EmptyState | MessageList
│       │   ├── MarkdownRenderer + CodeBlock
│       │   └── ChatInput + ModelSelector
│       └── MultiWindowChat (compare mode)
└── Modals (Settings, Projects, Share, etc.)
```

## Integration Steps

### Phase 1: Core Infrastructure
1. **Create stores directory** with `chatStore.ts`
2. **Create services directory** with API stubs (you'll need to upload the real ones)
3. **Create lib utilities** (fileParser.ts, translations.ts)

### Phase 2: Chat Components
1. Copy all uploaded chat components to `src/components/chat/`
2. Create new `ChatPage.tsx` wrapper component at `/chat` route
3. Set up component index file for clean imports

### Phase 3: Modal Integration
1. Add settings modal with tabs
2. Add projects modal for workspace management
3. Add share/export functionality

### Phase 4: Authentication Flow
1. Update `Login.tsx` to redirect to `/chat` on success
2. Update `Register.tsx` to redirect to `/chat` on success
3. Add protected route wrapper for `/chat`

### Phase 5: Voice & Health (Optional)
1. Integrate voice input/output components
2. Add health analysis mode toggle
3. Connect to health-analysis edge function

## Database Requirements

### Tables Needed
1. **projects** - User workspaces for organizing chats
   - id, user_id, name, description, icon, color, status, tokens_used, chat_count
   
2. **project_messages** - Persistent chat history
   - id, project_id, user_id, role, content, tokens_used, created_at

### Edge Functions Required
1. **chat** - Main AI chat endpoint (streaming)
2. **project-ai** - Project-specific AI context
3. **health-analysis** - Health document analysis

## Technical Notes

### Zustand Store Integration
The store uses `persist` middleware with localStorage:
- Theme, chats, selected model, language preferences are persisted
- Token usage tracking with plan limits
- Multi-window comparison state

### API Integration Points
The `useChat` hook expects these API services:
- `chatApi.sendMessageStream()` - Streaming AI responses
- `healthApi.sendMessageStream()` - Health analysis
- Both support abort controllers for cancellation

### Model Configuration
The store defines 25+ AI models across 4 plan tiers:
- Free: GPT-4o, DeepSeek, Gemini 2.5 Flash
- Basic: GPT-5 mini/nano, Grok 4, LLaMA Smart
- Pro: Perplexity, GPT-5.1/5.2, DeepSeek Reasoner
- Premium: Claude Sonnet/Opus, Gemini 3 Pro

## What To Upload Next

To proceed with the full integration, please upload:

1. **Critical**: `src/services/api.ts` (chat API service)
2. **Critical**: `src/services/healthApi.ts` (health API service)  
3. **Critical**: `src/lib/fileParser.ts` (file parsing)
4. **Recommended**: `src/lib/translations.ts` (i18n strings)
5. **Optional**: Voice components folder
6. **Optional**: Health components folder (HealthFeaturesModal, etc.)

Once you upload these, I can implement the complete integration in a single pass.
