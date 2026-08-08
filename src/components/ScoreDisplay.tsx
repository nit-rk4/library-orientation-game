import { HudCounter } from './ArcadeElements'

interface ScoreDisplayProps {
  correctAnswers: number
  total: number
  arcadePoints: number
  streak: number
  correctLabel?: string
  scoreLabel?: string
  streakLabel?: string
}

export function ScoreDisplay({
  correctAnswers,
  total,
  arcadePoints,
  streak,
  correctLabel = 'RESTORED',
  scoreLabel = 'RUN SCORE',
  streakLabel = 'COMBO',
}: ScoreDisplayProps) {
  return (
    <div className="score-display" aria-label={`${correctAnswers} correct, ${arcadePoints} points, streak ${streak}`}>
      <HudCounter detail={`OF ${total}`} label={correctLabel} tone="mint" value={String(correctAnswers).padStart(2, '0')} />
      <HudCounter label={scoreLabel} tone="gold" value={arcadePoints.toLocaleString()} />
      <HudCounter label={streakLabel} tone="red" value={`×${streak}`} />
    </div>
  )
}
