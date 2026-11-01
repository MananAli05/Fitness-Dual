alter table public.profiles
  add column if not exists activity_level text
  check (activity_level in ('low', 'moderate', 'high'));
alter table public.profiles
  add column if not exists onboarded boolean not null default false;
