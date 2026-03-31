

## Activate Premium Access for Two Users

Both users have been found in the database:
- **tynoh@vatek.asia** → `055b7624-33fc-4548-9088-0764bc09539f`
- **alex.hoang.cto.global@vatek.asia** → `722486b0-7c2e-480b-bf14-eeadc990bac2`

Neither has an active subscription currently.

### Action

Insert premium subscriptions for both users using a direct database insert:

```sql
INSERT INTO subscriptions (user_id, plan_id, status, tokens_used, amount, billing_cycle, current_period_start, current_period_end)
VALUES
  ('055b7624-33fc-4548-9088-0764bc09539f', 'premium', 'active', 0, 0, 'monthly', now(), now() + interval '1 year'),
  ('722486b0-7c2e-480b-bf14-eeadc990bac2', 'premium', 'active', 0, 0, 'monthly', now(), now() + interval '1 year');
```

This grants both users **Sorix Premium** (3M tokens, all AI models) for 1 year as a complimentary subscription.

