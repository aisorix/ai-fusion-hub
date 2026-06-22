
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS cineshoot_free_renders_used INTEGER NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_cineshoot_free_render()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _new integer;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  UPDATE public.profiles
     SET cineshoot_free_renders_used = COALESCE(cineshoot_free_renders_used, 0) + 1,
         updated_at = now()
   WHERE user_id = _uid
   RETURNING cineshoot_free_renders_used INTO _new;
  IF _new IS NULL THEN
    -- Profile row may not exist yet (rare); create one.
    INSERT INTO public.profiles (user_id, cineshoot_free_renders_used)
    VALUES (_uid, 1)
    ON CONFLICT (user_id) DO UPDATE
      SET cineshoot_free_renders_used = public.profiles.cineshoot_free_renders_used + 1
    RETURNING cineshoot_free_renders_used INTO _new;
  END IF;
  RETURN _new;
END;
$$;

REVOKE ALL ON FUNCTION public.increment_cineshoot_free_render() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_cineshoot_free_render() TO authenticated;
