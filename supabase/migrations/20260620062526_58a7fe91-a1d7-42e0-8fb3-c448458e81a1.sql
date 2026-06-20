
-- 1. Extend user_certificates
ALTER TABLE public.user_certificates
  ADD COLUMN IF NOT EXISTS certificate_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS recipient_name text,
  ADD COLUMN IF NOT EXISTS issuer_name text DEFAULT 'Rakib Eslam',
  ADD COLUMN IF NOT EXISTS issuer_title text DEFAULT 'Founder & CEO, AI Sorix Limited',
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Backfill numbers/names for any existing rows
UPDATE public.user_certificates uc
SET certificate_number = 'SS-' || to_char(uc.issued_at, 'YYYY') || '-' || upper(substring(replace(uc.id::text, '-', '') from 1 for 6))
WHERE certificate_number IS NULL;

UPDATE public.user_certificates uc
SET recipient_name = COALESCE(p.full_name, 'Sorix Scholar')
FROM public.profiles p
WHERE p.user_id = uc.user_id AND uc.recipient_name IS NULL;

UPDATE public.user_certificates SET recipient_name = 'Sorix Scholar' WHERE recipient_name IS NULL;

-- 2. Profile bio
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio text;

-- 3. Enrollments table
CREATE TABLE IF NOT EXISTS public.user_enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL CHECK (kind IN ('course','workshop','competition')),
  source_slug text NOT NULL,
  title text NOT NULL,
  progress int NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status text NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, kind, source_slug)
);
CREATE INDEX IF NOT EXISTS idx_user_enrollments_user ON public.user_enrollments(user_id, enrolled_at DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_enrollments TO authenticated;
GRANT ALL ON public.user_enrollments TO service_role;

ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own enrollments" ON public.user_enrollments;
CREATE POLICY "Users view own enrollments" ON public.user_enrollments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users insert own enrollments" ON public.user_enrollments;
CREATE POLICY "Users insert own enrollments" ON public.user_enrollments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users update own enrollments" ON public.user_enrollments;
CREATE POLICY "Users update own enrollments" ON public.user_enrollments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "Users delete own enrollments" ON public.user_enrollments;
CREATE POLICY "Users delete own enrollments" ON public.user_enrollments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TRIGGER user_enrollments_updated_at BEFORE UPDATE ON public.user_enrollments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. RPCs
CREATE OR REPLACE FUNCTION public.enroll_item(_kind text, _slug text, _title text)
RETURNS public.user_enrollments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _row public.user_enrollments; _uid uuid;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  IF _kind NOT IN ('course','workshop','competition') THEN RAISE EXCEPTION 'invalid kind'; END IF;
  INSERT INTO public.user_enrollments(user_id, kind, source_slug, title)
  VALUES (_uid, _kind, _slug, _title)
  ON CONFLICT (user_id, kind, source_slug) DO UPDATE SET updated_at = now()
  RETURNING * INTO _row;
  RETURN _row;
END; $$;

GRANT EXECUTE ON FUNCTION public.enroll_item(text,text,text) TO authenticated;

CREATE OR REPLACE FUNCTION public.update_enrollment_progress(_kind text, _slug text, _progress int)
RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  _uid uuid; _enr public.user_enrollments; _cert public.user_certificates;
  _existing_cert public.user_certificates; _name text; _num text;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  _progress := GREATEST(0, LEAST(100, _progress));

  UPDATE public.user_enrollments
  SET progress = _progress,
      status = CASE WHEN _progress >= 100 THEN 'completed' ELSE 'in_progress' END,
      completed_at = CASE WHEN _progress >= 100 AND completed_at IS NULL THEN now() ELSE completed_at END,
      updated_at = now()
  WHERE user_id = _uid AND kind = _kind AND source_slug = _slug
  RETURNING * INTO _enr;

  IF _enr.id IS NULL THEN RAISE EXCEPTION 'enrollment not found'; END IF;

  IF _progress >= 100 THEN
    SELECT * INTO _existing_cert FROM public.user_certificates
    WHERE user_id = _uid AND kind = _kind AND source_slug = _slug LIMIT 1;
    IF _existing_cert.id IS NULL THEN
      SELECT COALESCE(p.full_name, 'Sorix Scholar') INTO _name
      FROM public.profiles p WHERE p.user_id = _uid;
      _num := 'SS-' || to_char(now(), 'YYYY') || '-' || upper(substring(replace(gen_random_uuid()::text, '-', '') from 1 for 6));
      INSERT INTO public.user_certificates(user_id, kind, title, source_slug, recipient_name, certificate_number)
      VALUES (_uid, _kind, _enr.title, _slug, COALESCE(_name, 'Sorix Scholar'), _num)
      RETURNING * INTO _cert;
      RETURN jsonb_build_object('enrollment', to_jsonb(_enr), 'certificate', to_jsonb(_cert), 'newly_issued', true);
    END IF;
    RETURN jsonb_build_object('enrollment', to_jsonb(_enr), 'certificate', to_jsonb(_existing_cert), 'newly_issued', false);
  END IF;
  RETURN jsonb_build_object('enrollment', to_jsonb(_enr), 'certificate', null, 'newly_issued', false);
END; $$;

GRANT EXECUTE ON FUNCTION public.update_enrollment_progress(text,text,int) TO authenticated;

CREATE OR REPLACE FUNCTION public.verify_certificate(_number text)
RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE _c public.user_certificates;
BEGIN
  SELECT * INTO _c FROM public.user_certificates WHERE certificate_number = _number LIMIT 1;
  IF _c.id IS NULL THEN RETURN jsonb_build_object('valid', false); END IF;
  RETURN jsonb_build_object(
    'valid', true,
    'certificate_number', _c.certificate_number,
    'recipient_name', _c.recipient_name,
    'title', _c.title,
    'kind', _c.kind,
    'issued_at', _c.issued_at,
    'issuer_name', _c.issuer_name,
    'issuer_title', _c.issuer_title
  );
END; $$;

GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;
