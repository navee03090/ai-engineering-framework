-- AEF Phase 11 — Incident file attachments metadata

create table public.incident_attachments (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid not null references public.incidents (id) on delete cascade,
  uploader_id uuid references auth.users (id) on delete set null,
  storage_path text not null,
  file_name text not null,
  mime_type text not null,
  file_size bigint not null check (file_size > 0),
  category text not null check (category in ('image', 'pdf', 'audio', 'document', 'other')),
  created_at timestamptz not null default now()
);

alter table public.incident_attachments enable row level security;

create policy "Authenticated users can view incident attachments"
  on public.incident_attachments for select
  to authenticated
  using (true);

create policy "Authenticated users can add incident attachments"
  on public.incident_attachments for insert
  to authenticated
  with check (auth.uid() = uploader_id);

create policy "Uploaders can delete own incident attachments"
  on public.incident_attachments for delete
  to authenticated
  using (auth.uid() = uploader_id);

create index incident_attachments_incident_id_idx
  on public.incident_attachments (incident_id);
