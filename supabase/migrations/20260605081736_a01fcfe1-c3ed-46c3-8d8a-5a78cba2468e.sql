
ALTER TABLE public.user_chats
  ADD COLUMN IF NOT EXISTS is_starred boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS project_id uuid NULL REFERENCES public.projects(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS title_manually_set boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_user_chats_user_starred ON public.user_chats(user_id, is_starred);
CREATE INDEX IF NOT EXISTS idx_user_chats_project ON public.user_chats(project_id);

ALTER TABLE public.image_generations    REPLICA IDENTITY FULL;
ALTER TABLE public.presentations        REPLICA IDENTITY FULL;
ALTER TABLE public.video_generations    REPLICA IDENTITY FULL;
ALTER TABLE public.analysis_history     REPLICA IDENTITY FULL;
ALTER TABLE public.user_chats           REPLICA IDENTITY FULL;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.image_generations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.presentations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.video_generations;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.analysis_history;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
