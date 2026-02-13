
-- Fix 1: Profiles - replace public SELECT with owner-only
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Fix 2: Subscriptions - remove overly permissive service role policy
-- Service role already bypasses RLS, so this policy just opens access to anon/authenticated
DROP POLICY IF EXISTS "Service role can manage all subscriptions" ON public.subscriptions;

-- Fix 3: Payment history - same issue
DROP POLICY IF EXISTS "Service role can manage all payments" ON public.payment_history;
