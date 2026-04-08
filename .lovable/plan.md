

## Activate Premium Subscription for shahadat6640@gmail.com

### User Found
- **Email**: shahadat6640@gmail.com
- **User ID**: `cc1e9f1c-6e4c-43d0-8abe-f11ffc92dc3c`
- **Current subscription**: None

### Action
Insert a new row into the `subscriptions` table granting 1-year Premium access (3M tokens), matching the pattern used for other complimentary accounts.

### Database Migration
```sql
INSERT INTO public.subscriptions (user_id, plan_id, status, billing_cycle, amount, currency, tokens_used, current_period_start, current_period_end)
VALUES (
  'cc1e9f1c-6e4c-43d0-8abe-f11ffc92dc3c',
  'premium',
  'active',
  'monthly',
  0,
  'BDT',
  0,
  now(),
  now() + interval '1 year'
);
```

Single migration, no code changes needed.

