

## Activate Premium for mdrakib.alpha@gmail.com

### User Found
- **Email**: mdrakib.alpha@gmail.com
- **User ID**: `d1178ecd-7796-4675-aac3-8e8e627871c5`
- **Current subscription**: None

### Action
Insert a new active premium subscription (1 year) into the `subscriptions` table via a database migration:

- **plan_id**: `premium`
- **status**: `active`
- **tokens_used**: `0`
- **amount**: `0` (complimentary)
- **billing_cycle**: `yearly`
- **current_period_start**: now
- **current_period_end**: 1 year from now

This follows the same complimentary access pattern used for other team/test accounts.

