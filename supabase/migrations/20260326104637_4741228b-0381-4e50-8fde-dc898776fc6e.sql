
-- Co-Work Tasks table
CREATE TABLE public.cowork_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cowork_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cowork tasks" ON public.cowork_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own cowork tasks" ON public.cowork_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own cowork tasks" ON public.cowork_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cowork tasks" ON public.cowork_tasks FOR DELETE USING (auth.uid() = user_id);

-- Co-Work Messages table
CREATE TABLE public.cowork_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID REFERENCES public.cowork_tasks(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL DEFAULT '',
  tool_calls JSONB,
  tool_results JSONB,
  model TEXT,
  tokens_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.cowork_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own cowork messages" ON public.cowork_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own cowork messages" ON public.cowork_messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own cowork messages" ON public.cowork_messages FOR DELETE USING (auth.uid() = user_id);

-- Co-Work Connectors table
CREATE TABLE public.cowork_connectors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  service TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'disconnected',
  config JSONB NOT NULL DEFAULT '{}'::jsonb,
  connected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, service)
);

ALTER TABLE public.cowork_connectors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connectors" ON public.cowork_connectors FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own connectors" ON public.cowork_connectors FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own connectors" ON public.cowork_connectors FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own connectors" ON public.cowork_connectors FOR DELETE USING (auth.uid() = user_id);
