-- Create a public view that excludes user_id from reviews
CREATE VIEW public.reviews_public
WITH (security_invoker = on) AS
  SELECT id, name, role, location, review, rating, verified, status, created_at
  FROM public.reviews;

-- Drop the old public SELECT policy
DROP POLICY IF EXISTS "Anyone can read approved reviews" ON public.reviews;

-- Deny direct SELECT to the base table for anonymous/public reads
-- Only allow users to read their OWN reviews (for checking if they submitted)
CREATE POLICY "Users can view their own reviews"
ON public.reviews
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all reviews for moderation
CREATE POLICY "Admins can view all reviews"
ON public.reviews
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));