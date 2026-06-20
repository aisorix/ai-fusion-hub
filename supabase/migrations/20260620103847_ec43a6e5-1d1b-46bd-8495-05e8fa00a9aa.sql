
-- =========================================================================
-- 1. EXTEND payment_intents for scholars items
-- =========================================================================
ALTER TABLE public.payment_intents
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'subscription',
  ADD COLUMN IF NOT EXISTS item_slug text,
  ADD COLUMN IF NOT EXISTS seats integer;

ALTER TABLE public.payment_intents
  DROP CONSTRAINT IF EXISTS payment_intents_kind_check;
ALTER TABLE public.payment_intents
  ADD CONSTRAINT payment_intents_kind_check
  CHECK (kind IN ('subscription','course','workshop','competition'));

-- =========================================================================
-- 2. EXTEND workshops
-- =========================================================================
ALTER TABLE public.workshops
  ADD COLUMN IF NOT EXISTS banner_url text,
  ADD COLUMN IF NOT EXISTS seats_total integer,
  ADD COLUMN IF NOT EXISTS seats_booked integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS join_url text;

-- =========================================================================
-- 3. COURSES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  tagline text,
  level text,
  duration_label text,
  price_bdt numeric NOT NULL DEFAULT 0,
  old_price_bdt numeric,
  cover_url text,
  banner_url text,
  overview text,
  outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  instructor jsonb NOT NULL DEFAULT '{}'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published courses" ON public.courses;
CREATE POLICY "Anyone can view published courses" ON public.courses
  FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins manage courses" ON public.courses;
CREATE POLICY "Admins manage courses" ON public.courses
  FOR ALL TO authenticated
  USING (public.is_admin_user(auth.uid()))
  WITH CHECK (public.is_admin_user(auth.uid()));

DROP TRIGGER IF EXISTS set_courses_updated_at ON public.courses;
CREATE TRIGGER set_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 4. COURSE MODULES + LESSONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.course_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_course_modules_course ON public.course_modules(course_id, sort_order);
GRANT SELECT ON public.course_modules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_modules TO authenticated;
GRANT ALL ON public.course_modules TO service_role;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view modules of published courses" ON public.course_modules;
CREATE POLICY "Anyone can view modules of published courses" ON public.course_modules
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.courses c WHERE c.id = course_id AND c.is_published = true));
DROP POLICY IF EXISTS "Admins manage modules" ON public.course_modules;
CREATE POLICY "Admins manage modules" ON public.course_modules
  FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  title text NOT NULL,
  video_url text,
  duration_sec integer,
  content_md text,
  is_preview boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_course_lessons_module ON public.course_lessons(module_id, sort_order);
GRANT SELECT ON public.course_lessons TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_lessons TO authenticated;
GRANT ALL ON public.course_lessons TO service_role;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view lesson titles" ON public.course_lessons;
CREATE POLICY "Anyone can view lesson titles" ON public.course_lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.course_modules m
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id AND c.is_published = true
    )
  );
DROP POLICY IF EXISTS "Admins manage lessons" ON public.course_lessons;
CREATE POLICY "Admins manage lessons" ON public.course_lessons
  FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

-- =========================================================================
-- 5. COMPETITIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  tagline text,
  cover_url text,
  banner_url text,
  overview text,
  rules jsonb NOT NULL DEFAULT '[]'::jsonb,
  prizes jsonb NOT NULL DEFAULT '[]'::jsonb,
  tracks jsonb NOT NULL DEFAULT '[]'::jsonb,
  criteria jsonb NOT NULL DEFAULT '[]'::jsonb,
  timeline jsonb NOT NULL DEFAULT '[]'::jsonb,
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  entry_fee_bdt numeric NOT NULL DEFAULT 0,
  prize_label text,
  status_label text,
  starts_at timestamptz,
  deadline_at timestamptz,
  max_participants integer,
  is_published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.competitions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competitions TO authenticated;
GRANT ALL ON public.competitions TO service_role;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view published competitions" ON public.competitions;
CREATE POLICY "Anyone can view published competitions" ON public.competitions
  FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Admins manage competitions" ON public.competitions;
CREATE POLICY "Admins manage competitions" ON public.competitions
  FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

