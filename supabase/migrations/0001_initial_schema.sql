-- Fodmap Tracker 2.0 — initial schema
-- Run via Supabase SQL Editor or Supabase CLI. Do not disable RLS.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (display_name is null or char_length(display_name) <= 80),
  timezone text not null default 'Europe/Amsterdam',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.food_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  food_name text not null check (char_length(food_name) between 2 and 140),
  meal_type text not null check (meal_type in ('ontbijt','lunch','avondeten','tussendoor')),
  portion_description text check (portion_description is null or char_length(portion_description) <= 100),
  notes text check (notes is null or char_length(notes) <= 500),
  eaten_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists food_entries_user_eaten_idx on public.food_entries(user_id, eaten_at desc);

create table if not exists public.symptom_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  symptom_type text not null check (symptom_type in ('buikpijn','opgeblazen','winderigheid','stoelgang','misselijkheid','anders')),
  severity smallint not null check (severity between 0 and 10),
  notes text check (notes is null or char_length(notes) <= 500),
  experienced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists symptom_entries_user_experienced_idx on public.symptom_entries(user_id, experienced_at desc);

-- Catalog only stores vetted metadata; no FODMAP values are seeded without licensed/validated sources.
create table if not exists public.food_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_normalized text not null unique,
  source_name text not null,
  source_reference text,
  source_url text,
  verification_status text not null default 'unverified' check (verification_status in ('unverified','reviewed','verified','retired')),
  reviewed_by text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.food_fodmap_assessments (
  id uuid primary key default gen_random_uuid(),
  food_id uuid not null references public.food_catalog(id) on delete cascade,
  fodmap_group text not null check (fodmap_group in ('fructose','lactose','fructans','galactans','polyols','mixed')),
  portion_grams numeric(8,2) check (portion_grams is null or portion_grams > 0),
  assessment text not null check (assessment in ('low','moderate','high','unknown')) default 'unknown',
  evidence_source text not null,
  source_reference text,
  verified_by text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists fodmap_assessments_food_idx on public.food_fodmap_assessments(food_id);

alter table public.profiles enable row level security;
alter table public.food_entries enable row level security;
alter table public.symptom_entries enable row level security;
alter table public.food_catalog enable row level security;
alter table public.food_fodmap_assessments enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "food_entries_select_own" on public.food_entries;
create policy "food_entries_select_own" on public.food_entries for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "food_entries_insert_own" on public.food_entries;
create policy "food_entries_insert_own" on public.food_entries for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "food_entries_update_own" on public.food_entries;
create policy "food_entries_update_own" on public.food_entries for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "food_entries_delete_own" on public.food_entries;
create policy "food_entries_delete_own" on public.food_entries for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "symptom_entries_select_own" on public.symptom_entries;
create policy "symptom_entries_select_own" on public.symptom_entries for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "symptom_entries_insert_own" on public.symptom_entries;
create policy "symptom_entries_insert_own" on public.symptom_entries for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "symptom_entries_update_own" on public.symptom_entries;
create policy "symptom_entries_update_own" on public.symptom_entries for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists "symptom_entries_delete_own" on public.symptom_entries;
create policy "symptom_entries_delete_own" on public.symptom_entries for delete to authenticated using ((select auth.uid()) = user_id);

-- Authenticated users can read only reviewed/verified catalog data. Catalog edits stay server/admin-only.
drop policy if exists "catalog_read_reviewed" on public.food_catalog;
create policy "catalog_read_reviewed" on public.food_catalog for select to authenticated using (verification_status in ('reviewed','verified'));
drop policy if exists "assessment_read_verified" on public.food_fodmap_assessments;
create policy "assessment_read_verified" on public.food_fodmap_assessments for select to authenticated using (verified_at is not null and verified_by is not null);

-- Keep anonymous and authenticated users from direct catalog writes.
revoke insert, update, delete on public.food_catalog from anon, authenticated;
revoke insert, update, delete on public.food_fodmap_assessments from anon, authenticated;


-- Explicit grants keep permissions predictable across Supabase project defaults.
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.food_entries to authenticated;
grant select, insert, update, delete on public.symptom_entries to authenticated;
grant select on public.food_catalog to authenticated;
grant select on public.food_fodmap_assessments to authenticated;
