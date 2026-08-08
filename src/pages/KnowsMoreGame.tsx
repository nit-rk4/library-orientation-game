import { useCallback, useEffect, useRef, useState } from 'react'
import { questions } from '../data/questions'
import { ralphQuestions } from '../data/ralphQuestions'
import { createLeaderboardEntry, getLeaderboardLoadStatus, loadLeaderboard, saveLeaderboardEntry } from '../services/leaderboardService'
import type { AnswerFeedback, PlayerProfile, RalphAnswerFeedback } from '../types/game'
import type { LeaderboardEntry, LeaderboardLoadStatus, ScoreSubmissionStatus } from '../types/leaderboard'
import { randomizeKnowsMoreQuestions, randomizeQuestionOrder } from '../utils/randomizeQuestions'
import { calculateQuestionPoints } from '../utils/scoring'
import { GameScreen } from './GameScreen'
import { LevelTransitionScreen } from './LevelTransitionScreen'
import { PlayerEntryScreen } from './PlayerEntryScreen'
import { RalphGameScreen } from './RalphGameScreen'
import { ResultScreen } from './ResultScreen'

type Screen = 'entry' | 'knowsmore' | 'transition' | 'ralph' | 'result'
const GAME_ID = 'knowsmore'

export function KnowsMoreGame() {
  const [screen, setScreen] = useState<Screen>('entry')
  const [player, setPlayer] = useState<PlayerProfile | null>(null)
  const [runQuestions, setRunQuestions] = useState(questions)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [runRalphQuestions, setRunRalphQuestions] = useState(ralphQuestions)
  const [ralphQuestion, setRalphQuestion] = useState(0)
  const [knowsMoreCorrect, setKnowsMoreCorrect] = useState(0)
  const [knowsMorePoints, setKnowsMorePoints] = useState(0)
  const [ralphCorrect, setRalphCorrect] = useState(0)
  const [ralphPoints, setRalphPoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [knowsMoreFeedback, setKnowsMoreFeedback] = useState<AnswerFeedback | null>(null)
  const [ralphFeedback, setRalphFeedback] = useState<RalphAnswerFeedback | null>(null)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [leaderboardStatus, setLeaderboardStatus] = useState<LeaderboardLoadStatus>('loading')
  const [submissionStatus, setSubmissionStatus] = useState<ScoreSubmissionStatus>('idle')
  const pendingEntry = useRef<LeaderboardEntry | null>(null)

  const runCorrectAnswers = knowsMoreCorrect + ralphCorrect
  const runPoints = knowsMorePoints + ralphPoints

  useEffect(() => {
    let isCurrent = true
    void loadLeaderboard(GAME_ID).then((result) => {
      if (!isCurrent) return
      setEntries(result.entries)
      setLeaderboardStatus(getLeaderboardLoadStatus(result))
    })
    return () => { isCurrent = false }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [screen])

  function resetRun() {
    setRunQuestions((current) => randomizeKnowsMoreQuestions(questions, current))
    setRunRalphQuestions((current) => randomizeQuestionOrder(ralphQuestions, current))
    setCurrentQuestion(0)
    setRalphQuestion(0)
    setKnowsMoreCorrect(0)
    setKnowsMorePoints(0)
    setRalphCorrect(0)
    setRalphPoints(0)
    setStreak(0)
    setBestStreak(0)
    setKnowsMoreFeedback(null)
    setRalphFeedback(null)
    setSubmissionStatus('idle')
    pendingEntry.current = null
  }

  function beginRun(nextPlayer: PlayerProfile) {
    setPlayer(nextPlayer)
    resetRun()
    setScreen('knowsmore')
  }

  function handleKnowsMoreAnswer(answer: string | null, timedOut: boolean, timeRemaining: number) {
    if (knowsMoreFeedback) return
    const question = runQuestions[currentQuestion]
    const isCorrect = answer === question.restoredTerm
    const nextStreak = isCorrect ? streak + 1 : 0
    const pointsAwarded = isCorrect ? calculateQuestionPoints(timeRemaining, nextStreak) : 0

    if (isCorrect) {
      setKnowsMoreCorrect((current) => current + 1)
      setKnowsMorePoints((current) => current + pointsAwarded)
      setBestStreak((current) => Math.max(current, nextStreak))
    }
    setStreak(nextStreak)
    setKnowsMoreFeedback({
      selectedTerm: answer,
      resolvedTerm: question.restoredTerm,
      isCorrect,
      timedOut,
      timeRemaining,
      pointsAwarded,
      streak: nextStreak,
    })
  }

  function advanceKnowsMore() {
    if (currentQuestion === runQuestions.length - 1) {
      setScreen('transition')
      return
    }
    setCurrentQuestion((current) => current + 1)
    setKnowsMoreFeedback(null)
  }

  const startRalph = useCallback(() => {
    setRalphQuestion(0)
    setRalphFeedback(null)
    setScreen('ralph')
  }, [])

  function handleRalphAnswer(answer: boolean | null, timedOut: boolean, timeRemaining: number) {
    if (ralphFeedback) return
    const question = runRalphQuestions[ralphQuestion]
    const isCorrect = answer === question.isTrue
    const nextStreak = isCorrect ? streak + 1 : 0
    const pointsAwarded = isCorrect ? calculateQuestionPoints(timeRemaining, nextStreak) : 0

    if (isCorrect) {
      setRalphCorrect((current) => current + 1)
      setRalphPoints((current) => current + pointsAwarded)
      setBestStreak((current) => Math.max(current, nextStreak))
    }
    setStreak(nextStreak)
    setRalphFeedback({
      selectedAnswer: answer,
      correctAnswer: question.isTrue,
      isCorrect,
      timedOut,
      timeRemaining,
      pointsAwarded,
      streak: nextStreak,
    })
  }

  function advanceRalph() {
    if (ralphQuestion === runRalphQuestions.length - 1) {
      setScreen('result')
      return
    }
    setRalphQuestion((current) => current + 1)
    setRalphFeedback(null)
  }

  function retryRun() {
    resetRun()
    setScreen('knowsmore')
  }

  async function submitScore() {
    if (!player || submissionStatus === 'saved' || submissionStatus === 'saving') return
    const entry = pendingEntry.current ?? createLeaderboardEntry(
      GAME_ID,
      player,
      { correctAnswers: runCorrectAnswers, arcadePoints: runPoints, bestStreak },
    )
    pendingEntry.current = entry
    setSubmissionStatus('saving')
    const result = await saveLeaderboardEntry(entry)
    setEntries(result.entries)
    setLeaderboardStatus(getLeaderboardLoadStatus(result))
    setSubmissionStatus(result.saved ? 'saved' : 'error')
  }

  return (
    <div className="knowsmore-module">
      {screen === 'entry' && <PlayerEntryScreen initialPlayer={player} onContinue={beginRun} />}
      {screen === 'knowsmore' && (
        <GameScreen
          arcadePoints={knowsMorePoints}
          correctAnswers={knowsMoreCorrect}
          feedback={knowsMoreFeedback}
          key={runQuestions[currentQuestion].id}
          onAdvance={advanceKnowsMore}
          onAnswer={handleKnowsMoreAnswer}
          question={runQuestions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          streak={streak}
          totalQuestions={runQuestions.length}
        />
      )}
      {screen === 'transition' && (
        <LevelTransitionScreen bestStreak={bestStreak} correctAnswers={knowsMoreCorrect} onContinue={startRalph} points={knowsMorePoints} />
      )}
      {screen === 'ralph' && (
        <RalphGameScreen
          feedback={ralphFeedback}
          key={runRalphQuestions[ralphQuestion].id}
          levelCorrectAnswers={ralphCorrect}
          onAdvance={advanceRalph}
          onAnswer={handleRalphAnswer}
          question={runRalphQuestions[ralphQuestion]}
          questionNumber={ralphQuestion + 1}
          runCorrectAnswers={runCorrectAnswers}
          runPoints={runPoints}
          streak={streak}
          totalQuestions={runRalphQuestions.length}
        />
      )}
      {screen === 'result' && player && (
        <ResultScreen
          bestStreak={bestStreak}
          entries={entries}
          knowsMoreCorrect={knowsMoreCorrect}
          knowsMorePoints={knowsMorePoints}
          leaderboardStatus={leaderboardStatus}
          onRetry={retryRun}
          onSubmit={submitScore}
          player={player}
          ralphCorrect={ralphCorrect}
          ralphPoints={ralphPoints}
          submissionStatus={submissionStatus}
        />
      )}
    </div>
  )
}
