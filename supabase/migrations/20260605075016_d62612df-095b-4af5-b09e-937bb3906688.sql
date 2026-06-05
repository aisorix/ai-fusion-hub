CREATE TABLE public.user_chat_windows (
  user_id uuid PRIMARY KEY,
  windows jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_chat_windows TO authenticated;
GRANT ALL ON public.user_chat_windows TO service_role;

ALTER TABLE public.user_chat_windows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own chat windows"
  ON public.user_chat_windows FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.user_chat_windows;