DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chats;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chat_windows;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.user_chats         REPLICA IDENTITY FULL;
ALTER TABLE public.user_chat_windows  REPLICA IDENTITY FULL;