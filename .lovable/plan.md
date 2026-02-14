
# Fix GitHub Integration: OAuth + Auto-Create Repository

## Problems Identified

1. **404 Error on GitHub OAuth**: The frontend has a hardcoded placeholder `GITHUB_CLIENT_ID = 'Ov23liXXXXXXXXXX'` that doesn't match your real GitHub OAuth App. GitHub returns a 404 because it can't find that client ID.

2. **Flow should auto-create repos**: Instead of listing existing repos and asking the user to pick one, the flow should automatically create a new repository (named after the project) on the user's GitHub account and push all existing project files to it.

---

## Solution

### Step 1: Fix OAuth Client ID (Frontend)

Instead of hardcoding the client ID, fetch it from the edge function. Add a new `get_client_id` action to the edge function that returns `GITHUB_CLIENT_ID` from secrets, and update the frontend to fetch it before redirecting to GitHub.

**Files changed:**
- `src/hooks/useGitHubSync.ts` -- Remove hardcoded placeholder, add `fetchClientId` that calls the edge function, update `getOAuthUrl` to use the fetched ID
- `src/components/aichat/GitHubConnectModal.tsx` -- Call `fetchClientId` on mount, show loading state until ready

### Step 2: Auto-Create Repository (Edge Function)

Add a new `create_repo` action to the `github-sync` edge function that:
1. Creates a new GitHub repository using the GitHub API (`POST /user/repos`)
2. Pushes all project files to the new repo (fetches files from `project_files` table, then uses GitHub Contents API to create each file)
3. Saves the connection in `project_github` table
4. Returns the connection data

**File changed:** `supabase/functions/github-sync/index.ts`

### Step 3: Simplify the Modal Flow (Frontend)

Change the post-authorization flow:
- After OAuth callback, instead of showing a repo picker, show a "Create Repository" form with:
  - Pre-filled repo name (from project name, sanitized to valid GitHub repo name)
  - Option for public/private
  - A "Create & Push" button
- On click, call the new `create_repo` action which creates the repo and pushes all files
- Show progress indicator while files are being pushed
- Jump to "connected" step when done

**File changed:** `src/components/aichat/GitHubConnectModal.tsx`

---

## Technical Details

### Edge Function Changes (`github-sync/index.ts`)

New actions added:

```text
get_client_id --> Returns GITHUB_CLIENT_ID from env (no auth needed for this action)

create_repo --> 
  1. POST https://api.github.com/user/repos with { name, private, auto_init: true }
  2. Fetch all project_files from DB for the project
  3. For each non-folder file, PUT to GitHub Contents API
  4. Save connection to project_github table
  5. Return connection data
```

### Frontend Hook Changes (`useGitHubSync.ts`)

```text
- Remove GITHUB_CLIENT_ID constant
- Add state: clientId (fetched from edge function)
- Add fetchClientId() -- calls get_client_id action
- Update getOAuthUrl() to use fetched clientId
- Add createRepo(repoName, isPrivate, token) -- calls create_repo action
```

### Modal Changes (`GitHubConnectModal.tsx`)

```text
Steps: auth --> create --> pushing --> connected

auth: "Authorize with GitHub" button (fetches client ID first)
create: Form with repo name + public/private toggle + "Create & Push" button  
pushing: Loading spinner with "Creating repository and pushing files..."
connected: Success view with repo link + disconnect button
```

### Flow Diagram

```text
User clicks "Authorize with GitHub"
  --> Frontend fetches client ID from edge function
  --> Redirects to GitHub OAuth with correct client ID
  --> User authorizes
  --> Callback returns to /chat with code
  --> Edge function exchanges code for access token
  --> Modal shows "Create Repository" form
  --> User clicks "Create & Push"
  --> Edge function creates repo on GitHub
  --> Edge function pushes all project files to repo
  --> Connection saved to database
  --> Modal shows "Connected!" with repo link
```
