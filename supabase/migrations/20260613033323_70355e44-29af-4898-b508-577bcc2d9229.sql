
-- BROADCASTS
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  audience JSONB NOT NULL DEFAULT '{}'::jsonb,
  channels TEXT[] NOT NULL DEFAULT ARRAY['email']::text[],
  created_by UUID,
  created_by_email TEXT,
  recipient_count INTEGER NOT NULL DEFAULT 0,
  sent_count INTEGER NOT NULL DEFAULT 0,
  failed_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.broadcasts TO authenticated;
GRANT ALL ON public.broadcasts TO service_role;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read broadcasts" ON public.broadcasts FOR SELECT TO authenticated
  USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Admins write broadcasts" ON public.broadcasts FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

-- PAGE VIEWS
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT,
  path TEXT NOT NULL,
  referrer TEXT,
  source TEXT,
  device TEXT,
  country TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read page_views" ON public.page_views FOR SELECT TO authenticated
  USING (public.is_admin_user(auth.uid()));

CREATE INDEX idx_page_views_created_at ON public.page_views (created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views (path);
CREATE INDEX idx_page_views_country ON public.page_views (country);

-- RPC for anyone to log a page view
CREATE OR REPLACE FUNCTION public.log_page_view(
  _path TEXT,
  _session_id TEXT DEFAULT NULL,
  _referrer TEXT DEFAULT NULL,
  _source TEXT DEFAULT NULL,
  _device TEXT DEFAULT NULL,
  _country TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _id UUID;
BEGIN
  IF _path IS NULL OR length(_path) = 0 OR length(_path) > 512 THEN
    RAISE EXCEPTION 'invalid path';
  END IF;
  INSERT INTO public.page_views (user_id, session_id, path, referrer, source, device, country, user_agent)
  VALUES (auth.uid(), _session_id, _path, _referrer, _source, _device, _country, _user_agent)
  RETURNING id INTO _id;
  RETURN _id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.log_page_view(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- updated_at trigger for broadcasts
CREATE TRIGGER trg_broadcasts_updated_at
  BEFORE UPDATE ON public.broadcasts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
