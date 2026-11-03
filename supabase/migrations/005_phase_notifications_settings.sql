alter table public.profiles
  add column if not exists phase_started_at timestamptz not null default now();

update public.profiles
  set phase_started_at = created_at
  where phase_started_at > created_at;

create or replace function public.reset_phase_start()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.goal is distinct from old.goal then
    new.phase_started_at = now();
  end if;
  return new;
end;
$$;

drop trigger if exists profiles_reset_phase_start on public.profiles;

create trigger profiles_reset_phase_start
  before update on public.profiles
  for each row execute function public.reset_phase_start();


create table if not exists public.user_settings (
  user_id           uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  workout_reminders boolean not null default true,
  meal_reminders    boolean not null default true,
  water_reminders   boolean not null default true,
  progress_updates  boolean not null default true,
  updated_at        timestamptz not null default now()
);

alter table public.user_settings enable row level security;

create policy "Users can view own settings"
  on public.user_settings for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own settings"
  on public.user_settings for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own settings"
  on public.user_settings for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger user_settings_set_updated_at
  before update on public.user_settings
  for each row execute function public.set_updated_at();


create table if not exists public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('reminder', 'progress')),
  title      text not null check (char_length(title) between 1 and 120),
  body       text not null check (char_length(body) <= 500),
  link       text check (link like '/%'),
  dedupe_key text not null check (char_length(dedupe_key) <= 120),
  read_at    timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, dedupe_key)
);

create index if not exists notifications_user_created_idx
  on public.notifications (user_id, created_at desc);

alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own notifications"
  on public.notifications for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own notifications"
  on public.notifications for delete
  to authenticated
  using ((select auth.uid()) = user_id);
