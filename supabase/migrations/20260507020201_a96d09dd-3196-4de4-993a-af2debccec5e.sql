
-- 1. SHARED_CHATS: Remove public SELECT, replace with token-based RPC
DROP POLICY IF EXISTS "Anyone can view shared chats by token" ON public.shared_chats;

CREATE OR REPLACE FUNCTION public.get_shared_chat_by_token(_token text)
RETURNS TABLE (
  id uuid,
  title text,
  chat_data jsonb,
  owner_id uuid,
  share_token text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, title, chat_data, owner_id, share_token, created_at, updated_at
  FROM public.shared_chats
  WHERE share_token = _token
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_shared_chat_by_token(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_shared_chat_by_token(text) TO anon, authenticated;

-- 2. SUBSCRIPTIONS: restrict UPDATE to tokens_used only via trigger
CREATE OR REPLACE FUNCTION public.prevent_subscription_self_upgrade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role to do anything
  IF current_setting('request.jwt.claim.role', true) = 'service_role' THEN
    RETURN NEW;
  END IF;

  -- For end users, only tokens_used (and updated_at) may change
  IF NEW.plan_id IS DISTINCT FROM OLD.plan_id
     OR NEW.status IS DISTINCT FROM OLD.status
     OR NEW.user_id IS DISTINCT FROM OLD.user_id
     OR NEW.current_period_start IS DISTINCT FROM OLD.current_period_start
     OR NEW.current_period_end IS DISTINCT FROM OLD.current_period_end
     OR NEW.amount IS DISTINCT FROM OLD.amount
     OR NEW.currency IS DISTINCT FROM OLD.currency
     OR NEW.billing_cycle IS DISTINCT FROM OLD.billing_cycle
  THEN
    RAISE EXCEPTION 'Only tokens_used may be modified by end users on subscriptions';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS subscriptions_restrict_user_update ON public.subscriptions;
CREATE TRIGGER subscriptions_restrict_user_update
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.prevent_subscription_self_upgrade();

-- 3. USER_ROLES: explicit deny INSERT/UPDATE/DELETE for non-admins
CREATE POLICY "Only admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 4. Revoke EXECUTE from anon/authenticated on internal SECURITY DEFINER functions (triggers/internal)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_conversation_on_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_project_on_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_subscription_self_upgrade() FROM PUBLIC, anon, authenticated;
