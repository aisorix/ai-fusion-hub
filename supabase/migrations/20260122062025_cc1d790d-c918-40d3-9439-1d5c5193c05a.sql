-- Create reviews table for user-submitted reviews
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  review TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  verified BOOLEAN DEFAULT true,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved reviews (public visibility)
CREATE POLICY "Anyone can read approved reviews"
ON public.reviews
FOR SELECT
USING (status = 'approved');

-- Allow anyone to insert new reviews (public submission)
CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
WITH CHECK (true);

-- Add comment for clarity
COMMENT ON TABLE public.reviews IS 'User-submitted reviews for the platform';