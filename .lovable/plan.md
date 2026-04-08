
## Fix FlowBuilder preview errors for old and new diagrams

### Root cause
From the current code:
- The backend now prevents one common Mermaid issue (`classDef default`), but that only affects newly generated code.
- Previously saved diagrams in history still contain older invalid Mermaid syntax.
- `FlowCanvas.tsx` renders the raw code directly with `mermaid.render(...)` and has no cleanup/recovery layer, so legacy diagrams still fail in preview.
- When history items are loaded in `FlowBuilderPage.tsx`, the raw saved code is inserted as-is, so old broken diagrams keep breaking.

### Targeted fix only
I will keep the scope strictly to FlowBuilder preview reliability and not change unrelated UI or behavior.

### Implementation plan

1. **Add a Mermaid sanitizing layer**
   - Create a small shared helper for FlowBuilder that normalizes known legacy AI mistakes before preview/render.
   - Include fixes such as:
     - `classDef default` -> `classDef baseStyle`
     - `class <ids> default;` -> `class <ids> baseStyle;`
     - remove accidental code fences if present
     - normalize a few common malformed AI outputs without changing valid diagrams

2. **Use sanitized code in preview rendering**
   - Update `src/components/flowbuilder/FlowCanvas.tsx` so Mermaid renders the sanitized version instead of the raw textarea value.
   - Keep the existing error UI, but only show errors after the cleanup pass has already been tried.

3. **Auto-repair legacy history items when opened**
   - Update `src/pages/FlowBuilderPage.tsx` so when a user loads an older saved diagram from history, the code is passed through the same sanitizer before being placed into the editor.
   - This fixes previously created diagrams immediately instead of forcing users to manually edit broken syntax.

4. **Keep editor and preview consistent**
   - If the sanitizer changes the code, sync the repaired version back into the code editor so users see exactly what is being rendered.
   - Avoid render loops by only updating when the normalized code is actually different.

5. **Do not change anything else**
   - No token logic changes
   - No export redesign
   - No landing page changes
   - No database changes
   - No route/layout changes

### Files to update
- `src/components/flowbuilder/FlowCanvas.tsx`
- `src/pages/FlowBuilderPage.tsx`
- optionally a small shared helper such as `src/lib/flowbuilderMermaid.ts` for clean reuse

### Expected result
- Previously created diagrams from history preview correctly again
- New diagrams remain protected against the same Mermaid syntax issue
- Users only see preview errors for truly invalid Mermaid, not for known legacy generator mistakes

### Technical details
Best approach is a **shared normalization function** used in both:
- history loading
- live preview rendering

That is better than fixing only the backend, because backend fixes cannot repair diagrams already saved in history.
