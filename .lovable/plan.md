## Goal

Trigger one of each auth email type to `support@aisorix.com` and confirm the webhook → pgmq queue → dispatcher → Lovable Email API pipeline works end-to-end.

## Steps

1. **Trigger each auth email** via Supabase Auth admin/public APIs against the project:
   - **Signup confirmation** — call `auth/v1/signup` with `support@aisorix.com` + a throwaway password.
   - **Magic link (login)** — call `auth/v1/otp` with `should_create_user: false` (user already exists from step 1).
   - **Password reset (recovery)** — call `auth/v1/recover`.
   - **Email change** — sign in as the user, then call `auth/v1/user` with a new email to fire the `email_change` template.

2. **Verify the queue + delivery** by querying `email_send_log` for rows where `recipient_email = 'support@aisorix.com'`, deduplicated by `message_id`. Expect 4 rows progressing `pending → sent`. Report:
   - Template name
   - Final status
   - Any `error_message` if `failed` / `dlq`

3. **If anything is stuck in `pending`**, check `process-email-queue` edge function logs and the `cron.job` entry to confirm the dispatcher is running, and report findings.

4. **No code changes** — this is verification only. If a real failure surfaces (missing cron, bad `SENDER_DOMAIN`, etc.), I'll report it and propose a follow-up plan rather than fixing inline.

## Notes

- DNS for `notify.www.aisorix.com` must already be verified for emails to actually leave the queue. If it's still propagating, sends will sit in `pending` / be retried — that's expected and I'll flag it.
- The signup test creates a real auth user for `support@aisorix.com`. Let me know if you'd prefer I delete it after the test.
