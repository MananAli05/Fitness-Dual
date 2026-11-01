create table if not exists public.workouts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title            text not null check (char_length(title) between 1 and 80),
  goal             text not null check (goal in ('bulk', 'cut')),
  started_at       timestamptz not null,
  finished_at      timestamptz not null,
  duration_seconds int not null check (duration_seconds >= 0),
  created_at       timestamptz not null default now()
);

create index if not exists workouts_user_started_idx
  on public.workouts (user_id, started_at desc);

alter table public.workouts enable row level security;

create policy "Users can view own workouts"
  on public.workouts for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own workouts"
  on public.workouts for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own workouts"
  on public.workouts for delete
  to authenticated
  using ((select auth.uid()) = user_id);


create table if not exists public.workout_sets (
  id            uuid primary key default gen_random_uuid(),
  workout_id    uuid not null references public.workouts (id) on delete cascade,
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  exercise_id   text not null,
  exercise_name text not null,
  position      int not null check (position >= 0),
  set_number    int not null check (set_number > 0),
  reps          int check (reps between 0 and 1000),
  weight_kg     numeric(6, 2) check (weight_kg between 0 and 1000),
  seconds       int check (seconds between 0 and 36000),
  created_at    timestamptz not null default now()
);

create index if not exists workout_sets_workout_idx
  on public.workout_sets (workout_id);

alter table public.workout_sets enable row level security;

create policy "Users can view own workout sets"
  on public.workout_sets for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert sets into own workouts"
  on public.workout_sets for insert
  to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.workouts
      where workouts.id = workout_id and workouts.user_id = (select auth.uid())
    )
  );

create policy "Users can delete own workout sets"
  on public.workout_sets for delete
  to authenticated
  using ((select auth.uid()) = user_id);


create table if not exists public.food_logs (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  log_date   date not null,
  meal       text not null check (meal in ('breakfast', 'lunch', 'dinner', 'snack')),
  name       text not null check (char_length(name) between 1 and 80),
  calories   int not null check (calories between 0 and 5000),
  protein_g  numeric(6, 1) not null default 0 check (protein_g between 0 and 500),
  carbs_g    numeric(6, 1) not null default 0 check (carbs_g between 0 and 1000),
  fat_g      numeric(6, 1) not null default 0 check (fat_g between 0 and 500),
  created_at timestamptz not null default now()
);

create index if not exists food_logs_user_date_idx
  on public.food_logs (user_id, log_date);

alter table public.food_logs enable row level security;

create policy "Users can view own food logs"
  on public.food_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own food logs"
  on public.food_logs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own food logs"
  on public.food_logs for delete
  to authenticated
  using ((select auth.uid()) = user_id);


create table if not exists public.water_logs (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  log_date   date not null,
  glasses    int not null default 0 check (glasses between 0 and 40),
  updated_at timestamptz not null default now(),
  primary key (user_id, log_date)
);

alter table public.water_logs enable row level security;

create policy "Users can view own water logs"
  on public.water_logs for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own water logs"
  on public.water_logs for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own water logs"
  on public.water_logs for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create trigger water_logs_set_updated_at
  before update on public.water_logs
  for each row execute function public.set_updated_at();
