CREATE INDEX IF NOT EXISTS idx_analysis_history_user_tool_created 
ON public.analysis_history (user_id, tool, created_at DESC);