export const BASE_CORRECT_POINTS = 1000
export const POINTS_PER_SECOND = 25
export const MAX_STREAK_BONUS = 400

export function calculateQuestionPoints(timeRemaining: number, streak: number) {
  const safeTime = Math.max(0, Math.min(15, Math.floor(timeRemaining)))
  const streakBonus = Math.min(Math.max(streak - 1, 0) * 100, MAX_STREAK_BONUS)
  return BASE_CORRECT_POINTS + safeTime * POINTS_PER_SECOND + streakBonus
}
