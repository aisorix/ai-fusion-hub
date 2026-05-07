ALTER PUBLICATION supabase_realtime ADD TABLE public.cowork_tasks;
ALTER TABLE public.cowork_tasks REPLICA IDENTITY FULL;