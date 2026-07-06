-- CivicAI Phase 2 — Government knowledge + citizen persistence

-- Extend profiles with language preference
alter table public.profiles
  add column if not exists preferred_language text not null default 'en'
    check (preferred_language in ('en', 'ur'));

-- Structured government services (mock/seed data for hackathon)
create table public.government_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  department text not null,
  office_name text,
  office_address text,
  description text not null,
  fee text not null,
  processing_time text not null,
  instructions jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  icon text,
  popular boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.government_services enable row level security;

create policy "Authenticated users can view government services"
  on public.government_services for select
  to authenticated
  using (true);

create trigger government_services_set_updated_at
  before update on public.government_services
  for each row execute function public.set_updated_at();

-- Citizen AI requests (query pipeline)
create table public.citizen_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  query text not null,
  language text not null default 'en' check (language in ('en', 'ur')),
  detected_intent text,
  service_slug text references public.government_services (slug) on delete set null,
  confidence integer check (confidence >= 0 and confidence <= 100),
  status text not null default 'completed'
    check (status in ('pending', 'processing', 'completed', 'failed', 'clarify')),
  pipeline_result jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.citizen_requests enable row level security;

create policy "Users can view own citizen requests"
  on public.citizen_requests for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create own citizen requests"
  on public.citizen_requests for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own citizen requests"
  on public.citizen_requests for update
  to authenticated
  using (auth.uid() = user_id);

create trigger citizen_requests_set_updated_at
  before update on public.citizen_requests
  for each row execute function public.set_updated_at();

-- Document verifications (upload pipeline)
create table public.document_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  service_slug text references public.government_services (slug) on delete set null,
  storage_path text,
  file_name text,
  mime_type text,
  ocr_result jsonb,
  compliance_result jsonb,
  confidence integer check (confidence >= 0 and confidence <= 100),
  status text not null default 'completed'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.document_verifications enable row level security;

create policy "Users can view own document verifications"
  on public.document_verifications for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create own document verifications"
  on public.document_verifications for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own document verifications"
  on public.document_verifications for update
  to authenticated
  using (auth.uid() = user_id);

create trigger document_verifications_set_updated_at
  before update on public.document_verifications
  for each row execute function public.set_updated_at();

-- Generated citizen reports
create table public.citizen_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  request_id uuid references public.citizen_requests (id) on delete set null,
  verification_id uuid references public.document_verifications (id) on delete set null,
  service_slug text,
  summary text not null,
  report_json jsonb not null,
  qr_data text,
  created_at timestamptz not null default now()
);

alter table public.citizen_reports enable row level security;

create policy "Users can view own citizen reports"
  on public.citizen_reports for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create own citizen reports"
  on public.citizen_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Agent run audit trail
create table public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  parent_type text not null check (parent_type in ('request', 'verification')),
  parent_id uuid not null,
  agent_name text not null,
  input jsonb,
  output jsonb,
  success boolean not null default true,
  duration_ms integer,
  created_at timestamptz not null default now()
);

alter table public.agent_runs enable row level security;

create policy "Users can view own agent runs"
  on public.agent_runs for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can create own agent runs"
  on public.agent_runs for insert
  to authenticated
  with check (auth.uid() = user_id);

create index citizen_requests_user_created_idx
  on public.citizen_requests (user_id, created_at desc);

create index document_verifications_user_created_idx
  on public.document_verifications (user_id, created_at desc);

create index citizen_reports_user_created_idx
  on public.citizen_reports (user_id, created_at desc);

create index agent_runs_parent_idx
  on public.agent_runs (parent_type, parent_id);

create index government_services_category_idx
  on public.government_services (category);

-- CivicAI document uploads bucket
insert into storage.buckets (id, name, public)
values ('civicai-documents', 'civicai-documents', false)
on conflict (id) do nothing;

create policy "Authenticated users can upload civicai documents"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'civicai-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users can read own civicai documents"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'civicai-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
