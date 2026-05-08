
-- Fix 1: Tighten shared_chat_comments SELECT to chat members/owner only
DROP POLICY IF EXISTS "Anyone authenticated can view comments on shared chats" ON public.shared_chat_comments;

CREATE POLICY "Members and owners can view shared chat comments"
ON public.shared_chat_comments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.shared_chats sc
    WHERE sc.id = shared_chat_comments.shared_chat_id
      AND sc.owner_id = auth.uid()
  )
  OR EXISTS (
    SELECT 1 FROM public.shared_chat_members m
    WHERE m.shared_chat_id = shared_chat_comments.shared_chat_id
      AND (m.user_id = auth.uid()
           OR m.user_email = (SELECT email FROM auth.users WHERE id = auth.uid())::text)
  )
);

-- Fix 2: Defense-in-depth for subscriptions - revoke UPDATE on sensitive columns from authenticated role
-- (a trigger already blocks plan_id/status/amount changes, but column-level revoke makes it explicit)
REVOKE UPDATE ON public.subscriptions FROM authenticated;
GRANT UPDATE (tokens_used, updated_at) ON public.subscriptions TO authenticated;

-- Fix 3: Restrict Realtime channel subscriptions to authenticated users only
-- (full topic-scoped auth would require extensive refactoring; this prevents anonymous snooping)
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can receive realtime broadcasts" ON realtime.messages;
CREATE POLICY "Authenticated users can receive realtime broadcasts"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);
