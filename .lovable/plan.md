## Manual Activation: Sorix Basic Plan — muzahidulislam.bd02@gmail.com

Confirmed via DB lookup:
- **User ID:** `706aae6a-5d1c-49b7-94f3-e9a76ee9f0fa`
- **Email:** muzahidulislam.bd02@gmail.com
- **Current subscription:** none (no row in `subscriptions` table)

The user paid **৳499 offline** for the Sorix Basic monthly plan. Since both `subscriptions` and `payment_history` tables block client-side INSERTs via RLS, this must be done through a SQL migration with service-role privileges.

### Migration to run

**1. Insert active subscription row** (`public.subscriptions`)
```sql
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
```

**2. Insert audit record into payment history** (`public.payment_history`)
```sql
INSERT INTO public.payment_history (
  user_id, subscription_id, transaction_id,
  payment_method, amount, currency,
  plan_id, billing_cycle, status,
  gateway_response
) VALUES (
  '706aae6a-5d1c-49b7-94f3-e9a76ee9f0fa',
  (SELECT id FROM public.subscriptions
     WHERE user_id = '706aae6a-5d1c-49b7-94f3-e9a76ee9f0fa'
     ORDER BY created_at DESC LIMIT 1),
  'OFFLINE-MANUAL-' || to_char(now(), 'YYYYMMDDHH24MISS'),
  'offline_manual', 499, 'BDT',
  'basic', 'monthly', 'completed',
  jsonb_build_object(
    'note', 'Manually activated by admin — offline cash payment of 499 BDT received',
    'activated_at', now()
  )
);
```

### Result for the user
- Plan: **Sorix Basic** (active)
- Billing cycle: monthly
- Period: today → today + 30 days (real dates, will display correctly in Subscription tab thanks to the live-data fix from the previous round)
- Payment History tab will show one completed ৳499 BDT entry with method "offline_manual"
- No code changes required — purely a one-time data operation.

Approve and I'll execute the migration.