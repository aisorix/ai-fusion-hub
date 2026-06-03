
CREATE TABLE public.video_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  model TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  resolution TEXT NOT NULL DEFAULT '1080p',
  duration_sec INTEGER NOT NULL DEFAULT 5,
  sound BOOLEAN NOT NULL DEFAULT false,
  source_type TEXT NOT NULL DEFAULT 'text',
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.video_generations TO authenticated;
GRANT ALL ON public.video_generations TO service_role;

ALTER TABLE public.video_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own video generations"
  ON public.video_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own video generations"
  ON public.video_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own video generations"
  ON public.video_generations FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_video_generations_user_created
  ON public.video_generations(user_id, created_at DESC);
