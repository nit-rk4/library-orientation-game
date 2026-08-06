import { useRef, type ClipboardEvent, type KeyboardEvent } from 'react'

interface InitialsInputProps {
  value: string
  onChange: (value: string) => void
}

export function InitialsInput({ value, onChange }: InitialsInputProps) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])
  const characters = Array.from({ length: 3 }, (_, index) => value[index] ?? '')

  function updateCharacter(index: number, nextCharacter: string) {
    const nextCharacters = [...characters]
    nextCharacters[index] = nextCharacter.replace(/[^a-z]/gi, '').toUpperCase().slice(-1)
    onChange(nextCharacters.join(''))
    if (nextCharacters[index] && index < 2) inputRefs.current[index + 1]?.focus()
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !characters[index] && index > 0) {
      event.preventDefault()
      const nextCharacters = [...characters]
      nextCharacters[index - 1] = ''
      onChange(nextCharacters.join(''))
      inputRefs.current[index - 1]?.focus()
    }
    if (event.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (event.key === 'ArrowRight' && index < 2) inputRefs.current[index + 1]?.focus()
  }

  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData('text').replace(/[^a-z]/gi, '').toUpperCase().slice(0, 3)
    if (!pasted) return
    event.preventDefault()
    onChange(pasted)
    inputRefs.current[Math.min(pasted.length, 3) - 1]?.focus()
  }

  return (
    <div className="initials-input" aria-describedby="initials-hint">
      {characters.map((character, index) => (
        <input
          aria-label={`Initial ${index + 1} of 3`}
          autoCapitalize="characters"
          autoComplete="off"
          inputMode="text"
          key={index}
          maxLength={1}
          onChange={(event) => updateCharacter(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          ref={(element) => { inputRefs.current[index] = element }}
          value={character}
        />
      ))}
    </div>
  )
}
