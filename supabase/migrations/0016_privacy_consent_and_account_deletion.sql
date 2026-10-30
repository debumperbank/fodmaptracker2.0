-- Explicit health-data consent and in-app account deletion.
-- Run this in the Supabase SQL editor as the database owner (postgres).
-- delete_own_account() must be able to delete the caller's auth.users row and their storage objects.
-- No service-role key is required.

alter table public.profiles
  add column if not exists health_data_consent_at timestamptz,
  add column if not exists privacy_notice_version text;

alter table public.profiles drop constraint if exists profiles_privacy_notice_version_length;
alter table public.profiles add constraint profiles_privacy_notice_version_length
  check (privacy_notice_version is null or char_length(privacy_notice_version) between 1 and 40);

comment on column public.profiles.health_data_consent_at is
  'Timestamp of explicit consent for health-data processing. Null means no consent is stored.';
comment on column public.profiles.privacy_notice_version is
  'Version id of the privacy notice accepted together with the health-data consent.';

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  consent_given boolean := new.raw_user_meta_data->>'health_data_consent' = 'true';
  notice_version text := nullif(left(coalesce(new.raw_user_meta_data->>'privacy_notice_version', ''), 40), '');
begin
  insert into public.profiles (id, preferred_language, health_data_consent_at, privacy_notice_version)
  values (
    new.id,
    case when new.raw_user_meta_data->>'preferred_language' in ('nl', 'fr', 'de', 'en')
      then new.raw_user_meta_data->>'preferred_language' else 'en' end,
    case when consent_given and notice_version is not null then now() else null end,
    case when consent_given then notice_version else null end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Deletes only the signed-in user. The id comes from auth.uid(), never from a client argument.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;

  delete from storage.objects
  where bucket_id in ('meal-photos', 'profile-photos')
    and name like uid::text || '/%';

  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
