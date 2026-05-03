# Fix integration redirect and post-connect sync for Sorix Agent

## What’s broken
After a user connects an integration, the OAuth flow completes successfully, but the app does not return them cleanly to the working agent experience.

I found two concrete problems in the current implementation:

1. `useIntegrations.startConnect()` does not send a return URL, so the backend falls back to a hardcoded redirect:
   - `https://aisorix.com/agent/integrations`
   - This breaks preview flows and always sends the user away from the current page instead of back to `/agent`.

2. Even after OAuth succeeds, the app never calls the sync function that marks the integration as `connected` in the database:
   - `supabase/functions/nango-list-connections/index.ts` exists for this
   - but nothing in the frontend calls it
   - so the row stays `pending`, and the agent still treats the integration as unavailable

That explains the behavior you described: the connection dialog succeeds, but when you return to the agent it still doesn’t work.

## Plan

### 1. Preserve the real return destination
Update the integration connect flow so it sends the current page as the return URL instead of relying on the hardcoded domain.

Planned changes:
- In `src/hooks/useIntegrations.ts`, send `returnUrl` with the connect request
- Use the current origin/path so preview stays on preview and published stays on published
- When the user starts from `/agent`, return to `/agent`
- When the user starts from `/agent/integrations`, return there

Result:
- No more forced redirect to `aisorix.com`
- The user comes back to the same experience they started from

### 2. Sync the completed OAuth connection immediately after redirect
Wire the frontend to call the existing connection-sync edge function when the app comes back with `?connected=...`.

Planned changes:
- Add a frontend call to `nango-list-connections`
- Trigger it after the OAuth return lands back in the app
- After sync succeeds, refresh `user_integrations`
- Remove the query param so the page doesn’t re-run the sync on refresh

Result:
- The connection changes from `pending` to `connected`
- The agent can actually use the newly linked provider

### 3. Make the return flow work on both Agent and Integrations pages
Right now only `IntegrationsPage.tsx` checks for `connected` query params, and `/agent` does not.

Planned changes:
- Move the OAuth-return handling into the shared integrations hook or another shared layer used by both pages
- Ensure the sync/toast/query cleanup works whether the user started from:
  - `/agent`
  - `/agent/integrations`

Result:
- Connect from the inline Agent integrations panel and return directly to Agent
- Connect from the full integrations page and return there too

### 4. Harden the backend redirect builder
Improve the backend connect-start function so it builds the callback URL safely.

Planned changes:
- In `supabase/functions/nango-connect-start/index.ts`, stop defaulting to a single production URL for normal flows
- Build the final redirect URL with the URL API so `connected=provider` is appended safely
- Keep a reasonable fallback only if no valid return URL is provided

Result:
- More reliable redirects across preview, published, and custom-domain environments

## Technical details

Files likely to change:
- `src/hooks/useIntegrations.ts`
- `src/pages/IntegrationsPage.tsx`
- `src/components/cowork/CommandCenter.tsx` or shared return handling
- `supabase/functions/nango-connect-start/index.ts`

Likely implementation shape:
```text
User clicks Connect
-> frontend sends provider + returnUrl=current page
-> backend creates OAuth session with that returnUrl
-> provider flow completes
-> app returns to same page with ?connected=provider
-> frontend calls nango-list-connections
-> DB row becomes connected
-> UI refreshes
-> agent can use the integration immediately
```

## Verification

I’ll verify these cases after implementation:
1. Connect Gmail from `/agent` in preview and confirm it returns to `/agent`
2. Connect Gmail from `/agent/integrations` and confirm it returns there
3. Confirm the DB-backed integration status changes from `pending` to `connected`
4. Confirm the Agent no longer says the provider is unconnected right after a successful OAuth flow
5. Confirm preview and published domains both keep users on the correct environment
