
-- Imagine free trial counter
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS imagine_free_renders_used integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_imagine_free_render()
RETURNS integer
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
     SET imagine_free_renders_used = COALESCE(imagine_free_renders_used, 0) + 1,
         updated_at = now()
   WHERE user_id = _uid
   RETURNING imagine_free_renders_used INTO _new;
  IF _new IS NULL THEN
    INSERT INTO public.profiles (user_id, imagine_free_renders_used)
    VALUES (_uid, 1)
    ON CONFLICT (user_id) DO UPDATE
      SET imagine_free_renders_used = public.profiles.imagine_free_renders_used + 1
    RETURNING imagine_free_renders_used INTO _new;
  END IF;
  RETURN _new;
END;
$$;

-- Soft-delete state on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS deletion_scheduled_at timestamptz,
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Deletion requests table
CREATE TABLE IF NOT EXISTS public.account_deletion_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text,
  details text,
  status text NOT NULL DEFAULT 'pending',
  requested_at timestamptz NOT NULL DEFAULT now(),
  scheduled_purge_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  cancelled_at timestamptz,
  purged_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.account_deletion_requests TO authenticated;
GRANT ALL ON public.account_deletion_requests TO service_role;

ALTER TABLE public.account_deletion_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own deletion requests" ON public.account_deletion_requests;
CREATE POLICY "Users can view own deletion requests"
  ON public.account_deletion_requests
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Inserts and updates happen via SECURITY DEFINER RPCs / service_role only.

CREATE OR REPLACE FUNCTION public.request_account_deletion(_reason text, _details text DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _purge timestamptz;
  _req_id uuid;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;
  _purge := now() + interval '30 days';

  -- Cancel any prior pending request for this user
  UPDATE public.account_deletion_requests
     SET status = 'cancelled',
         cancelled_at = now(),
         updated_at = now()
   WHERE user_id = _uid AND status = 'pending';

  INSERT INTO public.account_deletion_requests (user_id, reason, details, scheduled_purge_at)
  VALUES (_uid, COALESCE(NULLIF(btrim(_reason), ''), 'unspecified'), NULLIF(btrim(_details), ''), _purge)
  RETURNING id INTO _req_id;

  UPDATE public.profiles
     SET deletion_scheduled_at = _purge,
         updated_at = now()
   WHERE user_id = _uid;

  RETURN jsonb_build_object('id', _req_id, 'scheduled_purge_at', _purge);
END;
$$;

CREATE OR REPLACE FUNCTION public.recover_account()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
  _n integer;
BEGIN
  _uid := auth.uid();
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  UPDATE public.account_deletion_requests
     SET status = 'cancelled',
         cancelled_at = now(),
         updated_at = now()
   WHERE user_id = _uid AND status = 'pending';
  GET DIAGNOSTICS _n = ROW_COUNT;

  UPDATE public.profiles
     SET deletion_scheduled_at = NULL,
         updated_at = now()
   WHERE user_id = _uid;

  RETURN jsonb_build_object('recovered', _n > 0);
END;
$$;
