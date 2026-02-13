
-- Create user_chats table for cross-device chat sync
CREATE TABLE public.user_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Chat',
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_chats ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own chats"
ON public.user_chats FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chats"
ON public.user_chats FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chats"
ON public.user_chats FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chats"
ON public.user_chats FOR DELETE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_user_chats_updated_at
BEFORE UPDATE ON public.user_chats
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add tokens_used column to subscriptions table
ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS tokens_used INTEGER NOT NULL DEFAULT 0;

-- Index for faster user lookups
CREATE INDEX idx_user_chats_user_id ON public.user_chats(user_id);
CREATE INDEX idx_user_chats_updated_at ON public.user_chats(updated_at DESC);
