
-- Week 4 tables

CREATE TABLE public.feature_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  description text,
  enabled boolean NOT NULL DEFAULT false,
  rollout_percent int NOT NULL DEFAULT 100 CHECK (rollout_percent BETWEEN 0 AND 100),
  audience jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.feature_flags TO authenticated;
GRANT ALL ON public.feature_flags TO service_role;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read flags" ON public.feature_flags FOR SELECT TO authenticated USING (public.is_admin_user(auth.uid()));
CREATE POLICY "admins write flags" ON public.feature_flags FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));
CREATE TRIGGER feature_flags_updated_at BEFORE UPDATE ON public.feature_flags FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  body_md text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'info' CHECK (severity IN ('info','success','warn','critical')),
  audience text NOT NULL DEFAULT 'all',
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool text NOT NULL UNIQUE,
  name text NOT NULL,
  body text NOT NULL DEFAULT '',
  model text,
  current_version int NOT NULL DEFAULT 1,
  updated_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prompt_templates TO authenticated;
GRANT ALL ON public.prompt_templates TO service_role;
ALTER TABLE public.prompt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage prompts" ON public.prompt_templates FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));
CREATE TRIGGER prompt_templates_updated_at BEFORE UPDATE ON public.prompt_templates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TABLE public.prompt_template_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id uuid NOT NULL REFERENCES public.prompt_templates(id) ON DELETE CASCADE,
  version int NOT NULL,
  body text NOT NULL,
  model text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.prompt_template_versions TO authenticated;
GRANT ALL ON public.prompt_template_versions TO service_role;
ALTER TABLE public.prompt_template_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read prompt versions" ON public.prompt_template_versions FOR SELECT TO authenticated USING (public.is_admin_user(auth.uid()));
CREATE POLICY "admins write prompt versions" ON public.prompt_template_versions FOR INSERT TO authenticated WITH CHECK (public.is_admin_user(auth.uid()));

CREATE TABLE public.feedback_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  feature text NOT NULL DEFAULT 'general',
  rating int CHECK (rating BETWEEN 1 AND 5),
  nps int CHECK (nps BETWEEN 0 AND 10),
  comment text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.feedback_entries TO authenticated;
GRANT ALL ON public.feedback_entries TO service_role;
ALTER TABLE public.feedback_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users insert own feedback" ON public.feedback_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "admins read feedback" ON public.feedback_entries FOR SELECT TO authenticated USING (public.is_admin_user(auth.uid()));

-- Extend chat_conversations for ticket fields
ALTER TABLE public.chat_conversations
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','resolved','closed')),
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  ADD COLUMN IF NOT EXISTS assignee_id uuid,
  ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS internal_notes text;

-- Public-read helpers
CREATE OR REPLACE FUNCTION public.get_enabled_flags()
RETURNS TABLE(key text, enabled boolean, rollout_percent int, audience jsonb)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT key, enabled, rollout_percent, audience FROM public.feature_flags WHERE enabled = true;
$$;

CREATE OR REPLACE FUNCTION public.get_active_announcements()
RETURNS SETOF public.announcements
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT * FROM public.announcements
  WHERE active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at > now())
  ORDER BY created_at DESC;
$$;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.feature_flags;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;

-- Week 5 tables
CREATE TABLE public.system_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.system_settings TO authenticated;
GRANT ALL ON public.system_settings TO service_role;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage settings" ON public.system_settings FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

INSERT INTO public.system_settings (key, value) VALUES
  ('general', '{"site_name":"AI Sorix","support_email":"support@aisorix.com"}'::jsonb),
  ('branding', '{"logo_url":null,"primary_color":"#1A6FD8"}'::jsonb),
  ('email', '{"from_address":"noreply@aisorix.com","footer":"AI Sorix Inc."}'::jsonb),
  ('limits', '{"free_tokens":100000,"basic_tokens":1000000,"pro_tokens":5000000,"premium_tokens":20000000}'::jsonb),
  ('integrations', '{"google_oauth":false,"github_oauth":true}'::jsonb)
ON CONFLICT (key) DO NOTHING;

CREATE TABLE public.secret_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  secret_name text NOT NULL,
  action text NOT NULL CHECK (action IN ('rotated','viewed_presence')),
  actor_id uuid,
  actor_email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.secret_audit TO authenticated;
GRANT ALL ON public.secret_audit TO service_role;
ALTER TABLE public.secret_audit ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read secret audit" ON public.secret_audit FOR SELECT TO authenticated USING (public.is_admin_user(auth.uid()));
CREATE POLICY "admins write secret audit" ON public.secret_audit FOR INSERT TO authenticated WITH CHECK (public.is_admin_user(auth.uid()));

-- Seed default prompt templates
INSERT INTO public.prompt_templates (tool, name, body) VALUES
  ('chat','Chat (Default)','You are AI Sorix, a helpful global assistant.'),
  ('health','Sorix Health','You are Sorix Health, an informational medical research assistant.'),
  ('agro','Sorix Agro','You are Sorix Agro, an agricultural advisory assistant.'),
  ('legends','Sorix Legends','You roleplay as the requested historical or fictional persona.'),
  ('imagine','Sorix Imagine','You craft detailed image prompts for diffusion models.'),
  ('deck','Sorix Deck','You generate clean, structured presentation outlines.')
ON CONFLICT (tool) DO NOTHING;
