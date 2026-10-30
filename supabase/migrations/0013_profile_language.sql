alter table public.profiles
  add column if not exists preferred_language text not null default 'en';

alter table public.profiles alter column preferred_language set default 'en';

alter table public.profiles drop constraint if exists profiles_preferred_language_check;
alter table public.profiles add constraint profiles_preferred_language_check
  check (preferred_language in ('nl', 'fr', 'de', 'en'));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, preferred_language)
  values (
    new.id,
    case when new.raw_user_meta_data->>'preferred_language' in ('nl','fr','de','en')
      then new.raw_user_meta_data->>'preferred_language' else 'en' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
