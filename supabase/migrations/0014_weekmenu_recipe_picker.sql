alter table public.weekly_menu_entries alter column recipe_id drop not null;
alter table public.weekly_menu_entries
  add column if not exists curated_recipe_id uuid references public.curated_recipes(id) on delete cascade;

alter table public.weekly_menu_entries drop constraint if exists weekly_menu_one_recipe_source;
alter table public.weekly_menu_entries add constraint weekly_menu_one_recipe_source
  check ((recipe_id is not null)::integer + (curated_recipe_id is not null)::integer = 1);

drop policy if exists "weekly_menu_insert_own" on public.weekly_menu_entries;
create policy "weekly_menu_insert_own" on public.weekly_menu_entries for insert to authenticated
with check (
  (select auth.uid()) = user_id and (
    (recipe_id is not null and exists (select 1 from public.recipes r where r.id = recipe_id and (r.user_id = (select auth.uid()) or r.is_public)))
    or (curated_recipe_id is not null and exists (select 1 from public.curated_recipes c where c.id = curated_recipe_id and c.published))
  )
);

drop policy if exists "weekly_menu_update_own" on public.weekly_menu_entries;
create policy "weekly_menu_update_own" on public.weekly_menu_entries for update to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id and (
    (recipe_id is not null and exists (select 1 from public.recipes r where r.id = recipe_id and (r.user_id = (select auth.uid()) or r.is_public)))
    or (curated_recipe_id is not null and exists (select 1 from public.curated_recipes c where c.id = curated_recipe_id and c.published))
  )
);
