import { supabase, supabaseConfigurationError } from '../lib/supabase'
import type { GameStats, PlayerProfile } from '../types/game'
import type { LeaderboardEntry, LeaderboardLoadResult, LeaderboardSaveResult } from '../types/leaderboard'
import { CURRENT_LEADERBOARD_VERSION } from '../types/leaderboard'
import {
  normalizeLeaderboardEntries,
  readLeaderboardCache,
  sortLeaderboard,
  writeLeaderboardCache,
} from '../utils/leaderboard'

const TABLE_NAME = 'leaderboard_scores'
const LEADERBOARD_LIMIT = 100

function createUuid() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID()

  const bytes = new Uint8Array(16)
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes)
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256)
    }
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function readableError(error: unknown) {
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }
  return 'Leaderboard sync failed.'
}

function offlineResult(gameId: string, error: string, configured: boolean): LeaderboardLoadResult {
  const cachedEntries = readLeaderboardCache(gameId)
  return {
    entries: cachedEntries,
    source: cachedEntries.length > 0 ? 'cache' : 'none',
    configured,
    error,
  }
}

export function createLeaderboardEntry(
  gameId: string,
  player: PlayerProfile,
  stats: GameStats,
): LeaderboardEntry {
  return {
    id: createUuid(),
    gameId,
    ...player,
    ...stats,
    timestamp: new Date().toISOString(),
    version: CURRENT_LEADERBOARD_VERSION,
  }
}

export async function loadLeaderboard(gameId: string): Promise<LeaderboardLoadResult> {
  if (!supabase) {
    return offlineResult(gameId, supabaseConfigurationError ?? 'Supabase is not configured.', false)
  }

  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('id, game_id, initials, program, correct_answers, arcade_points, best_streak, version, created_at')
      .eq('game_id', gameId)
      .order('correct_answers', { ascending: false })
      .order('arcade_points', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(LEADERBOARD_LIMIT)

    if (error) throw error
    const entries = normalizeLeaderboardEntries(data ?? [], gameId)
    writeLeaderboardCache(gameId, entries)
    return { entries, source: 'supabase', configured: true }
  } catch (error) {
    return offlineResult(gameId, readableError(error), true)
  }
}

async function entryAlreadyExists(id: string) {
  if (!supabase) return false
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('id')
    .eq('id', id)
    .maybeSingle()
  return !error && Boolean(data)
}

export async function saveLeaderboardEntry(entry: LeaderboardEntry): Promise<LeaderboardSaveResult> {
  if (!supabase) {
    const result = offlineResult(entry.gameId, supabaseConfigurationError ?? 'Supabase is not configured.', false)
    return { ...result, saved: false }
  }

  try {
    const { error } = await supabase.from(TABLE_NAME).insert({
      id: entry.id,
      game_id: entry.gameId,
      initials: entry.initials,
      program: entry.program,
      correct_answers: entry.correctAnswers,
      arcade_points: entry.arcadePoints,
      best_streak: entry.bestStreak,
      version: entry.version,
    })

    if (error && !(error.code === '23505' && await entryAlreadyExists(entry.id))) throw error

    const refreshed = await loadLeaderboard(entry.gameId)
    if (refreshed.source === 'supabase') return { ...refreshed, saved: true }

    const cachedEntries = sortLeaderboard([...refreshed.entries, entry])
    writeLeaderboardCache(entry.gameId, cachedEntries)
    return { ...refreshed, entries: cachedEntries, source: 'cache', saved: true }
  } catch (error) {
    const result = offlineResult(entry.gameId, readableError(error), true)
    return { ...result, saved: false }
  }
}
