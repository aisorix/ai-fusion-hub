-- Create project_files table for storing code files within projects
CREATE TABLE public.project_files (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  name text NOT NULL,
  path text NOT NULL DEFAULT '/',
  content text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'plaintext',
  is_folder boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Index for fast lookups
CREATE INDEX idx_project_files_project ON public.project_files(project_id);
CREATE INDEX idx_project_files_path ON public.project_files(project_id, path);

-- Enable RLS
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own project files"
  ON public.project_files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create files in their projects"
  ON public.project_files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own project files"
  ON public.project_files FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own project files"
  ON public.project_files FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_project_files_updated_at
  BEFORE UPDATE ON public.project_files
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();