import { useEffect } from 'react'
import { useArcadeAudio } from '../audio/ArcadeAudioContext'
import { ArcadeFrame, ArcadeLink, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Button } from '../components/Button'
import { Leaderboard } from '../components/Leaderboard'
import type { LeaderboardEntry, PlayerProfile } from '../types/game'
import { formatPoints } from '../utils/format'

interface ResultScreenProps {
  player: PlayerProfile
  correctAnswers: number
  arcadePoints: number
  bestStreak: number
  totalQuestions: number
  entries: LeaderboardEntry[]
  submissionStatus: 'idle' | 'saved' | 'error'
  onRetry: () => void
  onSubmit: () => void
}

export function ResultScreen({ player, correctAnswers, arcadePoints, bestStreak, totalQuestions, entries, submissionStatus, onRetry, onSubmit }: ResultScreenProps) {
  const passed = correctAnswers >= 7
  const integrity = Math.round((correctAnswers / totalQuestions) * 100)
  const rank = correctAnswers === 10 ? 'S' : correctAnswers === 9 ? 'A' : correctAnswers >= 7 ? 'B' : 'C'
  const { play } = useArcadeAudio()

  useEffect(() => { play(passed ? 'win' : 'error') }, [passed, play])

  return (
    <section className={`screen screen--result${passed ? ' is-victory' : ' is-defeat'}`} aria-labelledby="result-title">
      <PixelBadge tone={passed ? 'gold' : 'red'}>{passed ? 'STAGE CLEAR!' : 'CONTINUE?'}</PixelBadge>
      <p className="eyebrow">FINAL SCORE // PLAYER {player.initials}</p>
      <h1 id="result-title">{passed ? <>Library power<br /><em>restored!</em></> : <>Database needs<br /><em>another run</em></>}</h1>
      <p className="screen-copy">{passed ? 'Core records restored! Handa ka nang mag-search like a college researcher.' : 'May corrupted words pa. Review the clues, then try another run.'}</p>

      <ArcadeFrame className="result-dashboard" tone={passed ? 'gold' : 'red'}>
        <div className="result-grade"><span>RANK</span><strong>{rank}</strong><PixelIcon name={passed ? 'spark' : 'brick'} /></div>
        <div className="result-dashboard__primary">
          <span>WORDS RESTORED</span>
          <strong>{String(correctAnswers).padStart(2, '0')}<small>/{String(totalQuestions).padStart(2, '0')}</small></strong>
          <p>LIBRARY POWER {integrity}% // 70% TO CLEAR</p>
        </div>
        <div className="result-dashboard__stat"><span>FINAL SCORE</span><strong>{formatPoints(arcadePoints)}</strong></div>
        <div className="result-dashboard__stat"><span>BEST COMBO</span><strong>×{bestStreak}</strong></div>
      </ArcadeFrame>

      <div className="result-actions">
        {submissionStatus === 'idle' && <Button onClick={onSubmit} sound="success">Save high score</Button>}
        {submissionStatus === 'saved' && <div className="submission-confirmed"><PixelIcon name="coin" /> HIGH SCORE SAVED!</div>}
        {submissionStatus === 'error' && <div className="submission-confirmed submission-confirmed--error">SAVE FAILED — LOCAL STORAGE OFFLINE <button onClick={onSubmit} type="button">TRY AGAIN</button></div>}
        <Button onClick={onRetry} variant="secondary">Continue? Retry</Button>
      </div>
      <Leaderboard entries={entries} />
      <ArcadeLink className="text-link result-home" href="#/">◀ GAME SELECT</ArcadeLink>
    </section>
  )
}
