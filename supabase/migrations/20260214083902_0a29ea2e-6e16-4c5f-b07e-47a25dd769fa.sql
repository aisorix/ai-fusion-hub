
-- Add project_type column to projects table
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_type text NOT NULL DEFAULT 'other';

-- Create project_github table for GitHub integration
CREATE TABLE public.project_github (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  repo_owner text NOT NULL,
  repo_name text NOT NULL,
  branch text NOT NULL DEFAULT 'main',
  access_token text NOT NULL,
  connected_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_github ENABLE ROW LEVEL SECURITY;

-- Owner-only access policies
CREATE POLICY "Users can view their own github connections"
  ON public.project_github FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own github connections"
  ON public.project_github FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own github connections"
  ON public.project_github FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own github connections"
  ON public.project_github FOR DELETE
  USING (auth.uid() = user_id);

-- Index for fast lookup by project
CREATE INDEX idx_project_github_project_id ON public.project_github(project_id);
CREATE INDEX idx_project_github_user_id ON public.project_github(user_id);
