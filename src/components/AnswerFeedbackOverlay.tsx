import { useEffect, useRef } from 'react'
import { formatPoints } from '../utils/format'

const AUTO_ADVANCE_DELAY_MS = 3000

interface AnswerFeedbackOverlayProps {
  tone: 'success' | 'error' | 'timeout'
  theme: 'knowsmore' | 'ralph'
  action?: 'save' | 'smash'
  heading: string
  summary: string
  explanation: string
  pointsAwarded: number
  timeRemaining: number
  streak: number
  onComplete: () => void
}

export function AnswerFeedbackOverlay({
  tone,
  theme,
  action,
  heading,
  summary,
  explanation,
  pointsAwarded,
  timeRemaining,
  streak,
  onComplete,
}: AnswerFeedbackOverlayProps) {
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const completionTimer = window.setTimeout(() => onCompleteRef.current(), AUTO_ADVANCE_DELAY_MS)
    return () => window.clearTimeout(completionTimer)
  }, [])

  return (
    <section
      aria-atomic="true"
      aria-label="Answer feedback"
      aria-live="assertive"
      className={`feedback-overlay feedback-overlay--${tone} feedback-overlay--${theme}${action ? ` feedback-overlay--${action}` : ''}`}
      role="status"
    >
      <div className="feedback-overlay__panel">
        <div className="feedback-overlay__burst" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <p className="feedback-overlay__eyebrow">ANSWER VERIFIED</p>
        <h2>{heading}</h2>
        <p className="feedback-overlay__summary">{summary}</p>
        <p className="feedback-overlay__explanation">{explanation}</p>
        <div className="feedback-overlay__telemetry">
          <span>+{formatPoints(pointsAwarded)} PTS</span>
          <span>{timeRemaining}s LEFT</span>
          <span>COMBO x{streak}</span>
        </div>
        <p className="feedback-overlay__next" aria-hidden="true">NEXT ROUND LOADING...</p>
      </div>
    </section>
  )
}


