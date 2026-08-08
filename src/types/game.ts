export interface QuestionSuggestion {
  term: string
  descriptor: string
}

export interface Question {
  id: string
  corruptedTerm: string
  restoredTerm: string
  systemPrompt: string
  contextClue: string
  suggestions: QuestionSuggestion[]
  explanation: string
  topic: string
  difficulty: 'FOUNDATION' | 'APPLIED'
}

export interface PlayerProfile {
  initials: string
  program: string
}

export interface AnswerFeedback {
  selectedTerm: string | null
  resolvedTerm: string
  isCorrect: boolean
  timedOut: boolean
  timeRemaining: number
  pointsAwarded: number
  streak: number
}

export interface GameStats {
  correctAnswers: number
  arcadePoints: number
  bestStreak: number
}

export interface RalphQuestion {
  id: string
  statement: string
  isTrue: boolean
  explanation: string
  topic: string
}

export interface RalphAnswerFeedback {
  selectedAnswer: boolean | null
  correctAnswer: boolean
  isCorrect: boolean
  timedOut: boolean
  timeRemaining: number
  pointsAwarded: number
  streak: number
}

export type QuestionPhase = 'scanning' | 'active' | 'resolving' | 'feedback'
