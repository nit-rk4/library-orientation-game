import type { LeaderboardEntry, LeaderboardLoadStatus } from '../types/leaderboard'
import { sortLeaderboard } from '../utils/leaderboard'
import { LeaderboardRow } from './LeaderboardRow'

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  status: LeaderboardLoadStatus
}

const statusCopy: Record<LeaderboardLoadStatus, string> = {
  loading: 'LOADING',
  synced: 'ONLINE',
  cached: 'CACHED',
  unconfigured: 'SETUP NEEDED',
  error: 'OFFLINE',
}

export function Leaderboard({ entries, status }: LeaderboardProps) {
  const topEntries = sortLeaderboard(entries).slice(0, 8)
  const isOnline = status === 'synced'

  return (
    <section className="leaderboard" aria-labelledby="leaderboard-title">
      <div className="leaderboard__heading">
        <div>
          <p className="eyebrow">CAMPUS ARCADE</p>
          <h2 id="leaderboard-title">High Scores</h2>
        </div>
        <span className={`leaderboard__live leaderboard__live--${status}`} aria-live="polite"><i /> {statusCopy[status]}</span>
      </div>
      {status === 'loading' ? (
        <div className="leaderboard__empty" role="status"><span className="signal-dot" /> CONTACTING SCORE SERVER...</div>
      ) : topEntries.length > 0 ? (
        <ol className="leaderboard__list">
          {topEntries.map((entry, index) => (
            <LeaderboardRow entry={entry} key={entry.id} rank={index + 1} />
          ))}
        </ol>
      ) : (
        <div className="leaderboard__empty">
          <span className="signal-dot" />
          {isOnline ? 'NO HIGH SCORES YET — CLAIM THE FIRST SLOT!' : 'SCORES UNAVAILABLE — GAMEPLAY STILL ONLINE.'}
        </div>
      )}
      {(status === 'cached' || status === 'unconfigured') && topEntries.length > 0 && (
        <p className="leaderboard__notice">Showing the last scores saved on this device.</p>
      )}
    </section>
  )
}
