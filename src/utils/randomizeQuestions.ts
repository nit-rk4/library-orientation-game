import type { Question } from '../types/game'

function shuffle<T>(values: T[]) {
  const shuffled = [...values]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }

  return shuffled
}

export function randomizeQuestionChoices(questions: Question[]) {
  return questions.map((question) => ({
    ...question,
    suggestions: shuffle(question.suggestions),
  }))
}
