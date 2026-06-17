CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  description TEXT,
  cover_url TEXT,
  mentor_name TEXT,
  mentor_role TEXT,
  mentor_bio TEXT,
  mentor_avatar_url TEXT,
  duration_hours NUMERIC,
  price_bdt NUMERIC DEFAULT 0,
  starts_at TIMESTAMPTZ,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.workshops TO anon, authenticated;
GRANT ALL ON public.workshops TO service_role;

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published workshops"
  ON public.workshops FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all workshops"
  ON public.workshops FOR SELECT TO authenticated
  USING (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can insert workshops"
  ON public.workshops FOR INSERT TO authenticated
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can update workshops"
  ON public.workshops FOR UPDATE TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

CREATE POLICY "Admins can delete workshops"
  ON public.workshops FOR DELETE TO authenticated
  USING (public.is_admin_user(auth.uid()));

CREATE TRIGGER set_workshops_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();