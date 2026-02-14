
-- Create image_generations table
CREATE TABLE public.image_generations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  prompt TEXT NOT NULL,
  style TEXT,
  image_url TEXT NOT NULL,
  width INTEGER NOT NULL DEFAULT 1024,
  height INTEGER NOT NULL DEFAULT 1024,
  tokens_used INTEGER NOT NULL DEFAULT 12000,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.image_generations ENABLE ROW LEVEL SECURITY;

-- Users can view their own generations
CREATE POLICY "Users can view their own image generations"
ON public.image_generations
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own generations
CREATE POLICY "Users can insert their own image generations"
ON public.image_generations
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own generations
CREATE POLICY "Users can delete their own image generations"
ON public.image_generations
FOR DELETE
USING (auth.uid() = user_id);
