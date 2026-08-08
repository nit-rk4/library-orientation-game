import type { LeaderboardEntry } from '../types/leaderboard'
import { formatPoints, formatTimestamp } from '../utils/format'

interface LeaderboardRowProps {
  entry: LeaderboardEntry
  rank: number
}

export function LeaderboardRow({ entry, rank }: LeaderboardRowProps) {
  const totalQuestions = entry.version >= 4 ? 20 : 10

  return (
    <li className="leaderboard-row">
      <span className="leaderboard-row__rank">{String(rank).padStart(2, '0')}</span>
      <div className="leaderboard-row__player">
        <strong>{entry.initials}</strong>
        <span>{entry.program}</span>
      </div>
      <div className="leaderboard-row__score">
        <strong>{entry.correctAnswers}<small>/{totalQuestions}</small></strong>
        <span>{formatPoints(entry.arcadePoints)} PTS · {formatTimestamp(entry.timestamp)}</span>
      </div>
    </li>
  )
}
