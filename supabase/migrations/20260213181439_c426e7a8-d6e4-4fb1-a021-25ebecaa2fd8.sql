
-- Shared chats table
CREATE TABLE public.shared_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Shared Chat',
  chat_data JSONB NOT NULL DEFAULT '[]'::jsonb,
  share_token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their shared chats" ON public.shared_chats FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Anyone can view shared chats by token" ON public.shared_chats FOR SELECT USING (true);

-- Shared chat members
CREATE TABLE public.shared_chat_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shared_chat_id UUID NOT NULL REFERENCES public.shared_chats(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_id UUID,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('viewer', 'commenter')),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.shared_chat_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage members" ON public.shared_chat_members FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.shared_chats WHERE id = shared_chat_id AND owner_id = auth.uid()));
CREATE POLICY "Members can view their membership" ON public.shared_chat_members FOR SELECT 
  USING (user_id = auth.uid() OR user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Shared chat comments (realtime)
CREATE TABLE public.shared_chat_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shared_chat_id UUID NOT NULL REFERENCES public.shared_chats(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name TEXT,
  user_avatar TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.shared_chat_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view comments on shared chats" ON public.shared_chat_comments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can add comments" ON public.shared_chat_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.shared_chat_comments FOR DELETE USING (auth.uid() = user_id);

-- Enable realtime for comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.shared_chat_comments;

-- Trigger for updated_at on shared_chats
CREATE TRIGGER update_shared_chats_updated_at
  BEFORE UPDATE ON public.shared_chats
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
