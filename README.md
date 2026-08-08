# Library Game Central

A mobile-first pixel-arcade experience for college library orientation. Each
student takes on one connected two-level run: **KnowsMore’s Missing Word**
first, followed automatically by **Ralph’s True-or-False Smash**.

## Experience

The app is designed for one individual player. The landing page offers one
`PRESS START` action, one `LEADERBOARD` action, and a compact preview of both
levels.

### Level 1 — KnowsMore

KnowsMore asks the player to restore ten corrupted library records through an
autocomplete search console. Choices are reshuffled for every run. Each query
has a 15-second active window.

### Level 2 — Ralph

Ralph loads automatically after KnowsMore. It presents ten useful library
orientation statements. The player uses `SAVE IT` for verified information and
`SMASH IT` for false information.

Both levels award 1,000 points for a correct answer, 25 points per remaining
second, and an escalating streak bonus capped at 400 points per question. The
streak carries through the level transition. The final report combines
accuracy and points from all 20 rounds, and only that full-run result is saved.

The visual language is an original retro arcade/search-system hybrid: charcoal
cabinet construction, brick-red and gold details, cobalt screens, mint signals,
code-native pixel art, and optional synthesized sound. It is intended to feel
like a purposeful college game, not a plain classroom quiz.

## Routes

- `/#/` — landing page and two-level run preview
- `/#/knowsmore` — starts the full run at Level 1
- `/#/ralph` — compatibility entry that also starts the full run at Level 1
- `/#/leaderboard` — combined-run high scores

## Run locally

Requirements: Node.js 20 or newer and a Supabase project.

```bash
npm install
cp .env.example .env.local
npm run dev
```

On PowerShell, use `Copy-Item .env.example .env.local` instead of `cp`. Open the
URL shown by Vite, usually `http://localhost:5173`.

Available commands:

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create the production build
npm run preview   # Preview the production build
```

## Supabase leaderboard setup

1. Create a Supabase project.
2. In its SQL Editor, run the migrations in `supabase/migrations/` in filename
   order. Existing projects with a populated `public.leaderboard` table must run
   `20260808000001_configure_leaderboard_access.sql` and
   `20260808000002_expand_combined_run_scores.sql`.
3. In Supabase, open **Project Settings → API Keys**.
4. Copy `.env.example` to `.env.local` and provide:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
   ```

5. Restart Vite after changing environment variables.

Use the browser-safe publishable key or legacy `anon` key. Never expose a
Supabase secret or `service_role` key in a `VITE_` variable.

The migrations create or configure `public.leaderboard`, its ranking index,
database constraints, and Row Level Security policies. Anonymous clients may
read and insert validated score rows, but cannot update or delete them.

Scores are ranked by:

1. correct answers, descending;
2. combined arcade points, descending;
3. server timestamp, ascending.

The browser sends a stable UUID with each score. A retry reuses that UUID so an
interrupted response does not create a duplicate entry.

### Existing leaderboard data

Earlier KnowsMore-only records remain readable. Version 3 and older rows display
against 10 questions; version 4 combined-run rows display against 20. Legacy
local scores are normalized into the shared shape but are never uploaded
silently.

If Supabase is unavailable, gameplay continues. The app shows cached scores
when available and reports a clear `SETUP NEEDED`, `CACHED`, or `OFFLINE` state
instead of crashing.

### Vercel

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` for every deployed
environment. Use `npm run build` and publish the `dist` directory. Hash routes
do not require an SPA rewrite.

## Project structure

```text
src/
  audio/       Optional synthesized arcade sound controller
  components/  Shared shell, controls, leaderboard, and HUD
  data/        KnowsMore questions, Ralph signals, programs, level metadata
  lib/         Configured third-party clients
  pages/       Portal, registration, both levels, transition, and results
  services/    Leaderboard data access
  styles/      Responsive pixel-cabinet and game styling
  types/       Shared game and leaderboard models
  utils/       Scoring, randomization, normalization, cache, and formatting
supabase/
  migrations/  Database schema and RLS policies
```

The included score submission model is appropriate for a low-stakes
orientation game. For prizes or formal competition, move score validation to a
trusted server or Supabase Edge Function.
