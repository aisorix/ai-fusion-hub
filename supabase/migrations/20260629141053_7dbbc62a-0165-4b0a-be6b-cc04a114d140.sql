CREATE OR REPLACE FUNCTION public.prevent_subscription_self_upgrade()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _role text;
BEGIN
  -- Detect service role via multiple mechanisms (PostgREST versions vary)
  _role := COALESCE(
    current_setting('request.jwt.claim.role', true),
    (current_setting('request.jwt.claims', true)::jsonb ->> 'role'),
    ''
  );

  IF _role = 'service_role'
     OR current_user IN ('service_role', 'postgres', 'supabase_admin') THEN
    RETURN NEW;
  END IF;

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
$function$;