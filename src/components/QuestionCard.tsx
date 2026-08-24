import { useArcadeAudio } from '../audio/ArcadeAudioContext'
import type { AnswerFeedback, Question, QuestionPhase } from '../types/game'
import { PixelBadge, PixelIcon } from './ArcadeElements'

interface QuestionCardProps {
  question: Question
  phase: QuestionPhase
  selectedTerm: string | null
  feedback: AnswerFeedback | null
  onSelect: (term: string) => void
}

export function QuestionCard({ question, phase, selectedTerm, feedback, onSelect }: QuestionCardProps) {
  const isLocked = phase !== 'active'
  const displayedTerm = feedback ? question.restoredTerm : question.corruptedTerm
  const { play } = useArcadeAudio()

  return (
    <article className={`question-card question-card--${phase}${feedback ? feedback.isCorrect ? ' is-success' : feedback.timedOut ? ' is-timeout' : ' is-error' : ''}`}>
      <i className="question-card__bolt question-card__bolt--left" aria-hidden="true" />
      <i className="question-card__bolt question-card__bolt--right" aria-hidden="true" />
      <div className="question-card__header">
        <span><span className="pixel-led" /> {phase === 'scanning' ? 'LOADING ROUND' : 'SEARCH MODE'}</span>
        <PixelBadge tone={question.difficulty === 'FOUNDATION' ? 'blue' : 'gold'}>{question.topic}</PixelBadge>
      </div>

      <div className="term-display" aria-live="polite">
        <div className="term-display__label"><PixelIcon name="brick" /> DAMAGED WORD</div>
        <strong className={feedback ? 'is-restored' : ''}>{displayedTerm}</strong>
        <div className="term-display__pixels" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      </div>

      <div className="query-context">
        <p>{question.systemPrompt}</p>
        <h2>{question.contextClue}</h2>
      </div>

      <div className="search-console" role="search">
        <label htmlFor={`query-${question.id}`}><PixelIcon name="search" /> SEARCH BAR</label>
        <div className="search-console__input">
          <span aria-hidden="true">▶</span>
          <input id={`query-${question.id}`} readOnly tabIndex={-1} value={selectedTerm ?? ''} placeholder={phase === 'scanning' ? 'LOADING RESULTS…' : 'CHOOSE A SEARCH RESULT'} />
          <span className="search-console__cursor" aria-hidden="true" />
        </div>
      </div>

      <div className="suggestion-list" role="listbox" aria-label="Search results">
        {question.suggestions.map((suggestion, index) => {
          const isSelected = selectedTerm === suggestion.term
          const isCorrect = Boolean(feedback) && suggestion.term === question.restoredTerm
          const isWrong = Boolean(feedback) && isSelected && !feedback?.isCorrect
          return (
            <button
              aria-selected={isSelected}
              className={`search-suggestion${isSelected ? ' is-selected' : ''}${isCorrect ? ' is-correct' : ''}${isWrong ? ' is-wrong' : ''}`}
              disabled={isLocked}
              key={suggestion.term}
              onClick={() => { play('select'); play('execute'); onSelect(suggestion.term) }}
              role="option"
              type="button"
            >
              <span className="search-suggestion__cursor" aria-hidden="true">{isSelected ? '▶' : ''}</span>
              <span className="search-suggestion__index">0{index + 1}</span>
              <span className="search-suggestion__copy"><strong>{suggestion.term}</strong><small>{suggestion.descriptor}</small></span>
              <span className="search-suggestion__signal" aria-hidden="true">{isCorrect ? 'OK!' : isWrong ? 'MISS' : '+'}</span>
            </button>
          )
        })}
      </div>

      {(phase === 'scanning' || phase === 'resolving') && (
        <div className="scan-overlay" aria-live="polite">
          <PixelIcon name="search" /><span />
          {phase === 'scanning' ? 'LOADING SEARCH LEVEL…' : 'CHECKING ANSWER…'}
        </div>
      )}
    </article>
  )
}
