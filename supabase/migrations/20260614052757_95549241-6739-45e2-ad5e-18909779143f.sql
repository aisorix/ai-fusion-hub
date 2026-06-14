CREATE TABLE public.user_certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('course','competition','workshop')),
  title TEXT NOT NULL,
  source_slug TEXT,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_certificates_user ON public.user_certificates(user_id, issued_at DESC);

GRANT SELECT ON public.user_certificates TO authenticated;
GRANT ALL ON public.user_certificates TO service_role;

ALTER TABLE public.user_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own certificates"
  ON public.user_certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);