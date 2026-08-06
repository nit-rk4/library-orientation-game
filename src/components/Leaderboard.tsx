import type { LeaderboardEntry } from '../types/game'
import { LeaderboardRow } from './LeaderboardRow'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
}

export function Leaderboard({ entries }: LeaderboardProps) {
  const topEntries = entries.slice(0, 8)

  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      <div className="leaderboard__heading">
        <div>
          <p className="eyebrow">LOCAL ARCADE</p>
          <h2 id="leaderboard-title">High Scores</h2>
        </div>
        <span className="leaderboard__live"><i /> SYNCED</span>
      </div>
      {topEntries.length > 0 ? (
        <ol className="leaderboard__list">
          {topEntries.map((entry, index) => (
            <LeaderboardRow entry={entry} key={entry.id} rank={index + 1} />
          ))}
        </ol>
      ) : (
        <div className="leaderboard__empty">
          <span className="signal-dot" />
          NO HIGH SCORES YET — CLAIM THE FIRST SLOT!
        </div>
      )}
    </section>
  )
}
