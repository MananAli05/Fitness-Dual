alter table public.profiles
  add column if not exists username text
  check (username ~ '^[A-Za-z]{3,20}$');

create unique index if not exists profiles_username_unique
  on public.profiles (lower(username));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url, goal)
  values (
    new.id,
    new.raw_user_meta_data ->> 'username',
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'username'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    case when new.raw_user_meta_data ->> 'goal' = 'cut' then 'cut' else 'bulk' end
  );
  return new;
end;
$$;
create or replace function public.email_registered(p_email text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from auth.users where lower(email) = lower(trim(p_email)));
$$;

create or replace function public.username_available(p_username text)
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(trim(p_username)));
$$;

revoke all on function public.email_registered(text) from public;
revoke all on function public.username_available(text) from public;
grant execute on function public.email_registered(text) to anon, authenticated;
grant execute on function public.username_available(text) to anon, authenticated;
