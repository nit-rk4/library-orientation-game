import { useEffect, useState } from 'react'
import { ArcadeLink, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Leaderboard } from '../components/Leaderboard'
import { getLeaderboardLoadStatus, loadLeaderboard } from '../services/leaderboardService'
import type { LeaderboardEntry, LeaderboardLoadStatus } from '../types/leaderboard'

const GAME_ID = 'knowsmore'

export function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [status, setStatus] = useState<LeaderboardLoadStatus>('loading')

  useEffect(() => {
    let isCurrent = true

    void loadLeaderboard(GAME_ID)
      .then((result) => {
        if (!isCurrent) return
        setEntries(result.entries)
        setStatus(getLeaderboardLoadStatus(result))
      })
      .catch(() => {
        if (isCurrent) setStatus('error')
      })

    return () => { isCurrent = false }
  }, [])

  return (
    <section className="screen leaderboard-page" aria-labelledby="leaderboard-page-title">
      <ArcadeLink className="text-link text-link--top" href="#/">◀ ARCADE HOME</ArcadeLink>
      <PixelBadge tone="gold">TWO-LEVEL RUN // SCORE ARCHIVE</PixelBadge>
      <div className="leaderboard-page__intro">
        <PixelIcon name="spark" />
        <div>
          <p className="eyebrow">PLAYER RANKINGS</p>
          <h1 id="leaderboard-page-title">Hall of <em>High Scores</em></h1>
          <p className="screen-copy">Full-run scores from KnowsMore and Ralph, ranked by combined accuracy, arcade points, then earliest claim time.</p>
        </div>
      </div>
      <Leaderboard entries={entries} status={status} />
      <div className="leaderboard-page__actions">
        <ArcadeLink className="module-card__link" href="#/knowsmore">
          PRESS START FULL RUN <span aria-hidden="true">▶</span>
        </ArcadeLink>
        <ArcadeLink className="text-link" href="#/">◀ BACK TO ARCADE HOME</ArcadeLink>
      </div>
    </section>
  )
}
