
-- Revoke client read access to sensitive columns; admins/edge functions read via service_role

REVOKE SELECT (internal_notes, guest_token) ON public.chat_conversations FROM anon, authenticated;
REVOKE SELECT (access_token) ON public.project_github FROM anon, authenticated;
REVOKE SELECT (access_token, refresh_token) ON public.user_connections FROM anon, authenticated;
REVOKE SELECT (api_key) ON public.user_custom_integrations FROM anon, authenticated;

-- Remove admin-only tables from realtime publication to prevent any chance of broadcast leakage
ALTER PUBLICATION supabase_realtime DROP TABLE public.ai_events;
ALTER PUBLICATION supabase_realtime DROP TABLE public.feature_flags;