DROP TRIGGER IF EXISTS set_competitions_updated_at ON public.competitions;
CREATE TRIGGER set_competitions_updated_at BEFORE UPDATE ON public.competitions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================================
-- 6. PURCHASES / BOOKINGS / REGISTRATIONS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.course_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  amount_paid numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  tran_id text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_course_purchases_user ON public.course_purchases(user_id);
GRANT SELECT ON public.course_purchases TO authenticated;
GRANT ALL ON public.course_purchases TO service_role;
ALTER TABLE public.course_purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own course purchases" ON public.course_purchases;
CREATE POLICY "Users see own course purchases" ON public.course_purchases
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

CREATE TABLE IF NOT EXISTS public.workshop_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workshop_id uuid NOT NULL REFERENCES public.workshops(id) ON DELETE CASCADE,
  seats integer NOT NULL DEFAULT 1,
  amount_paid numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  tran_id text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_user ON public.workshop_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_workshop_bookings_ws ON public.workshop_bookings(workshop_id);
GRANT SELECT ON public.workshop_bookings TO authenticated;
GRANT ALL ON public.workshop_bookings TO service_role;
ALTER TABLE public.workshop_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own workshop bookings" ON public.workshop_bookings;
CREATE POLICY "Users see own workshop bookings" ON public.workshop_bookings
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

CREATE TABLE IF NOT EXISTS public.competition_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  team_name text,
  amount_paid numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'BDT',
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  tran_id text,
  status text NOT NULL DEFAULT 'confirmed',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, competition_id)
);
CREATE INDEX IF NOT EXISTS idx_comp_regs_user ON public.competition_registrations(user_id);
GRANT SELECT ON public.competition_registrations TO authenticated;
GRANT ALL ON public.competition_registrations TO service_role;
ALTER TABLE public.competition_registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own competition regs" ON public.competition_registrations;
CREATE POLICY "Users see own competition regs" ON public.competition_registrations
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_user(auth.uid()));

-- =========================================================================
-- 7. SEAT TRIGGER
-- =========================================================================
CREATE OR REPLACE FUNCTION public.recompute_workshop_seats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _ws uuid;
BEGIN
  _ws := COALESCE(NEW.workshop_id, OLD.workshop_id);
  UPDATE public.workshops w
  SET seats_booked = COALESCE((
    SELECT SUM(seats) FROM public.workshop_bookings b
    WHERE b.workshop_id = _ws AND b.status = 'confirmed'
  ), 0)
  WHERE w.id = _ws;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_recompute_seats ON public.workshop_bookings;
CREATE TRIGGER trg_recompute_seats
AFTER INSERT OR UPDATE OR DELETE ON public.workshop_bookings
FOR EACH ROW EXECUTE FUNCTION public.recompute_workshop_seats();

-- =========================================================================
-- 8. ADMIN OVERVIEW RPC
-- =========================================================================
CREATE OR REPLACE FUNCTION public.admin_scholars_overview(_from timestamptz DEFAULT now() - interval '30 days', _to timestamptz DEFAULT now())
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _result jsonb;
BEGIN
  IF NOT public.is_admin_user(auth.uid()) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  SELECT jsonb_build_object(
    'courses', jsonb_build_object(
      'count', (SELECT COUNT(*) FROM public.courses),
      'published', (SELECT COUNT(*) FROM public.courses WHERE is_published),
      'purchases', (SELECT COUNT(*) FROM public.course_purchases WHERE created_at BETWEEN _from AND _to),
      'revenue', COALESCE((SELECT SUM(amount_paid) FROM public.course_purchases WHERE created_at BETWEEN _from AND _to AND status='confirmed'), 0)
    ),
    'workshops', jsonb_build_object(
      'count', (SELECT COUNT(*) FROM public.workshops),
      'published', (SELECT COUNT(*) FROM public.workshops WHERE is_published),
      'bookings', (SELECT COUNT(*) FROM public.workshop_bookings WHERE created_at BETWEEN _from AND _to),
      'revenue', COALESCE((SELECT SUM(amount_paid) FROM public.workshop_bookings WHERE created_at BETWEEN _from AND _to AND status='confirmed'), 0)
    ),
    'competitions', jsonb_build_object(
      'count', (SELECT COUNT(*) FROM public.competitions),
      'published', (SELECT COUNT(*) FROM public.competitions WHERE is_published),
      'registrations', (SELECT COUNT(*) FROM public.competition_registrations WHERE created_at BETWEEN _from AND _to),
      'revenue', COALESCE((SELECT SUM(amount_paid) FROM public.competition_registrations WHERE created_at BETWEEN _from AND _to AND status='confirmed'), 0)
    ),
    'certificates_issued', (SELECT COUNT(*) FROM public.user_certificates WHERE issued_at BETWEEN _from AND _to)
  ) INTO _result;
  RETURN _result;
