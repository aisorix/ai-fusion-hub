-- Remove the guest-allowing INSERT policy and replace with authenticated-only
DROP POLICY IF EXISTS "Users can create their own conversations" ON public.chat_conversations;

CREATE POLICY "Users can create their own conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);