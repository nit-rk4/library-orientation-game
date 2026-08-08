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

  const repairStatus = feedback
    ? feedback.isCorrect
      ? 'SYSTEM PATCHED'
      : 'DAMAGE DETECTED'
    : phase === 'scanning'
      ? 'MISINFO ALERT'
      : phase === 'resolving'
        ? 'INTEGRITY CHECK'
        : 'REPAIR MODE'
  const outcomeClass = !feedback
    ? ''
    : feedback.isCorrect
      ? feedback.selectedAnswer === true
        ? ' is-success is-save-success'
        : ' is-success is-smash-success'
      : feedback.timedOut
        ? ' is-timeout'
        : ' is-error'
  const feedbackHeading = feedback?.isCorrect
    ? feedback.selectedAnswer === true
      ? 'SYSTEM PATCHED!'
      : 'FALSE SIGNAL SMASHED!'
    : feedback?.timedOut
      ? 'MISINFO ALERT // TIMEOUT'
      : 'DAMAGE DETECTED!'
  const correctControl = feedback?.correctAnswer ? 'SAVE IT' : 'SMASH IT'
  const feedbackCopy = feedback?.isCorrect
    ? feedback.selectedAnswer === true
      ? 'TRUE SIGNAL SECURED // LIBRARY RULE STABILIZED.'
      : 'FALSE SIGNAL PURGED // CORRUPTION REMOVED.'
    : feedback?.timedOut
      ? `REPAIR WINDOW CLOSED // CORRECT CONTROL: ${correctControl}.`
      : `WRONG TOOL SELECTED // CORRECT CONTROL: ${correctControl}.`

  return (
    <section className="screen screen--game screen--ralph" aria-label={`Level 2 signal ${questionNumber} of ${totalQuestions}`}>
      <div className="ralph-repair-hud">
        <div className="ralph-hazard-rail" aria-hidden="true" />
        <div className="ralph-repair-hud__header">
          <PixelBadge tone="red">MODULE 02 // INTEGRITY CHECK</PixelBadge>
          <span className="ralph-repair-hud__mode"><span className="pixel-led" />{repairStatus}</span>
        </div>

        <div className="game-status game-status--ralph">
          <div className="progress-block progress-block--ralph">
            <div className="progress-block__labels"><span>REPAIR QUEUE</span><strong>SIGNAL {String(questionNumber).padStart(2, '0')} / {String(totalQuestions).padStart(2, '0')}</strong></div>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          </div>
          <ScoreDisplay arcadePoints={runPoints} correctAnswers={runCorrectAnswers} correctLabel="PATCHED" streak={streak} total={20} />
        </div>

        <div className="ralph-repair-hud__utilities">
          <div className="integrity-meter integrity-meter--ralph" aria-label={`Ralph signal integrity ${Math.round(integrity)} percent`}>
            <div><span><PixelIcon name="brick" /> CORE INTEGRITY</span><strong>{String(Math.round(integrity)).padStart(2, '0')}%</strong></div>
            <div className="integrity-meter__segments" aria-hidden="true">
              {Array.from({ length: totalQuestions }, (_, index) => <i className={index < levelCorrectAnswers ? 'is-online' : ''} key={index} />)}
            </div>
          </div>
          <Timer duration={15} label="REPAIR WINDOW" onExpire={() => resolveSignal(null, true, 0)} onTimeChange={setTimeRemaining} paused={phase !== 'active'} />
        </div>
        <div className="ralph-hazard-rail ralph-hazard-rail--bottom" aria-hidden="true" />
      </div>

      <article className={`ralph-card question-card--${phase}${outcomeClass}`}>
        <i className="question-card__bolt question-card__bolt--left" aria-hidden="true" />
        <i className="question-card__bolt question-card__bolt--right" aria-hidden="true" />
        <div className="ralph-card__damage" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="ralph-card__warning" aria-hidden="true"><span>DAMAGE // REPAIR // DAMAGE // REPAIR</span></div>
        <div className="question-card__header">
          <span><span className="pixel-led" /> {repairStatus}</span>
          <PixelBadge tone="red">{question.topic}</PixelBadge>
        </div>
        <div className="ralph-mode-shift">
          <span>LEVEL 2 // REPAIR MODE</span>
          <strong>INCOMING LIBRARY SIGNAL</strong>
        </div>
        <div className="ralph-card__signal">
          <div className="ralph-card__signal-meta"><span>SIGNAL CONTENT</span><strong>SIGNAL {String(questionNumber).padStart(2, '0')}</strong></div>
          <h2>{question.statement}</h2>
          <div className="ralph-card__fragments" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <span className="ralph-card__scan-sweep" aria-hidden="true" />
        </div>
        <p className="ralph-card__instruction">Verified information gets saved. False information gets smashed.</p>
        <div className="ralph-controls" aria-label="Choose whether the statement is true or false">
          <button className="ralph-choice ralph-choice--save" disabled={phase !== 'active'} onClick={() => resolveSignal(true, false, timeRemaining)} type="button">
            <span className="ralph-choice__signal">TRUE SIGNAL</span>
            <strong>SAVE IT</strong>
            <small>STABILIZE // VERIFY</small>
            <span className="ralph-choice__tool-mark" aria-hidden="true" />
            <i aria-hidden="true">A</i>
          </button>
          <button className="ralph-choice ralph-choice--smash" disabled={phase !== 'active'} onClick={() => resolveSignal(false, false, timeRemaining)} type="button">
            <span className="ralph-choice__signal">FALSE SIGNAL</span>
            <strong>SMASH IT</strong>
            <small>PURGE // DESTROY</small>
            <span className="ralph-choice__tool-mark" aria-hidden="true" />
            <i aria-hidden="true">B</i>
          </button>
        </div>

        {(phase === 'scanning' || phase === 'resolving') && (
          <div className="scan-overlay scan-overlay--ralph" aria-live="polite">
            <PixelIcon name="brick" /><span />
            <small>MODULE 02 // SIGNAL {String(questionNumber).padStart(2, '0')}</small>
            {phase === 'scanning' ? 'READING INTEGRITY DATA…' : 'APPLYING SYSTEM PATCH…'}
          </div>
        )}
      </article>

      {feedback && (
        <div className={`feedback-panel feedback-panel--ralph${feedback.isCorrect ? ` feedback-panel--success${feedback.selectedAnswer === true ? ' ralph-feedback--save' : ' ralph-feedback--smash'}` : ' feedback-panel--error'}`} aria-live="assertive">
          <div className="feedback-panel__burst ralph-feedback__debris" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
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
            {questionNumber === totalQuestions ? 'Restore library core' : 'Scan next signal'}
          </Button>
        </div>
      )}
    </section>
  )
}
