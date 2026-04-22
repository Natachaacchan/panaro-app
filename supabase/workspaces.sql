create table if not exists public.workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{"tasks":[],"projects":[],"notes":[],"events":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

create policy "Users can read own workspace"
on public.workspaces
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert own workspace"
on public.workspaces
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update own workspace"
on public.workspaces
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
