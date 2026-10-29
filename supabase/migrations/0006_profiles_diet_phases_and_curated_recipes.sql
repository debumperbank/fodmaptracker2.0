-- Profieluitbreiding, herstartbare dieetfasen en bronvermelde receptsuggesties.
begin;

alter table public.profiles
  add column if not exists username text,
  add column if not exists avatar_path text check (avatar_path is null or char_length(avatar_path) <= 500);

create unique index if not exists profiles_username_unique_idx
  on public.profiles (lower(username)) where username is not null;

alter table public.profiles drop constraint if exists profiles_username_format;
alter table public.profiles add constraint profiles_username_format
  check (username is null or username ~ '^[A-Za-z0-9_]{3,30}$');

create table if not exists public.diet_phases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  phase_type text not null check (phase_type in ('elimination','reintroduction','maintenance')),
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  started_at date not null default current_date,
  planned_end_at date,
  ended_at date,
  created_at timestamptz not null default now(),
  check (planned_end_at is null or planned_end_at >= started_at),
  check (ended_at is null or ended_at >= started_at)
);
create unique index if not exists diet_phases_one_active_per_user_idx
  on public.diet_phases(user_id) where status = 'active';
create index if not exists diet_phases_user_started_idx
  on public.diet_phases(user_id, started_at desc);

create table if not exists public.curated_recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  summary text not null check (char_length(summary) <= 500),
  category text not null check (category in ('ontbijt','lunch','avondeten','tussendoor')),
  source_name text not null,
  source_url text not null unique,
  suitable_for_elimination boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.recipe_likes (
  user_id uuid not null references auth.users(id) on delete cascade,
  curated_recipe_id uuid not null references public.curated_recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, curated_recipe_id)
);

insert into public.curated_recipes
  (title, summary, category, source_name, source_url, suitable_for_elimination)
values
  ('Havermout-banaanpannenkoeken', 'Een vezelrijk ontbijt met haver, rijstmeel en stevige banaan. Controleer altijd de genoemde porties.', 'ontbijt', 'Monash FODMAP', 'https://www.monashfodmap.com/recipe/oat-and-banana-pancakes/', true),
  ('Ontbijttortilla’s', 'Maïstortilla’s met ei, tomaat, kaas en lactosevrije yoghurt.', 'ontbijt', 'Monash FODMAP', 'https://www.monashfodmap.com/recipe/breakfast-tortillas/', true),
  ('Worteltaartpap', 'Warme havermout met wortel, kaneel, zaden en walnoten.', 'ontbijt', 'Monash FODMAP', 'https://www.monashfodmap.com/recipe/carrot-cake-porridge/', true),
  ('Quinoapap met banaan en yoghurt', 'Glutenvrij ontbijt met quinoa, lactosevrije zuivel en een afgemeten portie banaan.', 'ontbijt', 'Monash FODMAP', 'https://monashfodmap.com/recipe/quinoa-porridge-banana-yoghurt/', true),
  ('Spinazie-feta-omelet', 'Snelle omelet met spinazie, feta en pijnboompitten.', 'lunch', 'Monash FODMAP', 'https://www.monashfodmap.com/recipe/spinach-feta-pinenut-omelette/', true)
on conflict (source_url) do update set
  title = excluded.title,
  summary = excluded.summary,
  category = excluded.category,
  source_name = excluded.source_name,
  suitable_for_elimination = excluded.suitable_for_elimination,
  published = true;

alter table public.diet_phases enable row level security;
alter table public.curated_recipes enable row level security;
alter table public.recipe_likes enable row level security;

create policy "diet_phases_select_own" on public.diet_phases for select to authenticated using ((select auth.uid()) = user_id);
create policy "diet_phases_insert_own" on public.diet_phases for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "diet_phases_update_own" on public.diet_phases for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "curated_recipes_read_published" on public.curated_recipes for select to authenticated using (published = true);
create policy "recipe_likes_select_own" on public.recipe_likes for select to authenticated using ((select auth.uid()) = user_id);
create policy "recipe_likes_insert_own" on public.recipe_likes for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "recipe_likes_delete_own" on public.recipe_likes for delete to authenticated using ((select auth.uid()) = user_id);

revoke all privileges on table public.diet_phases, public.curated_recipes, public.recipe_likes from anon, public;
grant select, insert, update on table public.diet_phases to authenticated;
grant select on table public.curated_recipes to authenticated;
grant select, insert, delete on table public.recipe_likes to authenticated;

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('profile-photos','profile-photos',false,3145728,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=false,file_size_limit=3145728,allowed_mime_types=array['image/jpeg','image/png','image/webp'];

create policy "profile_photos_select_own" on storage.objects for select to authenticated using (bucket_id='profile-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "profile_photos_insert_own" on storage.objects for insert to authenticated with check (bucket_id='profile-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "profile_photos_update_own" on storage.objects for update to authenticated using (bucket_id='profile-photos' and (storage.foldername(name))[1]=(select auth.uid())::text) with check (bucket_id='profile-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy "profile_photos_delete_own" on storage.objects for delete to authenticated using (bucket_id='profile-photos' and (storage.foldername(name))[1]=(select auth.uid())::text);

commit;
