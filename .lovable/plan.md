## Sorix FlowBuilder — AI Diagram & Flowchart Tool

A new tool at `/flowbuilder` that lets users describe diagrams in natural language and get rendered Mermaid diagrams with editable code, color/style customization, templates, export (PDF/PNG/SVG), and history.

### Supported Diagram Types (from image)
Use Case, Flowchart, Class, Sequence, Entity Relationship, State, Mindmap, Architecture, Block, Gantt Chart, DFD, Activity, Tree/Hierarchy, Venn Diagram

### Architecture

```text
FlowBuilderPage
  ├── Header (icon + back to /chat + history button)
  ├── PromptBar (user types what diagram they want)
  ├── TemplateGallery (pre-built starting templates)
  ├── DiagramCanvas (split: code editor left, rendered diagram right)
  │     ├── Mermaid code editor (Monaco-style textarea)
  │     └── Mermaid renderer (live preview, zoomable, pannable)
  ├── StylePanel (color themes, diagram direction, style presets)
  ├── ExportActions (PDF, PNG, SVG download buttons)
  └── HistoryPanel (slide-out, saved diagrams)
```

### New Files

| File | Purpose |
|------|---------|
| `src/pages/FlowBuilderPage.tsx` | Main page (follows ImaginePage pattern) |
| `src/components/flowbuilder/FlowPromptBar.tsx` | Prompt input with send button |
| `src/components/flowbuilder/FlowCanvas.tsx` | Split view: Mermaid code + live rendered diagram |
| `src/components/flowbuilder/FlowStylePanel.tsx` | Color picker, theme presets, direction controls |
| `src/components/flowbuilder/FlowTemplates.tsx` | Pre-built diagram templates (flowchart, sequence, ER, etc.) |
| `src/components/flowbuilder/FlowHistory.tsx` | History panel from analysis_history table |
| `src/components/flowbuilder/FlowExportActions.tsx` | Export to PDF, PNG, SVG |
| `src/components/flowbuilder/index.tsx` | Barrel exports |
| `src/services/flowbuilderApi.ts` | API service (calls edge function + CRUD on analysis_history) |
| `supabase/functions/flowbuilder-generate/index.ts` | Edge function: calls OpenRouter with 4 LLMs |

### Edge Function: `flowbuilder-generate`

- Accepts: `{ prompt, existingCode?, diagramType?, colorTheme? }`
- Uses OpenRouter with model rotation across the 4 specified LLMs:
  - `anthropic/claude-sonnet-4.6`
  - `anthropic/claude-opus-4.6`
  - `google/gemini-3.1-pro-preview`
  - `meta-llama/llama-3.1-8b-instruct`
- System prompt instructs the model to return valid Mermaid.js code for the requested diagram type
- Supports editing: user can pass existing Mermaid code + modification prompt
- Token cost: ~5,000 tokens per generation (text-only, no images)
- Saves result to `analysis_history` table with `tool = 'flowbuilder'`
- Deducts tokens from subscription

### Frontend: Diagram Rendering

- Use `mermaid` npm package for client-side rendering
- Split-view layout: left panel shows editable Mermaid code, right panel shows live rendered diagram
- User can manually edit code and re-render
- Zoom/pan controls on the diagram canvas
- Responsive: on mobile, code and diagram stack vertically

### Color & Style Customization

- Pre-built color themes (Dark, Light, Forest, Ocean, Sunset, Neon, Corporate, Pastel)
- Each theme maps to Mermaid theme config + custom CSS overrides
- User can pick custom node/edge colors via color picker
- Style presets for node shapes (rounded, sharp, hexagonal)
- After creating a diagram, user can prompt again to modify colors/layout with existing code context

### Templates

- 10-12 pre-built templates matching the diagram types (Flowchart, Use Case, Sequence, ER, Class, State, Mindmap, Gantt, Activity, Block)
- Clicking a template loads its Mermaid code and renders it
- User can then modify via prompt or manual code editing

### Export

- **PNG**: Render Mermaid SVG to canvas, export as PNG (any size user wants)
- **SVG**: Direct SVG download from Mermaid render
- **PDF**: Wrap SVG in a PDF using client-side jspdf

### History & Persistence

- Uses existing `analysis_history` table with `tool = 'flowbuilder'`
- `input_data`: `{ prompt, diagramType, colorTheme }`
- `result_data`: `{ mermaidCode, tokensUsed }`
- History panel shows saved diagrams with thumbnail previews
- User can reload, edit, re-save, or delete past diagrams

### Integration Points (existing codebase changes)

1. **`src/App.jsx`** — Add lazy import for `FlowBuilderPage` + protected route at `/flowbuilder`
2. **`src/components/aichat/ChatSidebar.tsx`** — Add FlowBuilder to `moreTools` array and collapsed dropdown (icon: `GitBranch` or `Workflow`, gradient: `from-violet-500 to-purple-600`)
3. **`src/components/aichat/MobileSidebar.tsx`** — Same addition to mobile tools list
4. **`src/components/Features.jsx`** — Add FlowBuilder card to landing page features
5. **`src/lib/translations.ts`** — Add translation keys for FlowBuilder

### NPM Dependencies

- `mermaid` (diagram rendering)
- `jspdf` (PDF export)

### Token Pricing

- 5,000 tokens per diagram generation (text-only LLM call)
- Editing/modifying existing diagrams: 3,000 tokens
- Free plan users get limited generations within their 15K token quota

### UI Design

- Icon: `Workflow` from lucide-react (matches the diagram/flow concept)
- Gradient: `from-violet-500 to-purple-600` (distinct from other tools)
- Futuristic glassmorphism header matching other Sorix tools
- Dark/light theme support via existing theme system
