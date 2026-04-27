-- 1. Activate Basic plan subscription (1 month)
INSERT INTO public.subscriptions (
  user_id, plan_id, status, billing_cycle,
  amount, currency,
  current_period_start, current_period_end,
  tokens_used
) VALUES (
  '706aae6a-5d1c-49b7-94f3-e9a76ee9f0fa',
  'basic', 'active', 'monthly',
  499, 'BDT',
  now(), now() + interval '30 days',
  0
);

-- 2. Record the offline payment in payment history
INSERT INTO public.payment_history (
  user_id, subscription_id, transaction_id,
  payment_method, amount, currency,
  plan_id, billing_cycle, status,
  gateway_response
) VALUES (
  '706aae6a-5d1c-49b7-94f3-e9a76ee9f0fa',
  (SELECT id FROM public.subscriptions
     WHERE user_id = '706aae6a-5d1c-49b7-94f3-e9a76ee9f0fa'
       AND status = 'active'
     ORDER BY created_at DESC LIMIT 1),
  'OFFLINE-MANUAL-' || to_char(now(), 'YYYYMMDDHH24MISS'),
  'offline_manual', 499, 'BDT',
  'basic', 'monthly', 'completed',
  jsonb_build_object(
    'note', 'Manually activated by admin — offline cash payment of 499 BDT received',
    'activated_at', now()
  )
);