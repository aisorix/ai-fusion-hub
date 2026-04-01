

## Activate Pro Access for piashmahamud619@gmail.com

User found in the database:
- **piashmahamud619@gmail.com** → `7c670dc2-d4d5-45e5-8d69-99753d084ea2`
- No active subscription currently.

### Action

Insert a pro subscription using a direct database insert:

```sql
INSERT INTO subscriptions (user_id, plan_id, status, tokens_used, amount, billing_cycle, current_period_start, current_period_end)
VALUES
  ('7c670dc2-d4d5-45e5-8d69-99753d084ea2', 'pro', 'active', 0, 0, 'monthly', now(), now() + interval '1 year');
```

This grants **Sorix Pro** (1.5M tokens, Pro-tier AI models) for 1 year as a complimentary subscription.

