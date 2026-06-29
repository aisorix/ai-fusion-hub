
-- 1) workshops.join_url: revoke from anon so unauthenticated visitors cannot read meeting links
REVOKE SELECT (join_url) ON public.workshops FROM anon;

-- 2) reviews.user_id: revoke from anon so unauthenticated visitors cannot harvest account UUIDs
REVOKE SELECT (user_id) ON public.reviews FROM anon;

-- 3) account_deletion_requests: explicit INSERT policy so signed-in users may file their own request
DROP POLICY IF EXISTS "Users can submit their own deletion request" ON public.account_deletion_requests;
CREATE POLICY "Users can submit their own deletion request"
  ON public.account_deletion_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
