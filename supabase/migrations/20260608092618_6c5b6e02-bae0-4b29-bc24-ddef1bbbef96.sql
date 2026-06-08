CREATE TABLE public.video_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued',
  provider_job_id text,
  provider_polling_url text,
  model text NOT NULL,
  prompt text NOT NULL,
  aspect_ratio text NOT NULL DEFAULT '16:9',
  resolution text NOT NULL DEFAULT '1080p',
  duration_sec int NOT NULL DEFAULT 5,
  sound boolean NOT NULL DEFAULT false,
  source_type text NOT NULL DEFAULT 'text',
  image_data_url text,
  tokens_estimated int NOT NULL DEFAULT 0,
  tokens_charged int,
  video_url text,
  error text,
  attempts int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.video_jobs TO authenticated;
GRANT ALL ON public.video_jobs TO service_role;

ALTER TABLE public.video_jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own video jobs"
  ON public.video_jobs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_video_jobs_user_created ON public.video_jobs(user_id, created_at DESC);
CREATE INDEX idx_video_jobs_status ON public.video_jobs(status) WHERE status IN ('queued','rendering','uploading');

CREATE TRIGGER trg_video_jobs_updated_at
  BEFORE UPDATE ON public.video_jobs
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();