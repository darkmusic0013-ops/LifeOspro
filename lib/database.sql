-- LifeOS Pro — Supabase Database Schema
-- FASE 1-D: Migracion desde localStorage a tablas reales por modulo.
-- Ejecutar este archivo en Supabase SQL Editor.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Ramon Velez',
  focus text not null default '',
  reminder_time text not null default '08:00',
  preferred_view text not null default 'Dashboard',
  theme text not null default 'Claro',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null default 'Personal',
  due text not null default 'Hoy',
  priority text not null default 'Media' check (priority in ('Alta','Media','Baja')),
  status text not null default 'Pendiente' check (status in ('Pendiente','En progreso','Completada')),
  done boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  current numeric not null default 0,
  target numeric not null default 100,
  unit text not null default '',
  category text not null default 'Personal',
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  amount numeric not null default 0,
  category text not null default 'Mensual',
  type text not null default 'Gasto' check (type in ('Gasto','Plan futuro')),
  expense_date date not null default current_date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  note text not null default '',
  category text not null default 'Personal',
  priority text not null default 'Media' check (priority in ('Alta','Media','Baja')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day text not null default 'Hoy',
  breakfast text not null default '',
  lunch text not null default '',
  dinner text not null default '',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_created_at_idx on public.tasks(user_id, created_at desc);
create index if not exists goals_user_id_created_at_idx on public.goals(user_id, created_at desc);
create index if not exists expenses_user_id_date_idx on public.expenses(user_id, expense_date desc);
create index if not exists ideas_user_id_created_at_idx on public.ideas(user_id, created_at desc);
create index if not exists meals_user_id_created_at_idx on public.meals(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.tasks enable row level security;
alter table public.goals enable row level security;
alter table public.expenses enable row level security;
alter table public.ideas enable row level security;
alter table public.meals enable row level security;

drop policy if exists "profiles are private" on public.profiles;
drop policy if exists "tasks are private" on public.tasks;
drop policy if exists "goals are private" on public.goals;
drop policy if exists "expenses are private" on public.expenses;
drop policy if exists "ideas are private" on public.ideas;
drop policy if exists "meals are private" on public.meals;

create policy "profiles are private" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "tasks are private" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals are private" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "expenses are private" on public.expenses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "ideas are private" on public.ideas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "meals are private" on public.meals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop trigger if exists set_profiles_updated_at on public.profiles;
drop trigger if exists set_tasks_updated_at on public.tasks;
drop trigger if exists set_goals_updated_at on public.goals;
drop trigger if exists set_expenses_updated_at on public.expenses;
drop trigger if exists set_ideas_updated_at on public.ideas;
drop trigger if exists set_meals_updated_at on public.meals;

create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger set_tasks_updated_at before update on public.tasks for each row execute function public.set_updated_at();
create trigger set_goals_updated_at before update on public.goals for each row execute function public.set_updated_at();
create trigger set_expenses_updated_at before update on public.expenses for each row execute function public.set_updated_at();
create trigger set_ideas_updated_at before update on public.ideas for each row execute function public.set_updated_at();
create trigger set_meals_updated_at before update on public.meals for each row execute function public.set_updated_at();
