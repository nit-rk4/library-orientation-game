import { useEffect } from 'react'
import { ArcadeFrame, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Button } from '../components/Button'
import { formatPoints } from '../utils/format'

interface LevelTransitionScreenProps {
  correctAnswers: number
  points: number
  bestStreak: number
  onContinue: () => void
}

export function LevelTransitionScreen({ correctAnswers, points, bestStreak, onContinue }: LevelTransitionScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onContinue, 3000)
    return () => window.clearTimeout(timer)
  }, [onContinue])

  return (
    <section className="screen level-transition" aria-labelledby="level-transition-title">
      <PixelBadge tone="mint">LEVEL 01 CLEAR</PixelBadge>
      <div className="level-transition__signal" aria-hidden="true"><PixelIcon name="search" /><i /><PixelIcon name="brick" /></div>
      <p className="eyebrow">SEARCH SYSTEM RESTORED // NEXT CABINET ONLINE</p>
      <h1 id="level-transition-title"><span>Ralph is</span><em>ready to smash</em></h1>
      <p className="screen-copy">Your score and combo carry into Level 2. Save verified library signals and smash corrupted ones.</p>
      <ArcadeFrame className="level-transition__stats" tone="red">
        <div><span>LEVEL 01</span><strong>{correctAnswers}/10</strong></div>
        <div><span>RUN SCORE</span><strong>{formatPoints(points)}</strong></div>
        <div><span>BEST COMBO</span><strong>×{bestStreak}</strong></div>
      </ArcadeFrame>
      <Button fullWidth onClick={onContinue}>Load Level 2 now</Button>
      <p className="level-transition__auto" role="status">AUTO-LOADING RALPH IN 3 SECONDS…</p>
    </section>
  )
}
