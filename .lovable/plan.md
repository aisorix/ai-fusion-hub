

## Add "More Tools" Full Page

### What
When users click "More Tools" in the sidebar, instead of expanding inline, navigate to a dedicated `/tools` page that displays all tools in a polished grid layout with a "More tools coming soon" section. Each tool card navigates to its respective page, matching existing sidebar behavior.

### New File: `src/pages/ToolsPage.tsx`
- Full-page layout with header showing back button (to `/chat`) and title "Sorix Tools"
- Grid of tool cards (responsive: 1 col mobile, 2 col tablet, 3 col desktop)
- Each card shows: gradient icon, tool name, description, FREE badge where applicable
- Cards are clickable and navigate to the tool's route (`/health`, `/agro`, `/deck`, `/imagine`, `/legends`, `/flowbuilder`, `/agent`)
- "Coming Soon" section at the bottom with placeholder cards for future tools (e.g., Sorix Code, Sorix Translate, Sorix Music) shown with reduced opacity and a "Coming Soon" badge
- Styled consistently with existing app theme (bg-background, text-foreground, card styling)

### Changes

**`src/App.jsx`**
- Add lazy import for `ToolsPage`
- Add protected route: `/tools` -> `<ToolsPage />`

**`src/components/aichat/ChatSidebar.tsx`**
- Change "More Tools" button (line 480-491): instead of toggling `showMoreTools` state, navigate to `/tools`
- Keep the inline expanded tool list as-is for backward compatibility, but the main button now navigates
- In collapsed sidebar (line 310-337): change the Sparkles button to navigate to `/tools` instead of opening a dropdown

**`src/components/aichat/MobileSidebar.tsx`**
- Change "More Tools" button (line 272-279): navigate to `/tools` and close sidebar instead of toggling inline list

### Tool List (same data as sidebar)
1. Sorix Health - `/health` - Stethoscope - emerald/teal gradient - FREE
2. Sorix Agent - `/agent` - Bot - blue/indigo gradient
3. Sorix Agro - `/agro` - Leaf - green/lime gradient - FREE
4. Sorix Legends - `/legends` - Crown - blue/cyan gradient
5. Sorix Deck - `/deck` - Presentation - cyan/blue gradient
6. Sorix FlowBuilder - `/flowbuilder` - Sparkles - violet/purple gradient
7. Sorix Imagine - `/imagine` - Palette - cyan/blue gradient

### Coming Soon Placeholders
- Sorix Code (Code icon) - "AI code assistant"
- Sorix Translate (Languages icon) - "AI translation tool"
- Sorix Music (Music icon) - "AI music generator"

