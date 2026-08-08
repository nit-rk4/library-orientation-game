import type { LeaderboardEntry } from '../types/leaderboard'
import { CURRENT_LEADERBOARD_VERSION } from '../types/leaderboard'

const CACHE_KEY = 'library-game-central-leaderboard-cache-v3'
const LEGACY_KEYS = ['knowsmore-missing-word-leaderboard']
const DEFAULT_GAME_ID = 'knowsmore'

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord | null {
  return value !== null && typeof value === 'object' ? value as UnknownRecord : null
}

function numericValue(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(0, Math.floor(value))
    : fallback
}

function stringValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function readAlias(record: UnknownRecord, ...keys: string[]) {
  for (const key of keys) {
    if (record[key] !== undefined) return record[key]
  }
  return undefined
}

function normalizeTimestamp(value: unknown) {
  if (typeof value !== 'string' && typeof value !== 'number') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

export function normalizeLeaderboardEntry(
  value: unknown,
  index = 0,
  fallbackGameId = DEFAULT_GAME_ID,
): LeaderboardEntry | null {
  const record = asRecord(value)
  if (!record) return null

  const initials = stringValue(record.initials).replace(/[^a-z]/gi, '').toUpperCase().slice(0, 3)
  const program = stringValue(record.program).slice(0, 100)
  const timestamp = normalizeTimestamp(readAlias(record, 'timestamp', 'created_at'))
  const gameId = stringValue(readAlias(record, 'gameId', 'game_id')) || fallbackGameId
  if (initials.length !== 3 || !program || !timestamp || !gameId) return null

  const legacyScore = numericValue(record.score)
  const correctAnswers = Math.min(10, numericValue(readAlias(record, 'correctAnswers', 'correct_answers'), legacyScore))
  const arcadePoints = Math.min(100_000, numericValue(readAlias(record, 'arcadePoints', 'arcade_points'), correctAnswers * 1000))
  const bestStreak = Math.min(10, numericValue(readAlias(record, 'bestStreak', 'best_streak')))
  const version = Math.max(1, numericValue(readAlias(record, 'version', 'schemaVersion'), legacyScore ? 1 : CURRENT_LEADERBOARD_VERSION))
  const rawId = stringValue(record.id)
  const id = rawId || `legacy-${gameId}-${index}-${timestamp}`

  return {
    id,
    gameId,
    initials,
    program,
    correctAnswers,
    arcadePoints,
    bestStreak,
    timestamp,
    version,
  }
}

export function sortLeaderboard(entries: LeaderboardEntry[]) {
  return [...entries].sort((first, second) => {
    if (second.correctAnswers !== first.correctAnswers) return second.correctAnswers - first.correctAnswers
    if (second.arcadePoints !== first.arcadePoints) return second.arcadePoints - first.arcadePoints
    return new Date(first.timestamp).getTime() - new Date(second.timestamp).getTime()
  })
}

export function normalizeLeaderboardEntries(values: unknown, fallbackGameId = DEFAULT_GAME_ID) {
  if (!Array.isArray(values)) return []

  const seenIds = new Set<string>()
  const seenScores = new Set<string>()
  const normalized: LeaderboardEntry[] = []

  values.forEach((value, index) => {
    const entry = normalizeLeaderboardEntry(value, index, fallbackGameId)
    if (!entry) return
    const idKey = `${entry.gameId}|${entry.id}`
    const scoreKey = [entry.gameId, entry.initials, entry.program, entry.correctAnswers, entry.arcadePoints, entry.bestStreak, entry.timestamp].join('|')
    if (seenIds.has(idKey) || seenScores.has(scoreKey)) return
    seenIds.add(idKey)
    seenScores.add(scoreKey)
    normalized.push(entry)
  })

  return sortLeaderboard(normalized)
}

function readStoredArray(key: string) {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function writeRawCache(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entries))
    return true
  } catch {
    return false
  }
}

export function readLeaderboardCache(gameId: string) {
  const currentRecords = readStoredArray(CACHE_KEY)
  const legacyRecords = LEGACY_KEYS.flatMap(readStoredArray)
  const normalized = normalizeLeaderboardEntries([...currentRecords, ...legacyRecords], DEFAULT_GAME_ID)

  // Rewriting the cache upgrades legacy schemaVersion/score fields without
  // deleting the original key, so older deployments can still read it.
  writeRawCache(normalized)
  return sortLeaderboard(normalized.filter((entry) => entry.gameId === gameId))
}

export function writeLeaderboardCache(gameId: string, entries: LeaderboardEntry[]) {
  const otherGames = normalizeLeaderboardEntries(readStoredArray(CACHE_KEY))
    .filter((entry) => entry.gameId !== gameId)
  const normalizedEntries = normalizeLeaderboardEntries(entries, gameId)
  return writeRawCache([...otherGames, ...normalizedEntries])
}
