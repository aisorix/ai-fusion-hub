
-- USER CONNECTIONS (per-user OAuth tokens for connected services)
create table public.user_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  service text not null,
  status text not null default 'connected',
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  scopes text[],
  external_account_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, service)
);
alter table public.user_connections enable row level security;
create policy "own connections select" on public.user_connections for select using (auth.uid() = user_id);
create policy "own connections insert" on public.user_connections for insert with check (auth.uid() = user_id);
create policy "own connections update" on public.user_connections for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own connections delete" on public.user_connections for delete using (auth.uid() = user_id);
create trigger user_connections_set_updated_at before update on public.user_connections for each row execute function public.handle_updated_at();

-- AGENT RUNS (audit log of every orchestrator session)
create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  task_id uuid,
  prompt text not null,
  steps jsonb not null default '[]'::jsonb,
  status text not null default 'running',
  result text,
  tokens_used int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.agent_runs enable row level security;
create policy "own runs select" on public.agent_runs for select using (auth.uid() = user_id);
create policy "own runs insert" on public.agent_runs for insert with check (auth.uid() = user_id);
create policy "own runs update" on public.agent_runs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own runs delete" on public.agent_runs for delete using (auth.uid() = user_id);
create trigger agent_runs_set_updated_at before update on public.agent_runs for each row execute function public.handle_updated_at();
create index agent_runs_user_created_idx on public.agent_runs (user_id, created_at desc);

-- AGENT SCHEDULES (recurring autonomous prompts)
create table public.agent_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  cron text not null,
  prompt text not null,
  enabled boolean not null default true,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.agent_schedules enable row level security;
create policy "own schedules select" on public.agent_schedules for select using (auth.uid() = user_id);
create policy "own schedules insert" on public.agent_schedules for insert with check (auth.uid() = user_id);
create policy "own schedules update" on public.agent_schedules for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own schedules delete" on public.agent_schedules for delete using (auth.uid() = user_id);
create trigger agent_schedules_set_updated_at before update on public.agent_schedules for each row execute function public.handle_updated_at();
