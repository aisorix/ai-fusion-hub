## Goal

The Agent sidebar still shows the **old** connector list (Google, Facebook Page, LinkedIn, WhatsApp, Telegram from `CONNECTION_SERVICES`). That system is superseded by the new Nango-based Integrations Hub. Replace the panel so it shows the **new integration catalog** plus the user's own **custom integrations**, all manageable inline.

## Changes

### 1. Rewrite `src/components/cowork/ConnectorPanel.tsx`
- Drop `CONNECTION_SERVICES` / `ConnectDialog` / `useConnections` (old flow).
- Drive the list from `INTEGRATIONS` (Nango catalog) + `useIntegrations()` for connection status.
- For each item: icon, label, green check if connected, plug icon otherwise. Click connected → disconnect confirm; click disconnected → `startConnect(id)` (opens Nango Connect UI, same as `/agent/integrations`).
- Add a search input (filters catalog) and a "Manage all" link to `/agent/integrations`.
- Append a **"Custom Integrations"** section below the catalog listing rows from a new `user_custom_integrations` table, with a `+ Add custom` button opening a small dialog.

### 2. Custom integrations storage
New migration:
```sql
create table public.user_custom_integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  base_url text not null,
  auth_header text default 'Authorization',
  auth_scheme text default 'Bearer',
  api_key text not null,             -- stored encrypted-at-rest by PG; only readable via RLS by owner
  description text,
  created_at timestamptz default now()
);
alter table public.user_custom_integrations enable row level security;
-- owner-only select/insert/update/delete policies
```

### 3. New components / hook
- `src/components/integrations/CustomIntegrationDialog.tsx` — form (name, base URL, auth header, scheme, key, description).
- `src/hooks/useCustomIntegrations.ts` — list / create / delete via Supabase client.

### 4. Surface custom integrations on `/agent/integrations`
Add a "Your custom integrations" section above the catalog grid, reusing the same dialog and hook so the Hub and the sidebar stay in sync.

### 5. Wire custom integrations into the agent
Extend `supabase/functions/agent-router/index.ts`:
- Add a `custom_http_call` tool that accepts `{ integration_id, method, path, query, body }`.
- Server-side: load the row by `user_id + id`, build `${base_url}${path}`, attach `${auth_header}: ${auth_scheme} ${api_key}`, return JSON.
- Inject the user's custom integration names + descriptions into the system prompt so the LLM knows what's available.

### 6. Cleanup
Leave the old `/agent/connections` route + `ConnectDialog` / `connectionConfig.ts` files in place for now (still imported elsewhere) but remove their entry point from the agent sidebar. We can delete them in a follow-up once nothing references them.

## Result

The sidebar in Command Center will show the same provider catalog as the Integrations Hub (Gmail, GitHub, Notion, Slack, LinkedIn, WhatsApp, Telegram, …) with live connect/disconnect, plus the user's own custom REST integrations — and the agent can actually call any of them.
