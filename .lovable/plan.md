## Goal
Remove all Nango code from the project. Keep the existing manual/OAuth connection system at `/agent/connections` as the single place users link apps (Google via OAuth popup; Telegram/Facebook/LinkedIn/WhatsApp via paste-token forms — already a Claude-style "click → sign in / paste key → done" flow). Delete the `/agent/integrations` page entirely.

## Files to delete

**Edge functions** (also call `supabase--delete_edge_functions` for `nango-connect-start`, `nango-list-connections`, `nango-disconnect`, `nango-proxy`):
- `supabase/functions/nango-connect-start/`
- `supabase/functions/nango-list-connections/`
- `supabase/functions/nango-disconnect/`
- `supabase/functions/nango-proxy/`
- `supabase/functions/_shared/nango.ts`

**Frontend:**
- `src/pages/IntegrationsPage.tsx`
- `src/hooks/useIntegrations.ts`
- `src/components/integrations/integrationsCatalog.ts`
- `src/components/integrations/IntegrationCard.tsx`
- `src/components/cowork/ConnectorPanel.tsx` (only consumer of `useIntegrations` in cowork UI)

## Files to edit

1. **`src/App.jsx`** — remove `IntegrationsPage` lazy import and the `/agent/integrations` route.
2. **`src/components/cowork/CoWorkLayout.tsx`** — drop `useIntegrations`, the `syncFromNango` redirect-back effect, and the `<ConnectorPanel />` slot.
3. **`src/components/cowork/TaskMonitor.tsx`** — remove `<ConnectorPanel />` import/usage.
4. **`src/components/cowork/CommandCenter.tsx`** — remove `useIntegrations` import + usage; any "open Integrations" CTA points to `/agent/connections`.
5. **`supabase/functions/agent-router/index.ts`**:
   - Remove `import { nangoProxy }` and the `nango_proxy` entry from `UNIVERSAL_TOOLS`.
   - Remove the `nango_proxy` branch in `runUniversalTool` and `describeUniversal`.
   - Remove the `user_integrations` query and the "Connected providers (Nango)" line in the system prompt.
   - Update routing rules: only legacy OAuth tools (Gmail/Calendar/Drive/Telegram/Facebook/LinkedIn/WhatsApp) + `web_scrape` + `custom_http_call`. Tell the model to direct users to `/agent/connections` when a service isn't linked.
   - Remove `nango_proxy` from `route_decision.path` mapping.
6. **`mem://index.md`** — drop the "Integrations Hub — Nango" line; keep "Agent Connections" as the single source of truth.

## Database migration

```sql
DROP TABLE IF EXISTS public.user_integrations CASCADE;
```

`user_custom_integrations` (custom REST integrations) is unrelated to Nango and stays. `NANGO_SECRET_KEY` becomes unused — safe to leave; user can delete it manually from secrets later.

## Result for the user

- Single connections page at `/agent/connections` (unchanged UI).
- Slack / Notion / GitHub / Twitter / Instagram / etc. that were Nango-only are gone from the UI. They are listed on `/agent/connections` only as "coming soon" already, so users see no new dead state.
- Agent backend keeps working: legacy OAuth tools + Browserless `web_scrape` + the user's custom HTTP integrations.
- No new UI surface; matches the "Claude connectors" feel — pick app → sign in or paste token → connected.
