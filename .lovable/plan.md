

# Projects Enhancement: GitHub Integration, Performance, and New Project UX

## 1. GitHub Connection for Project Files

Allow users to connect a GitHub repository to any project so that file changes automatically sync.

### How it works
- Add a "Connect GitHub" button in the project chat header and in project settings
- Users authenticate via GitHub OAuth (using a new edge function)
- Once connected, whenever a user creates/edits/deletes a file in the project, the change is pushed to the linked GitHub repo
- Store GitHub connection info (repo name, access token, branch) in a new `project_github` database table

### Database
- New table `project_github`: `id`, `project_id`, `user_id`, `repo_owner`, `repo_name`, `branch`, `access_token` (encrypted), `connected_at`
- RLS: owner-only access

### Edge Function: `github-sync`
- Handles OAuth callback to exchange code for access token
- Provides endpoints: connect repo, push file changes (create/update/delete via GitHub API), list repos
- Called automatically from the frontend after file operations

### Frontend Changes
- Add GitHub icon button in project chat header (next to file panel toggle)
- New `GitHubConnectModal` component: lists user's repos, allows selecting one + branch
- After connecting, show a small GitHub badge on the project card
- Hook into `useProjectFiles` -- after successful create/update/delete, call the sync edge function in the background
- Show toast notifications for sync success/failure

---

## 2. Performance Improvements

The Projects tab and buttons feel slow due to heavy animations and unnecessary re-renders.

### Changes
- **Remove Framer Motion animations** from the project list items and modal transitions on mobile (keep desktop subtle). Replace `motion.div` with plain `div` for project cards
- **Lazy load** the `ProjectFileExplorer` component using `React.lazy()` so it's only loaded when the file panel is opened
- **Memoize** project list items with `React.memo` to prevent re-renders when chat state changes
- **Debounce** the modal open/close to prevent double-click lag
- **Remove `AnimatePresence`** wrapper from file tree folder expand/collapse -- use CSS transitions instead
- **Use `useCallback`** for all click handlers in ProjectsModal that are currently inline arrow functions
- **Optimize `SyntaxHighlighter`**: wrap in `React.memo` and only re-render when content or language changes

### Files affected
- `src/components/aichat/ProjectsModal.tsx` -- memoize cards, remove heavy animations
- `src/components/aichat/project/ProjectFileExplorer.tsx` -- lazy load, CSS transitions for folders

---

## 3. New Project Creation UX -- "What do you want to build?"

Replace the current plain form with a guided project creation flow that lets users pick a project type first.

### New Flow
1. User clicks "New Project" and sees a grid of project type cards:
   - **Web App** -- "Build a website or web application" (icon: Globe)
   - **API / Backend** -- "Design APIs and server logic" (icon: Server)
   - **Mobile App** -- "Plan and build mobile interfaces" (icon: Smartphone)
   - **Data Analysis** -- "Analyze data and build dashboards" (icon: BarChart3)
   - **Automation** -- "Create workflows and scripts" (icon: Workflow)
   - **Other** -- "Start with a blank project" (icon: Sparkles)

2. After selecting a type, the form slides to step 2 with the name, description, model, icon, and color fields (existing form, now pre-filled with a relevant description placeholder based on the type)

3. The selected type is stored in the `projects` table as a new `project_type` column

### Database
- Add `project_type` column (text, default 'other') to `projects` table

### UI Design
- Step 1: Full-width grid of 6 cards with large icons, title, and one-line description. Glassmorphism style with hover glow effect matching the project's design system
- Step 2: Existing creation form with a breadcrumb showing "Select Type > Configure"
- Back button to return to type selection
- Smooth slide transition between steps (CSS transform, not Framer Motion for speed)

### Files affected
- `src/components/aichat/ProjectsModal.tsx` -- new two-step create flow
- `src/hooks/useProjectAI.ts` -- pass `projectType` to `createProject`
- Database migration for `project_type` column

---

## Technical Summary

| Area | Files | Changes |
|------|-------|---------|
| GitHub Sync | New edge function `github-sync`, new table `project_github`, new `GitHubConnectModal` component, updates to `useProjectFiles` | OAuth flow, file sync on save |
| Performance | `ProjectsModal.tsx`, `ProjectFileExplorer.tsx` | Remove heavy animations, memoize, lazy load, CSS transitions |
| New Project UX | `ProjectsModal.tsx`, `useProjectAI.ts`, DB migration | Two-step creation with project type selection grid |

