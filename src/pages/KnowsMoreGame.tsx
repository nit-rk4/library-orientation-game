import { useEffect, useRef, useState } from 'react'
import { questions } from '../data/questions'
import type { AnswerFeedback, PlayerProfile } from '../types/game'
import type { LeaderboardEntry, LeaderboardLoadResult, LeaderboardLoadStatus, ScoreSubmissionStatus } from '../types/leaderboard'
import { createLeaderboardEntry, loadLeaderboard, saveLeaderboardEntry } from '../services/leaderboardService'
import { calculateQuestionPoints } from '../utils/scoring'
import { GameScreen } from './GameScreen'
import { PlayerEntryScreen } from './PlayerEntryScreen'
import { ResultScreen } from './ResultScreen'
import { StartScreen } from './StartScreen'

type Screen = 'start' | 'entry' | 'game' | 'result'
const GAME_ID = 'knowsmore'

function getLoadStatus(result: LeaderboardLoadResult): LeaderboardLoadStatus {
  if (result.source === 'supabase') return 'synced'
  if (!result.configured) return 'unconfigured'
  return result.source === 'cache' ? 'cached' : 'error'
}

export function KnowsMoreGame() {
  const [screen, setScreen] = useState<Screen>('start')
  const [player, setPlayer] = useState<PlayerProfile | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [arcadePoints, setArcadePoints] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [leaderboardStatus, setLeaderboardStatus] = useState<LeaderboardLoadStatus>('loading')
  const [submissionStatus, setSubmissionStatus] = useState<ScoreSubmissionStatus>('idle')
  const pendingEntry = useRef<LeaderboardEntry | null>(null)

  useEffect(() => {
    let isCurrent = true
    void loadLeaderboard(GAME_ID).then((result) => {
      if (!isCurrent) return
      setEntries(result.entries)
      setLeaderboardStatus(getLoadStatus(result))
    })
    return () => { isCurrent = false }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [screen])

  function resetRun() {
    setCurrentQuestion(0)
    setCorrectAnswers(0)
    setArcadePoints(0)
    setStreak(0)
    setBestStreak(0)
    setFeedback(null)
    setSubmissionStatus('idle')
    pendingEntry.current = null
  }

  function beginGame(nextPlayer: PlayerProfile) {
    setPlayer(nextPlayer)
    resetRun()
    setScreen('game')
  }

  function handleAnswer(answer: string | null, timedOut: boolean, timeRemaining: number) {
    if (feedback) return
    const question = questions[currentQuestion]
    const isCorrect = answer === question.restoredTerm
    const nextStreak = isCorrect ? streak + 1 : 0
    const pointsAwarded = isCorrect ? calculateQuestionPoints(timeRemaining, nextStreak) : 0

    if (isCorrect) {
      setCorrectAnswers((current) => current + 1)
      setArcadePoints((current) => current + pointsAwarded)
      setBestStreak((current) => Math.max(current, nextStreak))
    }
    setStreak(nextStreak)
    setFeedback({
      selectedTerm: answer,
      resolvedTerm: question.restoredTerm,
      isCorrect,
      timedOut,
      timeRemaining,
      pointsAwarded,
      streak: nextStreak,
    })
  }

  function advanceQuestion() {
    if (currentQuestion === questions.length - 1) {
      setScreen('result')
      return
    }

    setCurrentQuestion((current) => current + 1)
    setFeedback(null)
  }

  function retryGame() {
    resetRun()
    setScreen('game')
  }

  async function submitScore() {
    if (!player || submissionStatus === 'saved' || submissionStatus === 'saving') return
    const entry = pendingEntry.current ?? createLeaderboardEntry(
      GAME_ID,
      player,
      { correctAnswers, arcadePoints, bestStreak },
    )
    pendingEntry.current = entry
    setSubmissionStatus('saving')
    const result = await saveLeaderboardEntry(entry)
    setEntries(result.entries)
    setLeaderboardStatus(getLoadStatus(result))
    setSubmissionStatus(result.saved ? 'saved' : 'error')
  }

  return (
    <div className="knowsmore-module">
      {screen === 'start' && <StartScreen onStart={() => setScreen('entry')} />}
      {screen === 'entry' && <PlayerEntryScreen initialPlayer={player} onContinue={beginGame} />}
      {screen === 'game' && (
        <GameScreen
          arcadePoints={arcadePoints}
          correctAnswers={correctAnswers}
          feedback={feedback}
          key={questions[currentQuestion].id}
          onAdvance={advanceQuestion}
          onAnswer={handleAnswer}
          question={questions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          streak={streak}
          totalQuestions={questions.length}
        />
      )}
      {screen === 'result' && player && (
        <ResultScreen
          arcadePoints={arcadePoints}
          bestStreak={bestStreak}
          correctAnswers={correctAnswers}
          entries={entries}
          leaderboardStatus={leaderboardStatus}
          onRetry={retryGame}
          onSubmit={submitScore}
          player={player}
          submissionStatus={submissionStatus}
          totalQuestions={questions.length}
        />
      )}
    </div>
  )
}
