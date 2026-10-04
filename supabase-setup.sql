-- Trip Manager Cloud Storage
-- Run this entire script in Supabase SQL Editor.

create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state enable row level security;

drop policy if exists "Users can read own state" on public.app_state;
create policy "Users can read own state"
on public.app_state for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own state" on public.app_state;
create policy "Users can insert own state"
on public.app_state for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own state" on public.app_state;
create policy "Users can update own state"
on public.app_state for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Realtime is used for multi-device synchronization.
alter table public.app_state replica identity full;
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'app_state'
  ) then
    alter publication supabase_realtime add table public.app_state;
  end if;
end $$;
