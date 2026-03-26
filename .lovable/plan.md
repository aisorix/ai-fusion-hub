

## Rename "Sorix Co-Work" to "Sorix Agent" + Update Slogan

Simple text replacement across 6 files.

### Changes

**1. `src/components/cowork/CoWorkLayout.tsx`**
- "Sorix Co-Work" → "Sorix Agent"
- "AI Agent Workspace" → "Your Tasks, Handled by Intelligence."

**2. `src/components/cowork/CommandCenter.tsx`**
- "Sorix Co-Work" → "Sorix Agent" (both en/bn)

**3. `src/components/aichat/ChatSidebar.tsx`**
- "Sorix Co-Work" → "Sorix Agent"

**4. `src/components/aichat/MobileSidebar.tsx`**
- "Sorix Co-Work" → "Sorix Agent"

**5. `src/pages/CoWorkPage.tsx`**
- SEO title: "Sorix Agent | AI Agent Workspace | AI Sorix"
- Description updated to include the new slogan

**6. `supabase/functions/cowork-agent/index.ts`**
- System prompt: "Sorix Co-Work Agent" → "Sorix Agent"
- X-Title header: "AI Sorix Co-Work" → "AI Sorix Agent"

