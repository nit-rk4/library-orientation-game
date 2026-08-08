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
    <section className="screen level-transition level-transition--repair" aria-labelledby="level-transition-title">
      <PixelBadge tone="mint">LEVEL 01 CLEAR</PixelBadge>
      <div className="level-transition__signal" aria-hidden="true"><PixelIcon name="search" /><i /><PixelIcon name="brick" /></div>
      <div className="level-transition__hazard" aria-hidden="true" />
      <p className="eyebrow">SEARCH SYSTEM RESTORED // DAMAGE DETECTED</p>
      <h1 id="level-transition-title"><span>LEVEL 2</span><em>REPAIR MODE</em></h1>
      <p className="screen-copy">Incoming library signals detected. Save verified information. Smash the false data.</p>
      <ArcadeFrame className="level-transition__stats" tone="red">
        <div><span>LEVEL 01</span><strong>{correctAnswers}/10</strong></div>
        <div><span>RUN SCORE</span><strong>{formatPoints(points)}</strong></div>
        <div><span>BEST COMBO</span><strong>×{bestStreak}</strong></div>
      </ArcadeFrame>
      <Button fullWidth onClick={onContinue}>Enter repair bay</Button>
      <p className="level-transition__auto" role="status">REPAIR BAY OPENS IN 3 SECONDS…</p>
    </section>
  )
}
