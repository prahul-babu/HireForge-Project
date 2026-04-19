create extension if not exists pgcrypto;

create table if not exists public.hireforge_profiles (
  client_id text primary key,
  full_name text default '',
  email text default '',
  headline text default '',
  phone text default '',
  location text default '',
  website text default '',
  linkedin_url text default '',
  github_username text default '',
  twitter_username text default '',
  summary text default '',
  skills jsonb default '[]'::jsonb,
  years_of_experience text default '',
  target_role text default '',
  target_companies text default '',
  availability text default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.hireforge_resume_analyses (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  target_role text not null,
  resume_text text not null default '',
  file_url text not null default '',
  ats_score integer not null default 0,
  role_match_score integer not null default 0,
  existing_skills jsonb not null default '[]'::jsonb,
  skills_gap jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  improved_resume text not null default '',
  career_roadmap jsonb not null default '[]'::jsonb,
  interview_questions jsonb not null default '[]'::jsonb,
  created_date timestamptz not null default now()
);

create index if not exists hireforge_resume_analyses_client_id_created_idx
  on public.hireforge_resume_analyses (client_id, created_date desc);

create table if not exists public.hireforge_wellness_entries (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  stress_level numeric not null default 5,
  sleep_hours numeric not null default 7,
  focus_score numeric not null default 5,
  energy_level numeric not null default 5,
  mood text not null default 'okay',
  notes text not null default '',
  date date not null,
  created_date timestamptz not null default now()
);

create index if not exists hireforge_wellness_entries_client_id_date_idx
  on public.hireforge_wellness_entries (client_id, date desc);

alter table public.hireforge_profiles enable row level security;
alter table public.hireforge_resume_analyses enable row level security;
alter table public.hireforge_wellness_entries enable row level security;

create policy "allow anon access to hireforge_profiles"
  on public.hireforge_profiles
  for all
  to anon
  using (true)
  with check (true);

create policy "allow anon access to hireforge_resume_analyses"
  on public.hireforge_resume_analyses
  for all
  to anon
  using (true)
  with check (true);

create policy "allow anon access to hireforge_wellness_entries"
  on public.hireforge_wellness_entries
  for all
  to anon
  using (true)
  with check (true);
