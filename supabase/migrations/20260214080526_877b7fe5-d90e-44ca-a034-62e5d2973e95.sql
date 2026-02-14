-- Add model column to projects table to persist the chosen AI model per project
ALTER TABLE public.projects ADD COLUMN model text NOT NULL DEFAULT 'deepseek/deepseek-v3.2';