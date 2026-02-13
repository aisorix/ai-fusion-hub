
-- Enable Realtime on user_chats table
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chats;

-- Enable Realtime on subscriptions table (for token sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;

-- Add UPDATE RLS policy on subscriptions so users can update their own tokens_used
CREATE POLICY "Users can update their own token usage"
ON public.subscriptions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
