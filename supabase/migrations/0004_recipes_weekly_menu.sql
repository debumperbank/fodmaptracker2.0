-- FODMAP Tracker 2.0 — persoonlijke recepten en weekmenu
begin;
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 2 and 120), description text check (description is null or char_length(description) <= 500),
  servings smallint not null default 2 check (servings between 1 and 24), preparation_minutes smallint check (preparation_minutes is null or preparation_minutes between 1 and 1440),
  ingredients text not null check (char_length(ingredients) between 3 and 5000), instructions text not null check (char_length(instructions) between 3 and 10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists recipes_user_updated_idx on public.recipes(user_id, updated_at desc);
create table if not exists public.weekly_menu_entries (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade, planned_for date not null,
  meal_type text not null check (meal_type in ('ontbijt','lunch','avondeten','tussendoor')), created_at timestamptz not null default now(),
  unique (user_id, planned_for, meal_type)
);
create index if not exists weekly_menu_user_date_idx on public.weekly_menu_entries(user_id, planned_for);
alter table public.recipes enable row level security;
alter table public.weekly_menu_entries enable row level security;
create policy "recipes_select_own" on public.recipes for select to authenticated using ((select auth.uid()) = user_id);
create policy "recipes_insert_own" on public.recipes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "recipes_update_own" on public.recipes for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "recipes_delete_own" on public.recipes for delete to authenticated using ((select auth.uid()) = user_id);
create policy "weekly_menu_select_own" on public.weekly_menu_entries for select to authenticated using ((select auth.uid()) = user_id);
create policy "weekly_menu_insert_own" on public.weekly_menu_entries for insert to authenticated with check ((select auth.uid()) = user_id and exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = (select auth.uid())));
create policy "weekly_menu_update_own" on public.weekly_menu_entries for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id and exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id = (select auth.uid())));
create policy "weekly_menu_delete_own" on public.weekly_menu_entries for delete to authenticated using ((select auth.uid()) = user_id);
revoke all privileges on table public.recipes, public.weekly_menu_entries from anon, public;
grant select, insert, update, delete on table public.recipes, public.weekly_menu_entries to authenticated;
commit;
