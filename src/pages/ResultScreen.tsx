import { useEffect } from 'react'
import { useArcadeAudio } from '../audio/ArcadeAudioContext'
import { ArcadeFrame, ArcadeLink, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Button } from '../components/Button'
import { Leaderboard } from '../components/Leaderboard'
import type { PlayerProfile } from '../types/game'
import type { LeaderboardEntry, LeaderboardLoadStatus, ScoreSubmissionStatus } from '../types/leaderboard'
import { formatPoints } from '../utils/format'

interface ResultScreenProps {
  player: PlayerProfile
  knowsMoreCorrect: number
  knowsMorePoints: number
  ralphCorrect: number
  ralphPoints: number
  bestStreak: number
  entries: LeaderboardEntry[]
  leaderboardStatus: LeaderboardLoadStatus
  submissionStatus: ScoreSubmissionStatus
  onRetry: () => void
  onSubmit: () => void
}

export function ResultScreen({ player, knowsMoreCorrect, knowsMorePoints, ralphCorrect, ralphPoints, bestStreak, entries, leaderboardStatus, submissionStatus, onRetry, onSubmit }: ResultScreenProps) {
  const correctAnswers = knowsMoreCorrect + ralphCorrect
  const arcadePoints = knowsMorePoints + ralphPoints
  const passed = correctAnswers >= 14
  const integrity = Math.round((correctAnswers / 20) * 100)
  const rank = correctAnswers === 20 ? 'S' : correctAnswers >= 18 ? 'A' : correctAnswers >= 14 ? 'B' : 'C'
  const { play } = useArcadeAudio()

  useEffect(() => { play(passed ? 'win' : 'error') }, [passed, play])

  return (
    <section className={`screen screen--result${passed ? ' is-victory' : ' is-defeat'}`} aria-labelledby="result-title">
      <PixelBadge tone={passed ? 'gold' : 'red'}>{passed ? 'LIBRARY CORE RESTORED!' : 'RUN COMPLETE'}</PixelBadge>
      <p className="eyebrow">FINAL RUN // PLAYER {player.initials}</p>
      <h1 id="result-title">{passed ? <>Library core<br /><em>fully restored!</em></> : <>Training data<br /><em>needs another run</em></>}</h1>
      <p className="screen-copy">{passed ? 'KnowsMore restored the search system and Ralph cleared the integrity feed. Full arcade run complete.' : 'Both levels are complete. Review the system feedback, then return for a stronger combined score.'}</p>

      <ArcadeFrame className="result-dashboard result-dashboard--run" tone={passed ? 'gold' : 'red'}>
        <div className="result-grade"><span>RUN RANK</span><strong>{rank}</strong><PixelIcon name={passed ? 'spark' : 'brick'} /></div>
        <div className="result-dashboard__primary">
          <span>COMBINED ACCURACY</span>
          <strong>{String(correctAnswers).padStart(2, '0')}<small>/20</small></strong>
          <p>LIBRARY POWER {integrity}% // TWO LEVELS COMPLETE</p>
        </div>
        <div className="result-dashboard__stat"><span>KNOWSMORE</span><strong>{formatPoints(knowsMorePoints)}</strong><small>{knowsMoreCorrect}/10 CORRECT</small></div>
        <div className="result-dashboard__stat"><span>RALPH</span><strong>{formatPoints(ralphPoints)}</strong><small>{ralphCorrect}/10 CORRECT</small></div>
        <div className="result-dashboard__stat"><span>COMBINED SCORE</span><strong>{formatPoints(arcadePoints)}</strong></div>
        <div className="result-dashboard__stat"><span>BEST COMBO</span><strong>×{bestStreak}</strong></div>
      </ArcadeFrame>

      <div className="result-actions">
        {submissionStatus === 'idle' && <Button onClick={onSubmit} sound="success">Save full-run score</Button>}
        {submissionStatus === 'saving' && <Button disabled sound={false}>Syncing score...</Button>}
        {submissionStatus === 'saved' && <div className="submission-confirmed" role="status"><PixelIcon name="coin" /> COMBINED SCORE SAVED!</div>}
        {submissionStatus === 'error' && <div className="submission-confirmed submission-confirmed--error" role="alert">SYNC FAILED — SCORE NOT SAVED <button onClick={onSubmit} type="button">TRY AGAIN</button></div>}
        <Button disabled={submissionStatus === 'saving'} onClick={onRetry} variant="secondary">Retry full run</Button>
      </div>
      <Leaderboard entries={entries} status={leaderboardStatus} />
      <ArcadeLink className="text-link result-home" href="#/">◀ ARCADE HOME</ArcadeLink>
    </section>
  )
}
