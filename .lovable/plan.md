

## Activate Premium Access for kwan.nguyen@vatek.asia

User found in the database:
- **kwan.nguyen@vatek.asia** → `7a236cac-2778-4c6d-a527-cc9674206c48`
- No active subscription currently.

### Action

Insert a premium subscription using a direct database insert:

```sql
INSERT INTO subscriptions (user_id, plan_id, status, tokens_used, amount, billing_cycle, current_period_start, current_period_end)
VALUES
  ('7a236cac-2778-4c6d-a527-cc9674206c48', 'premium', 'active', 0, 0, 'monthly', now(), now() + interval '1 year');
```

This grants **Sorix Premium** (3M tokens, all AI models) for 1 year as a complimentary subscription.

