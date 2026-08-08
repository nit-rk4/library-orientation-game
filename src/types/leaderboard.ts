import type { GameStats, PlayerProfile } from './game'

export const CURRENT_LEADERBOARD_VERSION = 4

export interface LeaderboardEntry extends PlayerProfile, GameStats {
  id: string
  gameId: string
  timestamp: string
  version: number
}

export type LeaderboardSource = 'supabase' | 'cache' | 'none'
export type LeaderboardLoadStatus = 'loading' | 'synced' | 'cached' | 'unconfigured' | 'error'
export type ScoreSubmissionStatus = 'idle' | 'saving' | 'saved' | 'error'

export interface LeaderboardLoadResult {
  entries: LeaderboardEntry[]
  source: LeaderboardSource
  configured: boolean
  error?: string
}

export interface LeaderboardSaveResult extends LeaderboardLoadResult {
  saved: boolean
}
