

## Sorix Co-Work — Agentic AI Workspace

This is a large feature that creates a new "Sorix Co-Work" page — an agentic AI workspace inspired by Claude's Cowork interface. Users can delegate complex multi-step tasks to an AI agent that shows real-time progress, uses tools, and requests approval before taking actions.

### Important Constraints

- **No desktop app access** — this is web-only, so features like local file system access or browser automation are simulated/limited to cloud APIs
- **Lovable AI Gateway is disabled** — must use OpenRouter API with user's own key for AI models
- **Connectors available**: Google Drive and Slack exist as connectors but are not currently linked. Gmail/LinkedIn/Twitter would require separate API keys
- **This is a large feature** — I recommend building it in phases. Phase 1 (below) creates the full UI/UX and a working agent chat with task progress tracking. Phase 2+ would add real connector integrations

### Architecture

```text
┌─────────────────────────────────────────────────┐
│                 /cowork page                     │
├──────────┬──────────────────────┬───────────────┤
│ Sidebar  │  Command Center     │ Task Monitor  │
│ (reuse   │  (Agent Chat)       │ (Progress)    │
│  chat    │                     │               │
│  sidebar │  Chat input with    │ Active tasks  │
│  + new   │  agent responses    │ with steps    │
│  CoWork  │  showing tool use   │ & status      │
│  link)   │  & thinking         │               │
│          │                     │ Connectors    │
│          │                     │ panel         │
│          ├─────────────────────┤               │
│          │ HITL Approval Modal │               │
│          │ when agent needs OK │               │
└──────────┴─────────────────────┴───────────────┘
```

### Phase 1 — What Gets Built Now

**1. New route & page: `/cowork`**
- `src/pages/CoWorkPage.tsx` — Protected route, full-screen layout
- Add to `App.jsx` routes and lazy-load

**2. Sidebar integration**
- Add "Sorix Co-Work" button in `ChatSidebar.tsx` (below Multi-Window Chat) and `MobileSidebar.tsx`
- Uses `Bot` icon from lucide-react with a cyan/teal gradient

**3. Co-Work page components (`src/components/cowork/`):**

| Component | Purpose |
|-----------|---------|
| `CoWorkLayout.tsx` | 3-panel layout (chat + task monitor + connectors) |
| `CommandCenter.tsx` | Agent chat interface with message bubbles showing tool usage, thinking steps |
| `TaskMonitor.tsx` | Right panel showing active agent tasks with step-by-step progress (Reading → Analyzing → Drafting → Done) |
| `ConnectorPanel.tsx` | Cards for Google Drive, Gmail, LinkedIn, Twitter with connect/disconnect states |
| `AgentMessage.tsx` | Message bubble that renders tool-use indicators, thinking steps, and results |
| `ApprovalModal.tsx` | HITL modal — shows agent's proposed action with Approve/Edit/Cancel |
| `TaskCard.tsx` | Individual task progress card with animated steps |
| `SmartClipboard.tsx` | "Format & Ready to Paste" button for agent outputs |

**4. Agent backend: `supabase/functions/cowork-agent/index.ts`**
- Connects to OpenRouter API using stored `OPENROUTER_API_KEY` secret
- Models: Claude Sonnet 4.6, Gemini 2.5 Pro, GPT-5 Mini, Llama 3.3 70B (user selectable)
- Implements tool-calling loop: agent receives user prompt, calls tools (web search, file summary, draft generation), streams responses
- Tools available to agent:
  - `web_search` — search the web for information
  - `generate_document` — create formatted text/reports
  - `analyze_data` — process and summarize data
  - `schedule_task` — create a follow-up reminder
  - `clipboard_copy` — prepare text for user to copy

**5. Database tables (migration):**
- `cowork_tasks` — stores tasks with status (pending, running, blocked, completed, failed), steps JSON, user_id
- `cowork_messages` — agent conversation messages with tool_calls and tool_results columns
- `cowork_connectors` — user connector states (connected/disconnected per service)

**6. State management:**
- `src/stores/coworkStore.ts` — Zustand store for agent status (Idle/Thinking/Working/Blocked), active tasks, messages, connector states

**7. UI/UX Design:**
- Dark glassmorphic aesthetic with `backdrop-blur` panels
- Neon cyan/teal accents matching Sorix brand
- Framer Motion animations for task step transitions
- Agent status indicator: pulsing dot (green=idle, yellow=thinking, blue=working, red=blocked)
- Tool-use indicators: glowing icon chips when agent uses a tool
- Streaming responses with typing animation

**8. Bangla translation support:**
- All UI strings use inline `language === 'bn'` ternary pattern

### What's NOT in Phase 1 (Future phases)
- Actual Google Drive/Gmail/LinkedIn/Twitter API integrations (UI shows connect buttons but they open a "Coming Soon" state)
- Virtual browser feature (would need headless browser infrastructure)
- Real email inbox management
- Social media auto-posting

### Files Created/Modified

| Action | File |
|--------|------|
| Create | `src/pages/CoWorkPage.tsx` |
| Create | `src/components/cowork/CoWorkLayout.tsx` |
| Create | `src/components/cowork/CommandCenter.tsx` |
| Create | `src/components/cowork/TaskMonitor.tsx` |
| Create | `src/components/cowork/ConnectorPanel.tsx` |
| Create | `src/components/cowork/AgentMessage.tsx` |
| Create | `src/components/cowork/ApprovalModal.tsx` |
| Create | `src/components/cowork/TaskCard.tsx` |
| Create | `src/components/cowork/SmartClipboard.tsx` |
| Create | `src/stores/coworkStore.ts` |
| Create | `src/hooks/useCoWorkAgent.ts` |
| Create | `supabase/functions/cowork-agent/index.ts` |
| Modify | `src/App.jsx` — add `/cowork` route |
| Modify | `src/components/aichat/ChatSidebar.tsx` — add Co-Work nav item |
| Modify | `src/components/aichat/MobileSidebar.tsx` — add Co-Work nav item |
| Migration | Create `cowork_tasks`, `cowork_messages`, `cowork_connectors` tables |

### API Key Requirement
- User needs an **OpenRouter API key** stored as `OPENROUTER_API_KEY` secret. I'll prompt for this before the agent can function.

