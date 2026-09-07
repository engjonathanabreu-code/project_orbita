create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  start_date date not null default current_date,
  total_xp integer not null default 0 check (total_xp >= 0),
  current_streak integer not null default 0 check (current_streak >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.session_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_key text not null,
  week_number smallint not null check (week_number between 1 and 26),
  day_number smallint not null check (day_number between 1 and 6),
  minutes smallint not null check (minutes between 0 and 45),
  xp integer not null default 0 check (xp >= 0),
  focus_rating smallint check (focus_rating between 1 and 5),
  notes text check (char_length(notes) <= 2000),
  completed_at timestamptz not null default now(),
  unique (user_id, session_key)
);

create table public.game_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  game_key text not null check (game_key in ('attention','flexibility','spatial','verbal')),
  skill text not null,
  score numeric not null check (score >= 0),
  accuracy numeric check (accuracy between 0 and 100),
  reaction_ms integer check (reaction_ms >= 0),
  difficulty smallint not null default 1 check (difficulty between 1 and 10),
  metadata jsonb not null default '{}'::jsonb,
  played_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.session_logs enable row level security;
alter table public.game_scores enable row level security;
revoke all on table public.profiles, public.session_logs, public.game_scores from anon, authenticated;
grant select, insert, update on table public.profiles to authenticated;
grant select, insert, update, delete on table public.session_logs to authenticated;
grant select, insert, delete on table public.game_scores to authenticated;

create policy "profiles_select_own" on public.profiles for select to authenticated using ((select auth.uid()) = user_id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "logs_select_own" on public.session_logs for select to authenticated using ((select auth.uid()) = user_id);
create policy "logs_insert_own" on public.session_logs for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "logs_update_own" on public.session_logs for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "logs_delete_own" on public.session_logs for delete to authenticated using ((select auth.uid()) = user_id);
create policy "scores_select_own" on public.game_scores for select to authenticated using ((select auth.uid()) = user_id);
create policy "scores_insert_own" on public.game_scores for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "scores_delete_own" on public.game_scores for delete to authenticated using ((select auth.uid()) = user_id);
create index session_logs_user_id_idx on public.session_logs(user_id);
create index game_scores_user_id_idx on public.game_scores(user_id);
create index game_scores_user_played_idx on public.game_scores(user_id, played_at desc);
