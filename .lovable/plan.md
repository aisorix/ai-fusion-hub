

## Sorix FlowBuilder — AI Diagram & Flowchart Tool

A new tool at `/flowbuilder` that generates diagrams from natural language prompts using Mermaid.js, with code editing, color/style customization, templates, export (PDF/PNG/SVG), and history.

### Supported Diagram Types
Use Case, Flowchart, Class, Sequence, Entity Relationship, State, Mindmap, Architecture, Block, Gantt Chart, DFD, Activity, Tree/Hierarchy, Venn Diagram

### New Files to Create

| File | Purpose |
|------|---------|
| `supabase/functions/flowbuilder-generate/index.ts` | Edge function — calls OpenRouter with 4 LLMs to generate/edit Mermaid code |
| `src/services/flowbuilderApi.ts` | API service (calls edge function + CRUD on `analysis_history` table) |
| `src/pages/FlowBuilderPage.tsx` | Main page (follows ImaginePage/DeckPage pattern) |
| `src/components/flowbuilder/FlowPromptBar.tsx` | Prompt input with send button |
| `src/components/flowbuilder/FlowCanvas.tsx` | Split view: editable Mermaid code (left) + live rendered diagram (right) |
| `src/components/flowbuilder/FlowStylePanel.tsx` | Color themes, direction controls, style presets |
| `src/components/flowbuilder/FlowTemplates.tsx` | 12 pre-built diagram templates |
| `src/components/flowbuilder/FlowHistory.tsx` | Slide-out history panel |
| `src/components/flowbuilder/FlowExportActions.tsx` | Export to PDF, PNG, SVG |
| `src/components/flowbuilder/index.tsx` | Barrel exports |

### Edge Function: `flowbuilder-generate`

- Accepts: `{ prompt, existingCode?, diagramType?, colorTheme? }`
- Rotates across 4 LLMs via OpenRouter (uses existing `OPENROUTER_API_KEY`):
  - `anthropic/claude-sonnet-4.6`, `anthropic/claude-opus-4.6`, `google/gemini-3.1-pro-preview`, `meta-llama/llama-3.1-8b-instruct`
- System prompt instructs model to return valid Mermaid.js code only
- Supports editing existing diagrams (pass existing code + modification prompt)
- Saves to `analysis_history` table with `tool = 'flowbuilder'`
- Token cost: 5,000 tokens per generation
- Deducts from subscription quota

### Frontend Architecture

- **Mermaid rendering**: Install `mermaid` npm package for client-side rendering
- **Split view**: Left panel = editable code textarea, Right panel = live Mermaid diagram (zoomable)
- **Mobile**: Stacks vertically (code on top, diagram below)
- **Color themes**: 8 presets (Dark, Light, Forest, Ocean, Sunset, Neon, Corporate, Pastel) mapped to Mermaid theme configs
- **Templates**: 12 pre-built templates matching all diagram types
- **Export**: PNG (canvas render), SVG (direct), PDF (jspdf wrapping SVG)
- **History**: Uses existing `analysis_history` table, slide-out panel like Imagine

### Existing Files to Modify

1. **`src/App.jsx`** — Add lazy import + protected route at `/flowbuilder`
2. **`src/components/aichat/ChatSidebar.tsx`** — Add FlowBuilder to `moreTools` array + collapsed dropdown (icon: `Workflow`, gradient: `from-violet-500 to-purple-600`)
3. **`src/components/aichat/MobileSidebar.tsx`** — Same addition to mobile tools
4. **`src/components/Features.jsx`** — Add FlowBuilder card to landing page features

### NPM Dependencies
- `mermaid` — diagram rendering
- `jspdf` — PDF export

### UI Design
- **Icon**: `Workflow` from lucide-react
- **Gradient**: `from-violet-500 to-purple-600` (distinct purple theme)
- **Layout**: Futuristic glassmorphism header matching existing Sorix tools
- **Token cost**: 5,000 tokens per diagram generation displayed in UI

### Token Pricing
- 5,000 tokens per new diagram generation
- 3,000 tokens per edit/modification of existing diagram
- Free plan users can generate within their 15K token quota

