
-- Fix: Remove public exposure of user_id on reviews table.
-- Switch reviews_public view to SECURITY DEFINER semantics and add WHERE filter,
-- then drop the broad public SELECT policy on reviews so user_id is never returned to anon/auth.

CREATE OR REPLACE VIEW public.reviews_public
WITH (security_invoker = off) AS
SELECT id, name, role, location, review, rating, verified, status, created_at
FROM public.reviews
WHERE status = 'approved';

GRANT SELECT ON public.reviews_public TO anon, authenticated;

DROP POLICY IF EXISTS "Approved reviews are publicly readable" ON public.reviews;
