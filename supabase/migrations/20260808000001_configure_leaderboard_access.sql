alter table public.leaderboard enable row level security;

revoke update, delete on table public.leaderboard from anon, authenticated;
revoke insert on table public.leaderboard from anon, authenticated;
grant select on table public.leaderboard to anon, authenticated;
grant insert (
  id,
  game_id,
  initials,
  program,
  correct_answers,
  arcade_points,
  best_streak,
  version
) on table public.leaderboard to anon, authenticated;

drop policy if exists "Public leaderboard scores are readable" on public.leaderboard;
create policy "Public leaderboard scores are readable"
  on public.leaderboard
  for select
  to anon, authenticated
  using (true);

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
