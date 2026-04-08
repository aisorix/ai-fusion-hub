

## Fix: Mermaid Syntax Errors from AI-Generated Code

### Root Cause

The AI models sometimes generate invalid Mermaid syntax — in this case, `classDef default fill:#000` where `default` is a **reserved keyword** in Mermaid v11 and cannot be used as a class name. The system prompt doesn't warn the AI about Mermaid-specific pitfalls.

### Fix

**`supabase/functions/flowbuilder-generate/index.ts`** — Update the `SYSTEM_PROMPT` to add Mermaid v11 compatibility rules:

Add these rules to the system prompt:
```
- NEVER use "default" as a classDef name — it is a reserved keyword in Mermaid. Use names like "base", "primary", "nodeStyle" instead.
- For styling nodes, prefer inline style syntax: style id1 fill:#000,stroke:#fff
- Ensure all node IDs are simple alphanumeric (no spaces or special chars in IDs)
- When using classDef, always use valid class names (not reserved words like "default", "class", "style")
- Test that arrow syntax is correct: use --> for solid arrows, -.-> for dotted arrows
```

Also add a **post-processing cleanup** step (around line 155, after `mermaidCode` is extracted) to automatically fix common issues:
```typescript
// Fix common Mermaid syntax issues
mermaidCode = mermaidCode
  .replace(/classDef\s+default\s+/gi, 'classDef baseStyle ')
  .replace(/class\s+(\S+)\s+default\s*;/gi, 'class $1 baseStyle;');
```

### Changes Summary
1. **System prompt**: Add Mermaid v11 reserved keyword warnings (line ~27-36)
2. **Post-processing**: Auto-fix `classDef default` → `classDef baseStyle` before returning code (after line ~155)

Single file: `supabase/functions/flowbuilder-generate/index.ts`

