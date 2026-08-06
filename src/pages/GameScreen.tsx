import { useCallback, useEffect, useRef, useState } from 'react'
import { useArcadeAudio } from '../audio/ArcadeAudioContext'
import { PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Button } from '../components/Button'
import { QuestionCard } from '../components/QuestionCard'
import { ScoreDisplay } from '../components/ScoreDisplay'
import { Timer } from '../components/Timer'
import type { AnswerFeedback, Question, QuestionPhase } from '../types/game'
import { formatPoints } from '../utils/format'

interface GameScreenProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  correctAnswers: number
  arcadePoints: number
  streak: number
  feedback: AnswerFeedback | null
  onAnswer: (answer: string | null, timedOut: boolean, timeRemaining: number) => void
  onAdvance: () => void
}

export function GameScreen({
  question,
  questionNumber,
  totalQuestions,
  correctAnswers,
  arcadePoints,
  streak,
  feedback,
  onAnswer,
  onAdvance,
}: GameScreenProps) {
  const [phase, setPhase] = useState<QuestionPhase>('scanning')
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)
  const [timeRemaining, setTimeRemaining] = useState(15)
  const resolutionTimer = useRef<number | null>(null)
  const { play } = useArcadeAudio()
  const queryProgress = (questionNumber / totalQuestions) * 100
  const integrity = (correctAnswers / totalQuestions) * 100

  useEffect(() => {
    const scanTimer = window.setTimeout(() => setPhase('active'), 700)
    return () => window.clearTimeout(scanTimer)
  }, [])

  useEffect(() => {
    if (!feedback) return
    setPhase('feedback')
    play(feedback.isCorrect ? 'success' : feedback.timedOut ? 'timeout' : 'error')
  }, [feedback, play])

  useEffect(() => () => {
    if (resolutionTimer.current !== null) window.clearTimeout(resolutionTimer.current)
  }, [])

  const resolveQuery = useCallback((term: string | null, timedOut: boolean, seconds: number) => {
    if (phase !== 'active') return
    setPhase('resolving')
    resolutionTimer.current = window.setTimeout(() => onAnswer(term, timedOut, seconds), 600)
  }, [onAnswer, phase])

  const feedbackHeading = feedback?.isCorrect
    ? 'WORD RESTORED!'
    : feedback?.timedOut
      ? 'TIME OVER!'
      : 'SEARCH MISS!'
  const feedbackCopy = feedback?.isCorrect
    ? 'Tama ang restored entry. Database match confirmed.'
    : feedback?.timedOut
      ? `Query window expired. The restored term is ${question.restoredTerm}.`
      : `No exact match. The restored term is ${question.restoredTerm}.`

  return (
    <section className="screen screen--game" aria-label={`Query ${questionNumber} of ${totalQuestions}`}>
      <div className="game-status">
        <div className="progress-block">
          <div className="progress-block__labels"><PixelBadge tone="gold">ROUND {String(questionNumber).padStart(2, '0')}</PixelBadge><span>STAGE {questionNumber} / {totalQuestions}</span></div>
          <div className="progress-track"><span style={{ width: `${queryProgress}%` }} /></div>
        </div>
        <ScoreDisplay arcadePoints={arcadePoints} correctAnswers={correctAnswers} streak={streak} total={totalQuestions} />
      </div>

      <div className="integrity-meter" aria-label={`Database integrity ${Math.round(integrity)} percent`}>
        <div><span><PixelIcon name="book" /> LIBRARY POWER</span><strong>{String(Math.round(integrity)).padStart(2, '0')}%</strong></div>
        <div className="integrity-meter__segments" aria-hidden="true">
          {Array.from({ length: totalQuestions }, (_, index) => <i className={index < correctAnswers ? 'is-online' : ''} key={index} />)}
        </div>
      </div>

      <Timer
        duration={15}
        onExpire={() => resolveQuery(null, true, 0)}
        onTimeChange={setTimeRemaining}
        paused={phase !== 'active'}
      />
      <QuestionCard
        feedback={feedback}
        onExecute={() => resolveQuery(selectedTerm, false, timeRemaining)}
        onSelect={setSelectedTerm}
        phase={phase}
        question={question}
        selectedTerm={selectedTerm}
      />

      {feedback && (
        <div className={`feedback-panel${feedback.isCorrect ? ' feedback-panel--success' : ' feedback-panel--error'}`} aria-live="assertive">
          <div className="feedback-panel__burst" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <div>
            <p className="eyebrow">{feedbackHeading}</p>
            <h2>{feedbackCopy}</h2>
            <p>{question.explanation}</p>
            <div className="feedback-panel__telemetry">
              <span>+{formatPoints(feedback.pointsAwarded)} PTS</span>
              <span>{feedback.timeRemaining}s LEFT</span>
              <span>COMBO ×{feedback.streak}</span>
            </div>
          </div>
          <Button onClick={onAdvance} variant={feedback.isCorrect ? 'primary' : 'secondary'}>
            {questionNumber === totalQuestions ? 'Open system report' : 'Load next query'}
          </Button>
        </div>
      )}
    </section>
  )
}
