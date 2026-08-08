import { useCallback, useEffect, useRef, useState } from 'react'
import { useArcadeAudio } from '../audio/ArcadeAudioContext'
import { PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Button } from '../components/Button'
import { ScoreDisplay } from '../components/ScoreDisplay'
import { Timer } from '../components/Timer'
import type { QuestionPhase, RalphAnswerFeedback, RalphQuestion } from '../types/game'
import { formatPoints } from '../utils/format'

interface RalphGameScreenProps {
  question: RalphQuestion
  questionNumber: number
  totalQuestions: number
  levelCorrectAnswers: number
  runCorrectAnswers: number
  runPoints: number
  streak: number
  feedback: RalphAnswerFeedback | null
  onAnswer: (answer: boolean | null, timedOut: boolean, timeRemaining: number) => void
  onAdvance: () => void
}

export function RalphGameScreen({
  question,
  questionNumber,
  totalQuestions,
  levelCorrectAnswers,
  runCorrectAnswers,
  runPoints,
  streak,
  feedback,
  onAnswer,
  onAdvance,
}: RalphGameScreenProps) {
  const [phase, setPhase] = useState<QuestionPhase>('scanning')
  const [timeRemaining, setTimeRemaining] = useState(15)
  const resolutionTimer = useRef<number | null>(null)
  const { play } = useArcadeAudio()
  const progress = (questionNumber / totalQuestions) * 100
  const integrity = (levelCorrectAnswers / totalQuestions) * 100

  useEffect(() => {
    const scanTimer = window.setTimeout(() => setPhase('active'), 650)
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

  const resolveSignal = useCallback((answer: boolean | null, timedOut: boolean, seconds: number) => {
    if (phase !== 'active') return
    setPhase('resolving')
    play('execute')
    resolutionTimer.current = window.setTimeout(() => onAnswer(answer, timedOut, seconds), 500)
  }, [onAnswer, phase, play])

  const feedbackHeading = feedback?.isCorrect
    ? 'SIGNAL VERIFIED!'
    : feedback?.timedOut
      ? 'SYSTEM LOCKED!'
      : 'INTEGRITY BREACH!'
  const correctControl = feedback?.correctAnswer ? 'SAVE IT' : 'SMASH IT'

  return (
    <section className="screen screen--game screen--ralph" aria-label={`Level 2 signal ${questionNumber} of ${totalQuestions}`}>
      <div className="game-status">
        <div className="progress-block progress-block--ralph">
          <div className="progress-block__labels"><PixelBadge tone="red">LEVEL 02 // ROUND {String(questionNumber).padStart(2, '0')}</PixelBadge><span>RALPH {questionNumber} / {totalQuestions}</span></div>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        </div>
        <ScoreDisplay arcadePoints={runPoints} correctAnswers={runCorrectAnswers} streak={streak} total={20} />
      </div>

      <div className="integrity-meter integrity-meter--ralph" aria-label={`Ralph signal integrity ${Math.round(integrity)} percent`}>
        <div><span><PixelIcon name="brick" /> VERIFIED SIGNALS</span><strong>{String(Math.round(integrity)).padStart(2, '0')}%</strong></div>
        <div className="integrity-meter__segments" aria-hidden="true">
          {Array.from({ length: totalQuestions }, (_, index) => <i className={index < levelCorrectAnswers ? 'is-online' : ''} key={index} />)}
        </div>
      </div>

      <Timer duration={15} onExpire={() => resolveSignal(null, true, 0)} onTimeChange={setTimeRemaining} paused={phase !== 'active'} />

      <article className={`ralph-card question-card--${phase}${feedback ? feedback.isCorrect ? ' is-success' : feedback.timedOut ? ' is-timeout' : ' is-error' : ''}`}>
        <i className="question-card__bolt question-card__bolt--left" aria-hidden="true" />
        <i className="question-card__bolt question-card__bolt--right" aria-hidden="true" />
        <div className="question-card__header">
          <span><span className="pixel-led" /> {phase === 'scanning' ? 'SCANNING SIGNAL' : 'INTEGRITY MODE'}</span>
          <PixelBadge tone="red">{question.topic}</PixelBadge>
        </div>
        <div className="ralph-card__signal">
          <span>INCOMING LIBRARY SIGNAL</span>
          <h2>{question.statement}</h2>
          <div aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        </div>
        <p className="ralph-card__instruction">Verified information gets saved. False information gets smashed.</p>
        <div className="ralph-controls" aria-label="Choose whether the statement is true or false">
          <button className="ralph-choice ralph-choice--save" disabled={phase !== 'active'} onClick={() => resolveSignal(true, false, timeRemaining)} type="button">
            <span>TRUE SIGNAL</span><strong>SAVE IT</strong><i aria-hidden="true">A</i>
          </button>
          <button className="ralph-choice ralph-choice--smash" disabled={phase !== 'active'} onClick={() => resolveSignal(false, false, timeRemaining)} type="button">
            <span>FALSE SIGNAL</span><strong>SMASH IT</strong><i aria-hidden="true">B</i>
          </button>
        </div>

        {(phase === 'scanning' || phase === 'resolving') && (
          <div className="scan-overlay scan-overlay--ralph" aria-live="polite">
            <PixelIcon name="brick" /><span />
            {phase === 'scanning' ? 'READING INTEGRITY DATA…' : 'VERIFYING SIGNAL…'}
          </div>
        )}
      </article>

      {feedback && (
        <div className={`feedback-panel${feedback.isCorrect ? ' feedback-panel--success' : ' feedback-panel--error'}`} aria-live="assertive">
          <div>
            <p className="eyebrow">{feedbackHeading}</p>
            <h2>{feedback.isCorrect ? `${correctControl} was the correct call.` : `Correct control: ${correctControl}.`}</h2>
            <p>{question.explanation}</p>
            <div className="feedback-panel__telemetry">
              <span>+{formatPoints(feedback.pointsAwarded)} PTS</span>
              <span>{feedback.timeRemaining}s LEFT</span>
              <span>COMBO ×{feedback.streak}</span>
            </div>
          </div>
          <Button onClick={onAdvance} variant={feedback.isCorrect ? 'primary' : 'secondary'}>
            {questionNumber === totalQuestions ? 'Open final report' : 'Load next signal'}
          </Button>
        </div>
      )}
    </section>
  )
}
