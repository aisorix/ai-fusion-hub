
-- 1) Hide sensitive token/key columns from end users (service_role retains full access)
REVOKE SELECT (access_token) ON public.project_github FROM authenticated, anon;
REVOKE SELECT (access_token, refresh_token) ON public.user_connections FROM authenticated, anon;
REVOKE SELECT (api_key) ON public.user_custom_integrations FROM authenticated, anon;

-- 2) Move chat_conversations.internal_notes to a separate admin-only table
CREATE TABLE IF NOT EXISTS public.chat_conversation_internal_notes (
  conversation_id uuid PRIMARY KEY REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.chat_conversation_internal_notes TO authenticated;
GRANT ALL ON public.chat_conversation_internal_notes TO service_role;
ALTER TABLE public.chat_conversation_internal_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage internal notes"
  ON public.chat_conversation_internal_notes
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

-- Migrate any existing internal_notes
INSERT INTO public.chat_conversation_internal_notes (conversation_id, notes)
  SELECT id, internal_notes
    FROM public.chat_conversations
   WHERE internal_notes IS NOT NULL AND length(btrim(internal_notes)) > 0
  ON CONFLICT (conversation_id) DO NOTHING;

ALTER TABLE public.chat_conversations DROP COLUMN IF EXISTS internal_notes;

-- 3) Subscriptions: drop client-side UPDATE policy; add safe increment RPC
DROP POLICY IF EXISTS "Users can update their own token usage" ON public.subscriptions;

CREATE OR REPLACE FUNCTION public.increment_tokens_used(_amount integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _new integer;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  IF _amount IS NULL OR _amount < 0 OR _amount > 1000000 THEN
    RAISE EXCEPTION 'invalid amount';
  END IF;
  UPDATE public.subscriptions
     SET tokens_used = COALESCE(tokens_used, 0) + _amount,
         updated_at = now()
   WHERE user_id = _uid
   RETURNING tokens_used INTO _new;
  RETURN _new;
END;
$$;
GRANT EXECUTE ON FUNCTION public.increment_tokens_used(integer) TO authenticated;

-- 4) Reviews: allow public read of approved reviews
DROP POLICY IF EXISTS "Anyone can view approved reviews" ON public.reviews;
CREATE POLICY "Anyone can view approved reviews"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (status = 'approved');

-- 5) Explicit deny-for-clients on suppression/unsubscribe tables
DROP POLICY IF EXISTS "Deny client read of unsubscribe tokens" ON public.email_unsubscribe_tokens;
CREATE POLICY "Deny client read of unsubscribe tokens"
  ON public.email_unsubscribe_tokens
  AS RESTRICTIVE
  FOR SELECT
  TO anon, authenticated
  USING (false);

DROP POLICY IF EXISTS "Deny client read of suppressed emails" ON public.suppressed_emails;
CREATE POLICY "Deny client read of suppressed emails"
  ON public.suppressed_emails
  AS RESTRICTIVE
  FOR SELECT
  TO anon, authenticated
  USING (false);
