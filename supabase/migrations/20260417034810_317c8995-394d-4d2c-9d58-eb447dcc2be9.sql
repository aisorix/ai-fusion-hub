-- Fix monthly subscriptions that were manually inserted with 1-year duration
UPDATE public.subscriptions
SET current_period_end = current_period_start + INTERVAL '1 month'
WHERE billing_cycle = 'monthly'
  AND current_period_end > current_period_start + INTERVAL '2 months';

-- Align default to 1 month (matches default billing_cycle = 'monthly')
ALTER TABLE public.subscriptions
ALTER COLUMN current_period_end SET DEFAULT (now() + INTERVAL '1 month');