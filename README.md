# Library Game Central

A mobile-first pixel-arcade experience for college library orientation. The
current release contains the complete **KnowsMore’s Missing Word** game, a
cabinet-selection portal, and a locked preview for the future Ralph module.

## Design standard

> The experience should feel like software created for college freshmen at a
> technology-forward campus—not a basic quiz covered in neon styling.
> Sophistication should come from interaction, presentation, and meaningful
> feedback, while the questions remain fair to students with no previous
> library training.

The visual language is original: a charcoal arcade cabinet, brick-red and gold
construction details, cobalt screens, mint search signals, code-native pixel
art, and synthesized sound effects that begin muted. No licensed artwork or
character likenesses are included. See [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for
the full product direction.

## Current modules and routes

- `/#/` — Library Game Central
- `/#/knowsmore` — playable KnowsMore game
- `/#/ralph` — locked Ralph preview; no Ralph gameplay is included

KnowsMore asks the player to restore ten corrupted library records through an
autocomplete search console. Each query has a 15-second active window. A
correct answer earns 1,000 points, 25 points per remaining second, and an
escalating streak bonus capped at 400 points per question. Seven correct
answers are required to pass.

## Run locally

Requirements: [Node.js](https://nodejs.org/) 20 or newer and a Supabase project.

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
2. Open its SQL Editor and run
   [`supabase/migrations/20260808000000_create_leaderboard_scores.sql`](supabase/migrations/20260808000000_create_leaderboard_scores.sql).
3. In Supabase, open **Project Settings → API Keys**.
4. Copy `.env.example` to `.env.local` and provide:

   ```dotenv
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
   ```

5. Restart Vite after changing environment variables.

Use the browser-safe publishable key (or a legacy `anon` key if your project
still uses one). Never expose a Supabase secret key or `service_role` key in a
`VITE_` variable: Vite embeds those values into the browser bundle.

The migration creates `public.leaderboard_scores`, database constraints, the
ranking index, and Row Level Security policies. Anonymous clients may read and
insert validated score rows, but they cannot update or delete them. The server
owns `created_at`, so clients cannot choose an earlier timestamp to win a tie.

Scores are ranked consistently by:

1. correct answers, descending;
2. arcade points, descending;
3. server timestamp, ascending.

The browser sends a stable UUID with each score. A retry reuses that UUID, so a
request that succeeded before its response was interrupted does not create a
duplicate entry.

### Vercel

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Vercel
project’s environment-variable settings for every environment you deploy.
Use the default Vite build command (`npm run build`) and output directory
(`dist`). The app uses hash routes, so no SPA rewrite is required.

## Offline and migration behavior

Supabase is the source of truth whenever it is configured and reachable. After
each successful load or save, the normalized leaderboard snapshot is cached in
`localStorage` for read-only offline display.

If environment variables are missing, the network fails, RLS is misconfigured,
or browser storage is unavailable:

- gameplay and scoring continue normally;
- the UI reports `SETUP NEEDED`, `CACHED`, or `OFFLINE` instead of claiming a
  successful sync;
- a failed score is not presented as saved;
- an empty or unavailable table renders a safe empty state.

Records from the old `knowsmore-missing-word-leaderboard` key are normalized
into the shared versioned shape. Legacy `score` values become correct-answer
counts, and arcade points fall back to 1,000 per correct answer. Invalid rows
and exact duplicates are ignored. Legacy data remains only a fallback cache; it
is not uploaded silently to the shared leaderboard.

## Project structure

```text
src/
  audio/       Optional synthesized arcade sound controller
  components/  Shared shell and game UI
  data/        Questions, programs, and game-module registry
  lib/         Configured third-party clients
  pages/       Portal, KnowsMore screens, and Ralph preview
  services/    Backend data-access modules
  styles/      Responsive pixel-cabinet and game styling
  types/       Shared game and leaderboard models
  utils/       Pure scoring, normalization, cache, and formatting helpers
supabase/
  migrations/  Database schema and RLS policies
```

New games should register in `src/data/gameModules.ts`, mount a route in
`src/App.tsx`, and use their own `gameId` with the shared leaderboard service.

## Security note

The included setup is appropriate for a low-stakes orientation high-score
board, but browser-calculated scores can be forged by a determined user. For a
competitive or prize-bearing leaderboard, move score validation to a trusted
Supabase Edge Function or another server-side endpoint before accepting public
submissions.
