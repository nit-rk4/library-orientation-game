alter table public.leaderboard
  alter column version set default 4;

alter table public.leaderboard
  drop constraint if exists leaderboard_correct_answers_range,
  drop constraint if exists leaderboard_best_streak_range;

alter table public.leaderboard
  add constraint leaderboard_correct_answers_range check (correct_answers between 0 and 20),
  add constraint leaderboard_best_streak_range check (best_streak between 0 and 20);

drop policy if exists "Validated leaderboard scores are insertable" on public.leaderboard;
create policy "Validated leaderboard scores are insertable"
  on public.leaderboard
  for insert
  to anon, authenticated
  with check (
    char_length(game_id) between 1 and 40
    and initials ~ '^[A-Z]{3}$'
    and char_length(program) between 1 and 100
    and correct_answers between 0 and 20
    and arcade_points between 0 and 100000
    and best_streak between 0 and 20
    and version >= 1
  );
