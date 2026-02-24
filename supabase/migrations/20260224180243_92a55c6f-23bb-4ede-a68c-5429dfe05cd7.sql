
-- Create presentations table
CREATE TABLE public.presentations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Presentation',
  prompt text NOT NULL,
  slide_count integer NOT NULL DEFAULT 5,
  slides_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  theme text NOT NULL DEFAULT 'dark',
  tokens_used integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.presentations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own presentations"
  ON public.presentations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own presentations"
  ON public.presentations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own presentations"
  ON public.presentations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own presentations"
  ON public.presentations FOR DELETE
  USING (auth.uid() = user_id);
