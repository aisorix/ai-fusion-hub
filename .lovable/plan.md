

## Fix FlowBuilder Navigation in Sidebars

### Problem
The FlowBuilder tool appears in both `ChatSidebar.tsx` and `MobileSidebar.tsx` tool lists, but clicking it does nothing because the `onClick` handlers only have `if` statements for health, agro, legends, imagine, and deck — **flowbuilder is missing**.

### Changes

**1. `src/components/aichat/ChatSidebar.tsx`** (around line 510)
- Add: `if (tool.id === "flowbuilder") navigate("/flowbuilder");`

**2. `src/components/aichat/MobileSidebar.tsx`** (around line 293)
- Add: `if (tool.id === 'flowbuilder') { navigate('/flowbuilder'); onClose(); }`

Two one-line additions — one per file.

