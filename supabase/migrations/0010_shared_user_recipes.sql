-- Recepten zijn standaard privé; makers kunnen ze expliciet openbaar delen.
begin;

alter table public.recipes add column if not exists is_public boolean not null default false;
do $$ begin
  alter table public.recipes add constraint recipes_profile_fk foreign key (user_id) references public.profiles(id) on delete cascade;
exception when duplicate_object then null;
end $$;
create index if not exists recipes_public_updated_idx on public.recipes(updated_at desc) where is_public = true;

drop policy if exists "recipes_select_own" on public.recipes;
create policy "recipes_select_own_or_public" on public.recipes for select to authenticated
  using ((select auth.uid()) = user_id or is_public = true);

commit;
