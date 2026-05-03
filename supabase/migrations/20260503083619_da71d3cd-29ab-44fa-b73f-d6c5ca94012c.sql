CREATE TABLE public.user_custom_integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  base_url text NOT NULL,
  auth_header text NOT NULL DEFAULT 'Authorization',
  auth_scheme text NOT NULL DEFAULT 'Bearer',
  api_key text NOT NULL,
  description text DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_custom_integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own custom integrations select" ON public.user_custom_integrations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own custom integrations insert" ON public.user_custom_integrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own custom integrations update" ON public.user_custom_integrations
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own custom integrations delete" ON public.user_custom_integrations
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER set_custom_integrations_updated_at
BEFORE UPDATE ON public.user_custom_integrations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();