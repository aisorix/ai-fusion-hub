-- 1) Fix SECURITY DEFINER view (run as querying user, not creator)
ALTER VIEW public.reviews_public SET (security_invoker = on);

-- 2) Remove announcements from Realtime publication (no per-user channel scoping; use get_active_announcements RPC instead)
ALTER PUBLICATION supabase_realtime DROP TABLE public.announcements;

-- 3) Hide sensitive token / key columns from client roles. Edge functions use service_role and remain unaffected.
REVOKE SELECT (access_token) ON public.project_github FROM anon, authenticated;
REVOKE SELECT (access_token, refresh_token) ON public.user_connections FROM anon, authenticated;
REVOKE SELECT (api_key) ON public.user_custom_integrations FROM anon, authenticated;