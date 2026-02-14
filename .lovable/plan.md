

# Complete Projects Feature for AI Chat Sidebar

## Overview
Build a full-featured Projects system in the sidebar where paid users (Basic/Pro/Premium) can create AI-powered development projects with dedicated chat conversations, using DeepSeek V3.2 or Claude Sonnet 4.5 via OpenRouter.

## Plan Limits by Tier
| Plan | Max Projects | Token Source |
|------|-------------|--------------|
| Free | 0 (locked) | N/A |
| Basic | 2 | User's 800K quota |
| Pro | 5 | User's 1.5M quota |
| Premium | 10 | User's 3M quota |

## Available Models (OpenRouter Only)
| Model | Backend ID | Multiplier |
|-------|-----------|------------|
| DeepSeek V3.2 | `deepseek/deepseek-v3.2` | 1x |
| Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | 6x |

## What Gets Built

### 1. Projects Modal Component (`src/components/aichat/ProjectsModal.tsx`)
A full-screen dialog/modal with two views:

**Project List View:**
- Header with "Projects" title, project count badge (e.g., "2/5"), and "New Project" button
- Each project card shows: icon (emoji), name, description, message count, last updated, status indicator
- Futuristic glassmorphism design with neon cyan accents matching the existing design system
- Free users see a locked state with an "Upgrade" CTA
- Click a project to enter its chat view

**Create Project Form:**
- Name input field
- Description textarea
- Model selector (DeepSeek V3.2 or Claude Sonnet 4.5) with cost/multiplier info
- Icon picker (emoji grid)
- Color picker
- "Create" button (disabled if at plan limit)

**Project Chat View:**
- Back button to return to list
- Project name header with model badge
- Chat messages list with markdown rendering (reuse existing MarkdownRenderer)
- Chat input at bottom
- Streaming responses from OpenRouter
- Token usage display per project

### 2. Update Edge Function (`supabase/functions/project-ai/index.ts`)
- Switch from Lovable AI Gateway to OpenRouter API (`https://openrouter.ai/api/v1/chat/completions`)
- Use `OPENROUTER_API_KEY` secret (already configured)
- Accept `model` parameter from client (either `deepseek/deepseek-v3.2` or `anthropic/claude-sonnet-4.5`)
- Validate model is one of the two allowed models
- Stream responses back to client
- Calculate token usage and return in response headers
- Save messages to `project_messages` table
- Deduct tokens from user's `subscriptions.tokens_used` based on multiplier
- Enforce token limit checks before processing

### 3. Update `useProjectAI.ts` Hook
- Replace placeholder `sendMessage` with real streaming call to `project-ai` edge function
- Parse SSE stream and update messages in real-time
- Track token deduction per message (input + output tokens x multiplier)
- Add `selectedModel` state for per-project model selection
- Add plan limit enforcement (check project count vs plan limit)
- Store selected model per project in the `projects` table

### 4. Database Migration
- Add `model` column to `projects` table (text, default `'deepseek/deepseek-v3.2'`) to persist the chosen model per project

### 5. Wire into ChatPage
- Import ProjectsModal in `ChatPage.tsx`
- Render it when `projectsModalOpen` is true from the store
- The sidebar "Projects" button already sets `projectsModalOpen(true)`

### 6. Token Deduction Logic
- Input tokens estimated at ~4 chars/token
- Output tokens estimated from streamed response
- Total = (input + output) x multiplier (1x for DeepSeek, 6x for Claude)
- Deducted from user's subscription `tokens_used`
- If `tokens_used + estimated_cost > tokens_limit`, block the request and show upgrade modal

## Technical Details

**Files to create:**
- `src/components/aichat/ProjectsModal.tsx` -- Main projects UI (list, create, chat views)

**Files to modify:**
- `supabase/functions/project-ai/index.ts` -- Switch to OpenRouter, add model param, token deduction
- `src/hooks/useProjectAI.ts` -- Real streaming, model selection, plan limits
- `src/pages/ChatPage.tsx` -- Render ProjectsModal
- Database migration -- Add `model` column to `projects` table

**Design approach:**
- Glassmorphism cards with `backdrop-blur`, `border-primary/20` borders
- Cyan/primary gradient accents
- Animated transitions using framer-motion
- Dark mode optimized with proper contrast
- Mobile responsive with full-screen modal on mobile

