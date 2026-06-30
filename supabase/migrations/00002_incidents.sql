-- AEF Phase 8 — Incidents table for disaster response workflows

create table public.incidents (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references auth.users (id) on delete set null,
  title text not null,
  description text not null,
  location text,
  category text,
  severity text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'closed')),
  ai_summary text,
  recommended_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.incidents enable row level security;

create policy "Authenticated users can view incidents"
  on public.incidents for select
  to authenticated
  using (true);

create policy "Authenticated users can create incidents"
  on public.incidents for insert
  to authenticated
  with check (auth.uid() = reporter_id or reporter_id is null);

create policy "Authenticated users can update own incidents"
  on public.incidents for update
  to authenticated
  using (auth.uid() = reporter_id)
  with check (auth.uid() = reporter_id);

create trigger incidents_set_updated_at
  before update on public.incidents
  for each row execute function public.set_updated_at();

create index incidents_created_at_idx on public.incidents (created_at desc);
create index incidents_status_idx on public.incidents (status);
