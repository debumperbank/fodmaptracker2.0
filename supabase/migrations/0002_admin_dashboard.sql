-- FODMAP Tracker 2.0 — admin dashboard and protected metrics
-- Run this migration in Supabase SQL Editor after the initial schema.
-- Then run the bootstrap INSERT at the bottom with your own account email.

create table if not exists public.app_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.app_admins enable row level security;
revoke all on table public.app_admins from anon, authenticated;

create or replace function public.is_app_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.app_admins a
    where a.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_app_admin() from public;
grant execute on function public.is_app_admin() to authenticated;

create or replace function public.get_admin_dashboard_stats()
returns jsonb
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  stats jsonb;
begin
  if (select auth.uid()) is null or not exists (
    select 1
    from public.app_admins a
    where a.user_id = (select auth.uid())
  ) then
    raise exception 'not authorized' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'generated_at', now(),
    'database_status', 'ok',
    'total_auth_users', (select count(*) from auth.users),
    'total_profiles', (select count(*) from public.profiles),
    'profiles_last_24h', (
      select count(*) from public.profiles
      where created_at >= now() - interval '24 hours'
    ),
    'profiles_last_7d', (
      select count(*) from public.profiles
      where created_at >= now() - interval '7 days'
    ),
    'auth_users_without_profile', (
      select count(*) from auth.users u
      where not exists (
        select 1 from public.profiles p where p.id = u.id
      )
    ),
    'total_food_entries', (select count(*) from public.food_entries),
    'food_entries_last_7d', (
      select count(*) from public.food_entries
      where created_at >= now() - interval '7 days'
    ),
    'total_symptom_entries', (select count(*) from public.symptom_entries),
    'symptom_entries_last_7d', (
      select count(*) from public.symptom_entries
      where created_at >= now() - interval '7 days'
    ),
    'latest_profile_created_at', (
      select max(created_at) from public.profiles
    ),
    'recent_signups', (
      select coalesce(
        jsonb_agg(jsonb_build_object('created_at', s.created_at) order by s.created_at desc),
        '[]'::jsonb
      )
      from (
        select created_at
        from public.profiles
        order by created_at desc
        limit 5
      ) s
    )
  )
  into stats;

  return stats;
end;
$$;

revoke all on function public.get_admin_dashboard_stats() from public;
grant execute on function public.get_admin_dashboard_stats() to authenticated;

-- ADMIN BOOTSTRAP:
-- After running this migration, replace the example email below with the email
-- you use to log in to FODMAP Tracker, then run this INSERT separately.
--
-- insert into public.app_admins (user_id)
-- select id from auth.users
-- where lower(email) = lower('your-login-email@example.com')
-- on conflict (user_id) do nothing;
