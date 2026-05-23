
DROP POLICY IF EXISTS "Users can update their own token usage" ON public.subscriptions;

CREATE POLICY "Users can update their own token usage"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND plan_id              IS NOT DISTINCT FROM (SELECT s.plan_id              FROM public.subscriptions s WHERE s.id = subscriptions.id)
  AND status               IS NOT DISTINCT FROM (SELECT s.status               FROM public.subscriptions s WHERE s.id = subscriptions.id)
  AND billing_cycle        IS NOT DISTINCT FROM (SELECT s.billing_cycle        FROM public.subscriptions s WHERE s.id = subscriptions.id)
  AND amount               IS NOT DISTINCT FROM (SELECT s.amount               FROM public.subscriptions s WHERE s.id = subscriptions.id)
  AND current_period_end   IS NOT DISTINCT FROM (SELECT s.current_period_end   FROM public.subscriptions s WHERE s.id = subscriptions.id)
  AND current_period_start IS NOT DISTINCT FROM (SELECT s.current_period_start FROM public.subscriptions s WHERE s.id = subscriptions.id)
);

ALTER FUNCTION public.enqueue_email(text, jsonb)                       SET search_path = public, pgmq, extensions;
ALTER FUNCTION public.read_email_batch(text, integer, integer)         SET search_path = public, pgmq, extensions;
ALTER FUNCTION public.delete_email(text, bigint)                       SET search_path = public, pgmq, extensions;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb)           SET search_path = public, pgmq, extensions;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policy
    WHERE polrelid = 'realtime.messages'::regclass
      AND polname = 'Authenticated users can receive realtime broadcasts'
  ) THEN
    EXECUTE 'DROP POLICY "Authenticated users can receive realtime broadcasts" ON realtime.messages';
  END IF;
END $$;
