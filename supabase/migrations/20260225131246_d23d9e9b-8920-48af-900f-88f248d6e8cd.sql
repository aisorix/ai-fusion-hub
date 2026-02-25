-- Block all client-side INSERTs on payment_history (only service role via webhook can insert)
CREATE POLICY "Deny client-side payment record creation"
  ON public.payment_history
  FOR INSERT
  TO authenticated
  WITH CHECK (false);

-- Block all client-side UPDATEs on payment_history
CREATE POLICY "Deny client-side payment record updates"
  ON public.payment_history
  FOR UPDATE
  TO authenticated
  USING (false);

-- Block all client-side DELETEs on payment_history
CREATE POLICY "Deny client-side payment record deletion"
  ON public.payment_history
  FOR DELETE
  TO authenticated
  USING (false);