END; $$;

-- =========================================================================
-- 9. LOOKUP RPC FOR CHECKOUT (server-side price source)
-- =========================================================================
CREATE OR REPLACE FUNCTION public.get_scholars_item(_kind text, _slug text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _row jsonb;
BEGIN
  IF _kind = 'course' THEN
    SELECT to_jsonb(c) INTO _row FROM (
      SELECT id, slug, title, price_bdt AS price, is_published, NULL::integer AS seats_total, 0::integer AS seats_booked FROM public.courses WHERE slug = _slug
    ) c;
  ELSIF _kind = 'workshop' THEN
    SELECT to_jsonb(w) INTO _row FROM (
      SELECT id, slug, title, price_bdt AS price, is_published, seats_total, seats_booked FROM public.workshops WHERE slug = _slug
    ) w;
  ELSIF _kind = 'competition' THEN
    SELECT to_jsonb(c) INTO _row FROM (
      SELECT id, slug, title, entry_fee_bdt AS price, is_published, max_participants AS seats_total, 0::integer AS seats_booked FROM public.competitions WHERE slug = _slug
    ) c;
  ELSE
    RAISE EXCEPTION 'invalid kind';
  END IF;
  RETURN _row;
END; $$;

-- =========================================================================
-- 10. SEED from existing in-code data so public pages keep working
-- =========================================================================
INSERT INTO public.courses (slug, title, tagline, level, duration_label, price_bdt, overview, outcomes, instructor, faqs, is_published, sort_order)
VALUES (
  'ai-for-professionals',
  'AI for Professionals',
  'অফিসের real কাজ মাথায় রেখে তৈরি practical masterclass — Email, report, presentation, research সব এক কোর্সে।',
  'Intermediate',
  '6 মডিউল',
  870,
  'একজন প্রফেশনালের প্রতিদিনের অফিস-কাজ সহজ ও দ্রুত করার জন্য ডিজাইন করা একটি practical AI masterclass।',
  '["Professional email ও reply দ্রুত draft করা","Meeting note থেকে structured report তৈরি","Slide outline ও speaker note generate করা","Long document থেকে দ্রুত summary বের করা","Spreadsheet ও data analysis এ AI ব্যবহার","Personal AI workflow তৈরি করা"]'::jsonb,
  '{"name":"Md. Rakibul Islam","role":"Founder, AI Sorix · Sorix Scholars","bio":"AI Sorix-এর প্রতিষ্ঠাতা।"}'::jsonb,
  '[{"q":"কোডিং জানা লাগবে?","a":"না। সম্পূর্ণ কোর্সটি no-code।"},{"q":"কোর্স access কতদিন?","a":"Lifetime access।"},{"q":"Certificate পাব?","a":"হ্যাঁ।"}]'::jsonb,
  true,
  0
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.competitions (slug, title, tagline, overview, tracks, criteria, timeline, prizes, rules, faqs, prize_label, status_label, entry_fee_bdt, is_published, sort_order)
VALUES
('ai-challenge',
 'Sorixlab Build Challenge',
 'Build a useful AI product in 30 days. Win cash, credits, and a launch spotlight.',
 'A worldwide, online-first hackathon for anyone building with AI.',
 '[{"title":"Agents & Automation","desc":"Autonomous systems."},{"title":"Creative & Multimodal","desc":"Image, video, voice."},{"title":"Research & Science","desc":"Scientific workflows."},{"title":"Open Track","desc":"Anything AI."}]'::jsonb,
 '[{"title":"Usefulness","desc":"Real person wants to use it."},{"title":"Craft","desc":"Quality of execution."},{"title":"Novelty","desc":"Genuinely new."},{"title":"Responsibility","desc":"Safety and trust."}]'::jsonb,
 '[{"date":"Week 1","title":"Applications close","desc":"Submit a 200-word idea."},{"date":"Week 2","title":"Kickoff","desc":"Office hours."},{"date":"Weeks 3-4","title":"Build sprint","desc":"Working prototype."},{"date":"Week 5","title":"User testing","desc":"Real users."},{"date":"Week 6","title":"Demo day","desc":"Winners."}]'::jsonb,
 '[{"place":"Grand Prize","reward":"$8,000 cash + credits"},{"place":"Runner-up (x2)","reward":"$2,500 cash"},{"place":"Track winners (x4)","reward":"$500 cash"}]'::jsonb,
 '["Open worldwide.","Projects must use AI.","You own your IP."]'::jsonb,
 '[{"q":"Free to enter?","a":"Yes."},{"q":"Which models?","a":"Any."}]'::jsonb,
 '$15,000 prize pool',
 'Applications open',
 0,
 true,
 0
),
('startup-funding',
 'SorixLab Startup Funding Competition',
 'Pitch an AI-first startup. Best teams receive funding, mentorship, and a launch runway.',
 'An online-first competition for founders building AI-native companies.',
 '[{"title":"Productivity & Workspace","desc":"AI tools for teams."},{"title":"Vertical AI","desc":"Domain-specific."},{"title":"Developer Tools","desc":"Infra, agents."},{"title":"Consumer AI","desc":"Habit-forming apps."}]'::jsonb,
 '[{"title":"Problem clarity","desc":"Real and painful."},{"title":"Solution insight","desc":"Unique view."},{"title":"Team","desc":"Right people."},{"title":"Execution path","desc":"Can ship."}]'::jsonb,
 '[{"date":"Week 1","title":"Applications close","desc":"One-page memo."},{"date":"Week 3","title":"Shortlist","desc":"Top 30."},{"date":"Week 5","title":"Mentor sprint","desc":"1:1."},{"date":"Week 7","title":"Pitch day","desc":"Investor panel."},{"date":"Week 8","title":"Decisions","desc":"Winners."}]'::jsonb,
 '[{"place":"1st","reward":"$50,000 + mentorship"},{"place":"2nd","reward":"$25,000"},{"place":"3rd","reward":"$10,000"}]'::jsonb,
 '["Open worldwide.","Equity terms disclosed.","AI stack must be used meaningfully."]'::jsonb,
 '[{"q":"Take equity?","a":"For funded teams only."},{"q":"Prototype required?","a":"Preferred not required."}]'::jsonb,
 'Up to $50,000 + mentorship',
 'Applications open',
 0,
 true,
 1
)
ON CONFLICT (slug) DO NOTHING;

-- Seed workshops only if table is empty (the existing AdminWorkshops UI already manages this table)
INSERT INTO public.workshops (slug, title, summary, description, mentor_name, mentor_role, duration_hours, price_bdt, is_published, location)
SELECT * FROM (VALUES
  ('ai-private-batch-2month'::text, '২ মাসের AI প্রাইভেট ব্যাচ'::text, 'আপনার লক্ষ্য অনুযায়ী AI শেখার জন্য জয়েন করুন আমাদের প্রাইভেট ব্যাচে।'::text, 'ছোট ব্যাচে ১:১ মেন্টরিং নিয়ে AI শিখুন।'::text, 'Rakib Eslam'::text, 'Founder & CEO, AI Sorix Limited'::text, 60::numeric, 5000::numeric, true, 'Google Meet'::text),
  ('ai-smart-productivity-3day'::text, '৩ দিনের AI লাইভ ওয়ার্কশপ'::text, 'আপনার ৫ ঘণ্টার কাজ ৫ মিনিটে নামিয়ে আনতে জয়েন করুন এই প্র্যাক্টিক্যাল সেশনে।'::text, '৩ দিনের নিবিড় লাইভ ট্রেনিং।'::text, 'Rakib Eslam'::text, 'Founder & CEO, AI Sorix Limited'::text, 6::numeric, 470::numeric, true, 'Google Meet'::text)
) AS v(slug, title, summary, description, mentor_name, mentor_role, duration_hours, price_bdt, is_published, location)
WHERE NOT EXISTS (SELECT 1 FROM public.workshops);
