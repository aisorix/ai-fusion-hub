-- Trusted server-side record of payment intents (plan_id/amount established at creation time)
CREATE TABLE IF NOT EXISTS public.payment_intents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gateway TEXT NOT NULL,
  external_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  plan_id TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BDT',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (gateway, external_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_intents TO authenticated;
GRANT ALL ON public.payment_intents TO service_role;

ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;

-- Users may read their own intents (clients never write — only service role / edge functions do)
CREATE POLICY "Users can view their own payment intents"
ON public.payment_intents FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Deny client-side payment intent create"
ON public.payment_intents FOR INSERT
TO authenticated
WITH CHECK (false);

CREATE POLICY "Deny client-side payment intent update"
ON public.payment_intents FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Deny client-side payment intent delete"
ON public.payment_intents FOR DELETE
TO authenticated
USING (false);

CREATE INDEX IF NOT EXISTS idx_payment_intents_user ON public.payment_intents(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_intents_lookup ON public.payment_intents(gateway, external_id);

-- Public marketing surface: approved reviews are world-readable
CREATE POLICY "Approved reviews are publicly readable"
ON public.reviews FOR SELECT
USING (status = 'approved');

GRANT SELECT ON public.reviews TO anon;

-- Token-based access for shared chats handled via SECURITY DEFINER function
-- get_shared_chat_by_token already exists. Ensure anon/authenticated can execute it.
GRANT EXECUTE ON FUNCTION public.get_shared_chat_by_token(text) TO anon, authenticated;

-- Lock down `currency` so end users can't modify it on their own subscription row
DROP POLICY IF EXISTS "Users can update their own token usage" ON public.subscriptions;

CREATE POLICY "Users can update their own token usage"
ON public.subscriptions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND NOT (plan_id IS DISTINCT FROM (SELECT s.plan_id FROM public.subscriptions s WHERE s.id = subscriptions.id))
  AND NOT (status IS DISTINCT FROM (SELECT s.status FROM public.subscriptions s WHERE s.id = subscriptions.id))
  AND NOT (billing_cycle IS DISTINCT FROM (SELECT s.billing_cycle FROM public.subscriptions s WHERE s.id = subscriptions.id))
  AND NOT (amount IS DISTINCT FROM (SELECT s.amount FROM public.subscriptions s WHERE s.id = subscriptions.id))
  AND NOT (currency IS DISTINCT FROM (SELECT s.currency FROM public.subscriptions s WHERE s.id = subscriptions.id))
  AND NOT (current_period_end IS DISTINCT FROM (SELECT s.current_period_end FROM public.subscriptions s WHERE s.id = subscriptions.id))
  AND NOT (current_period_start IS DISTINCT FROM (SELECT s.current_period_start FROM public.subscriptions s WHERE s.id = subscriptions.id))
);