CREATE TABLE public.user_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  provider text NOT NULL,
  nango_connection_id text NOT NULL,
  status text NOT NULL DEFAULT 'connected',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, provider)
);

ALTER TABLE public.user_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own integrations select" ON public.user_integrations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own integrations insert" ON public.user_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own integrations update" ON public.user_integrations
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own integrations delete" ON public.user_integrations
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER user_integrations_updated_at
  BEFORE UPDATE ON public.user_integrations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE INDEX idx_user_integrations_user ON public.user_integrations(user_id);