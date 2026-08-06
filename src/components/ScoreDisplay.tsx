import { HudCounter } from './ArcadeElements'

interface ScoreDisplayProps {
  correctAnswers: number
  total: number
  arcadePoints: number
  streak: number
}

export function ScoreDisplay({ correctAnswers, total, arcadePoints, streak }: ScoreDisplayProps) {
  return (
    <div className="score-display" aria-label={`${correctAnswers} correct, ${arcadePoints} points, streak ${streak}`}>
      <HudCounter detail={`OF ${total}`} label="RESTORED" tone="mint" value={String(correctAnswers).padStart(2, '0')} />
      <HudCounter label="HIGH SCORE" tone="gold" value={arcadePoints.toLocaleString()} />
      <HudCounter label="COMBO" tone="red" value={`×${streak}`} />
    </div>
  )
}
