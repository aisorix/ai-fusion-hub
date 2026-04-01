

## Activate Premium Access for abel.tran@vatek.asia

User found in the database:
- **abel.tran@vatek.asia** → `0e90f220-67c2-41a7-9eaf-637421804c6b`
- No active subscription currently.

### Action

Insert a premium subscription using a direct database insert:

```sql
INSERT INTO subscriptions (user_id, plan_id, status, tokens_used, amount, billing_cycle, current_period_start, current_period_end)
VALUES
  ('0e90f220-67c2-41a7-9eaf-637421804c6b', 'premium', 'active', 0, 0, 'monthly', now(), now() + interval '1 year');
```

This grants **Sorix Premium** (3M tokens, all AI models) for 1 year as a complimentary subscription.

