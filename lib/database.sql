-- LifeOS Pro database foundation for Supabase
-- Run this later inside Supabase SQL editor after creating the project.

create table if not exists lifeos_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  focus text,
  reminder_time text,
  preferred_view text,
  theme text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists lifeos_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  module text not null,
  data jsonb not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table lifeos_profiles enable row level security;
alter table lifeos_items enable row level security;

create policy "profiles are private" on lifeos_profiles
  for all using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "items are private" on lifeos_items
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
