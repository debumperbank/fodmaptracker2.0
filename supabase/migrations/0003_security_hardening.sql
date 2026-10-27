-- FODMAP Tracker 2.0 — explicit least-privilege grants
-- Run this once in the Supabase SQL Editor after migrations 0001 and 0002.
-- This migration does not change user data or remove existing RLS policies.

begin;

alter table public.profiles enable row level security;
alter table public.food_entries enable row level security;
alter table public.symptom_entries enable row level security;
alter table public.food_catalog enable row level security;
alter table public.food_fodmap_assessments enable row level security;
alter table public.app_admins enable row level security;

-- Remove implicit/default access for anonymous users and PUBLIC.
revoke all privileges on table
  public.profiles,
  public.food_entries,
  public.symptom_entries,
  public.food_catalog,
  public.food_fodmap_assessments
from anon, public;

-- Only authenticated users receive table grants; RLS still limits row access.
grant select, insert, update, delete on table
  public.profiles,
  public.food_entries,
  public.symptom_entries
to authenticated;

grant select on table
  public.food_catalog,
  public.food_fodmap_assessments
to authenticated;

-- Catalog tables are read-only for app users.
revoke insert, update, delete on table
  public.food_catalog,
  public.food_fodmap_assessments
from anon, authenticated, public;

-- The admin allowlist is never directly readable or writable by app roles.
revoke all privileges on table public.app_admins from anon, authenticated, public;

-- These functions must not be callable by anonymous or PUBLIC roles.
revoke all privileges on function public.is_app_admin() from public, anon;
revoke all privileges on function public.get_admin_dashboard_stats() from public, anon;
grant execute on function public.is_app_admin() to authenticated;
grant execute on function public.get_admin_dashboard_stats() to authenticated;

-- The trigger runs under its security-definer owner; app users do not call it directly.
revoke all privileges on function public.handle_new_user() from public, anon, authenticated;

commit;
