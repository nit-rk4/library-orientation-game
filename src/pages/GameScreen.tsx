import { useCallback, useEffect, useRef, useState } from 'react'
import { useArcadeAudio } from '../audio/ArcadeAudioContext'
import { PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { AnswerFeedbackOverlay } from '../components/AnswerFeedbackOverlay'
import { QuestionCard } from '../components/QuestionCard'
import { ScoreDisplay } from '../components/ScoreDisplay'
import { Timer } from '../components/Timer'
import type { AnswerFeedback, Question, QuestionPhase } from '../types/game'

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
    if (phase !== 'active' || feedback) return
    setPhase('resolving')
    resolutionTimer.current = window.setTimeout(() => onAnswer(term, timedOut, seconds), 600)
  }, [feedback, onAnswer, phase])

  const selectSuggestion = useCallback((term: string) => {
    setSelectedTerm(term)
    resolveQuery(term, false, timeRemaining)
  }, [resolveQuery, timeRemaining])

  const feedbackHeading = feedback?.isCorrect
    ? 'MISSING WORD RESTORED'
    : feedback?.timedOut
      ? 'SEARCH WINDOW EXPIRED'
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
          <div className="progress-block__labels"><PixelBadge tone="gold">LEVEL 01 // ROUND {String(questionNumber).padStart(2, '0')}</PixelBadge><span>KNOWSMORE {questionNumber} / {totalQuestions}</span></div>
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
        paused={phase !== 'active' || Boolean(feedback)}
      />
      <QuestionCard
        feedback={feedback}
        onSelect={selectSuggestion}
        phase={feedback ? 'feedback' : phase}
        question={question}
        selectedTerm={selectedTerm}
      />

      {feedback && (
        <AnswerFeedbackOverlay
          explanation={question.explanation}
          heading={feedbackHeading}
          onComplete={onAdvance}
          pointsAwarded={feedback.pointsAwarded}
          streak={feedback.streak}
          summary={feedbackCopy}
          theme="knowsmore"
          timeRemaining={feedback.timeRemaining}
          tone={feedback.isCorrect ? 'success' : feedback.timedOut ? 'timeout' : 'error'}
        />
      )}
    </section>
  )
}
