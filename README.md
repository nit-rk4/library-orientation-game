# Library Game Central

A mobile-first, pixel-arcade experience for college library orientation. The
current release includes a complete **KnowsMore’s Missing Word** search-system
game, a cabinet-selection portal, and a locked preview for the future Ralph
module.

## Design standard

> The experience should feel like software created for college freshmen at a
> technology-forward campus—not a basic quiz covered in neon styling.
> Sophistication should come from interaction, presentation, and meaningful
> feedback, while the questions remain fair to students with no previous
> library training.

The challenge begins with familiar concepts and progresses to applied library
and research terms. It avoids both kindergarten-level prompts and specialist
library-science trivia. See [PROJECT_BRIEF.md](PROJECT_BRIEF.md) for the full
product direction.

The visual language is original: a charcoal arcade cabinet, brick-red and gold
construction details, cobalt screens, mint search signals, code-native pixel
art, and synthesized sound effects that begin muted. No licensed artwork or
character likenesses are included.

## Current modules

- **KnowsMore’s Missing Word — online:** restore 10 corrupted library records
  through an autocomplete search console.
- **Ralph’s True-or-False Smash — preview only:** a locked page documents the
  planned `SAVE IT / SMASH IT` concept. No Ralph gameplay is included yet.

The portal uses static-hosting-friendly hash routes:

- `/#/` — Library Game Central
- `/#/knowsmore` — KnowsMore game
- `/#/ralph` — Ralph preview

## KnowsMore gameplay

1. Create a local profile with three initials and a program.
2. Inspect the corrupted library term and its contextual clue.
3. Select an indexed autocomplete result and execute the search.
4. Restore 10 records with a 15-second active query window for each one.
5. Earn 1,000 points for a correct result, 25 points per remaining second, and
   an escalating streak bonus capped at 400 points per question.
6. Restore at least 7 of 10 records to pass.

Accuracy determines leaderboard position first, followed by arcade points and
then the earliest submission time.

## Run locally

Requirements: [Node.js](https://nodejs.org/) 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL shown by Vite, usually `http://localhost:5173`.

## Available commands

```bash
npm run dev       # Start the development server
npm run build     # Type-check and create a production build
npm run preview   # Preview the production build
```

## Project structure

```text
src/
  audio/       Optional synthesized arcade sound controller
  components/  Shared shell and game UI
  data/        Questions, programs, and game-module registry
  pages/       Portal, KnowsMore screens, and Ralph preview
  styles/      Responsive pixel-cabinet and game styling
  types/       Shared TypeScript models
  utils/       Scoring, formatting, and browser storage
```

New games should be registered in `src/data/gameModules.ts`, mounted as a route
in `src/App.tsx`, and implemented as an isolated page/module. Shared primitives
belong in `src/components`.

## Leaderboard storage

The leaderboard is a local placeholder backed by `localStorage`; scores are not
shared across devices. Version 1 records are normalized automatically into the
new accuracy-and-points schema. If browser storage is unavailable, the result
remains visible and the interface reports that the sync failed.
