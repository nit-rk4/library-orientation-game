import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'

export type ArcadeSound = 'navigate' | 'select' | 'execute' | 'success' | 'error' | 'timeout' | 'win'

interface ArcadeAudioController {
  enabled: boolean
  toggle: () => void
  play: (sound: ArcadeSound) => void
}

const SOUND_STORAGE_KEY = 'library-game-central-sound'
const ArcadeAudioContext = createContext<ArcadeAudioController | null>(null)

function loadSoundPreference() {
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'on'
  } catch {
    return false
  }
}

export function ArcadeAudioProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(loadSoundPreference)
  const enabledRef = useRef(enabled)
  const contextRef = useRef<AudioContext | null>(null)

  const getContext = useCallback(() => {
    if (contextRef.current) return contextRef.current
    const AudioContextClass = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return null
    contextRef.current = new AudioContextClass()
    return contextRef.current
  }, [])

  const emit = useCallback((sound: ArcadeSound, force = false) => {
    if (!enabledRef.current && !force) return
    const context = getContext()
    if (!context) return
    void context.resume()

    const patterns: Record<ArcadeSound, Array<[number, number, number, OscillatorType]>> = {
      navigate: [[360, 0, .045, 'square']],
      select: [[520, 0, .035, 'square'], [680, .045, .03, 'square']],
      execute: [[220, 0, .06, 'sawtooth'], [440, .07, .09, 'square']],
      success: [[440, 0, .06, 'square'], [660, .08, .06, 'square'], [880, .16, .11, 'square']],
      error: [[260, 0, .1, 'sawtooth'], [150, .1, .14, 'sawtooth']],
      timeout: [[210, 0, .1, 'square'], [160, .12, .1, 'square'], [110, .24, .18, 'square']],
      win: [[392, 0, .08, 'square'], [523, .09, .08, 'square'], [659, .18, .08, 'square'], [784, .27, .18, 'square']],
    }

    const now = context.currentTime
    patterns[sound].forEach(([frequency, delay, duration, type]) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = type
      oscillator.frequency.setValueAtTime(frequency, now + delay)
      gain.gain.setValueAtTime(.035, now + delay)
      gain.gain.exponentialRampToValueAtTime(.001, now + delay + duration)
      oscillator.connect(gain)
      gain.connect(context.destination)
      oscillator.start(now + delay)
      oscillator.stop(now + delay + duration)
    })
  }, [getContext])

  const toggle = useCallback(() => {
    const next = !enabledRef.current
    enabledRef.current = next
    setEnabled(next)
    try {
      localStorage.setItem(SOUND_STORAGE_KEY, next ? 'on' : 'off')
    } catch {
      // Sound still works for the current session when storage is unavailable.
    }
    if (next) emit('select', true)
  }, [emit])

  return (
    <ArcadeAudioContext.Provider value={{ enabled, toggle, play: emit }}>
      {children}
    </ArcadeAudioContext.Provider>
  )
}

export function useArcadeAudio() {
  const context = useContext(ArcadeAudioContext)
  if (!context) throw new Error('useArcadeAudio must be used within ArcadeAudioProvider')
  return context
}
