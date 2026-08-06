import type { GameStats, LeaderboardEntry, PlayerProfile } from '../types/game'

const STORAGE_KEY = 'knowsmore-missing-word-leaderboard'

interface LegacyEntry {
  id?: unknown
  initials?: unknown
  program?: unknown
  score?: unknown
  correctAnswers?: unknown
  arcadePoints?: unknown
  bestStreak?: unknown
  timestamp?: unknown
}

export interface LeaderboardSaveResult {
  entries: LeaderboardEntry[]
  saved: boolean
}

function numericValue(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : fallback
}

function normalizeEntry(value: unknown, index: number): LeaderboardEntry | null {
  if (!value || typeof value !== 'object') return null
  const entry = value as LegacyEntry
  if (typeof entry.initials !== 'string' || typeof entry.program !== 'string' || typeof entry.timestamp !== 'string') return null

  const legacyScore = numericValue(entry.score)
  const correctAnswers = Math.min(10, numericValue(entry.correctAnswers, legacyScore))
  const arcadePoints = numericValue(entry.arcadePoints, correctAnswers * 1000)

  return {
    schemaVersion: 2,
    id: typeof entry.id === 'string' ? entry.id : `legacy-${index}-${entry.timestamp}`,
    initials: entry.initials.slice(0, 3).toUpperCase(),
    program: entry.program,
    correctAnswers,
    arcadePoints,
    bestStreak: Math.min(10, numericValue(entry.bestStreak)),
    timestamp: entry.timestamp,
  }
}

export function sortLeaderboard(entries: LeaderboardEntry[]) {
  return [...entries].sort((first, second) => {
    if (second.correctAnswers !== first.correctAnswers) return second.correctAnswers - first.correctAnswers
    if (second.arcadePoints !== first.arcadePoints) return second.arcadePoints - first.arcadePoints
    return new Date(first.timestamp).getTime() - new Date(second.timestamp).getTime()
  })
}

export function loadLeaderboard(): LeaderboardEntry[] {
  try {
    const savedEntries: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    if (!Array.isArray(savedEntries)) return []

    const normalized = savedEntries
      .map(normalizeEntry)
      .filter((entry): entry is LeaderboardEntry => entry !== null)
    return sortLeaderboard(normalized)
  } catch {
    return []
  }
}

export function saveLeaderboardEntry(
  player: PlayerProfile,
  stats: GameStats,
): LeaderboardSaveResult {
  const timestamp = new Date().toISOString()
  const id = globalThis.crypto?.randomUUID?.() ?? `run-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const entry: LeaderboardEntry = {
    ...player,
    ...stats,
    schemaVersion: 2,
    id,
    timestamp,
  }
  const entries = sortLeaderboard([...loadLeaderboard(), entry])

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
    return { entries, saved: true }
  } catch {
    return { entries, saved: false }
  }
}
