create table if not exists public.leaderboard_scores (
  id uuid primary key,
  game_id text not null,
  initials text not null,
  program text not null,
  correct_answers smallint not null,
  arcade_points integer not null,
  best_streak smallint not null,
  version smallint not null default 3,
  created_at timestamptz not null default now(),
  constraint leaderboard_game_id_length check (char_length(game_id) between 1 and 40),
  constraint leaderboard_initials_format check (initials ~ '^[A-Z]{3}$'),
  constraint leaderboard_program_length check (char_length(program) between 1 and 100),
  constraint leaderboard_correct_answers_range check (correct_answers between 0 and 10),
  constraint leaderboard_arcade_points_range check (arcade_points between 0 and 100000),
  constraint leaderboard_best_streak_range check (best_streak between 0 and 10),
  constraint leaderboard_version_range check (version >= 1)
);

create index if not exists leaderboard_scores_rank_idx
  on public.leaderboard_scores (
    game_id,
    correct_answers desc,
    arcade_points desc,
    created_at asc
  );

alter table public.leaderboard_scores enable row level security;

revoke update, delete on table public.leaderboard_scores from anon, authenticated;
revoke insert on table public.leaderboard_scores from anon, authenticated;
grant select on table public.leaderboard_scores to anon, authenticated;
grant insert (
  id,
  game_id,
  initials,
  program,
  correct_answers,
  arcade_points,
  best_streak,
  version
) on table public.leaderboard_scores to anon, authenticated;

drop policy if exists "Public leaderboard scores are readable" on public.leaderboard_scores;
create policy "Public leaderboard scores are readable"
  on public.leaderboard_scores
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Validated leaderboard scores are insertable" on public.leaderboard_scores;
create policy "Validated leaderboard scores are insertable"
  on public.leaderboard_scores
  for insert
  to anon, authenticated
  with check (
    char_length(game_id) between 1 and 40
    and initials ~ '^[A-Z]{3}$'
    and char_length(program) between 1 and 100
    and correct_answers between 0 and 10
    and arcade_points between 0 and 100000
    and best_streak between 0 and 10
    and version >= 1
  );
