import type { Question } from '../types/game'

interface IdentifiedQuestion {
  id: string
}

function shuffle<T>(values: readonly T[]) {
  const shuffled = [...values]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }

  return shuffled
}

function hasSameOrder<T extends IdentifiedQuestion>(first: readonly T[], second: readonly T[]) {
  return first.length === second.length && first.every((question, index) => question.id === second[index]?.id)
}

export function randomizeQuestionOrder<T extends IdentifiedQuestion>(
  questions: readonly T[],
  previousOrder: readonly T[] = [],
) {
  const shuffled = shuffle(questions)

  if (shuffled.length > 1 && hasSameOrder(shuffled, previousOrder)) {
    return [...shuffled.slice(1), shuffled[0]]
  }

  return shuffled
}

export function randomizeKnowsMoreQuestions(
  questions: readonly Question[],
  previousOrder: readonly Question[] = [],
) {
  return randomizeQuestionOrder(questions, previousOrder).map((question) => ({
    ...question,
    suggestions: shuffle(question.suggestions),
  }))
}
