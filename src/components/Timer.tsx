import { useEffect, useRef, useState } from 'react'

interface TimerProps {
  duration: number
  paused: boolean
  onExpire: () => void
  onTimeChange: (timeLeft: number) => void
}

export function Timer({ duration, paused, onExpire, onTimeChange }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const hasExpired = useRef(false)

  useEffect(() => {
    if (paused || timeLeft <= 0) return
    const intervalId = window.setInterval(() => setTimeLeft((current) => Math.max(0, current - 1)), 1000)
    return () => window.clearInterval(intervalId)
  }, [paused, timeLeft])

  useEffect(() => { onTimeChange(timeLeft) }, [onTimeChange, timeLeft])

  useEffect(() => {
    if (timeLeft === 0 && !hasExpired.current) {
      hasExpired.current = true
      onExpire()
    }
  }, [onExpire, timeLeft])

  return (
    <div className={`timer${timeLeft <= 5 ? ' timer--critical' : ''}`} aria-label={`${timeLeft} seconds remaining`}>
      <div className="timer__readout">
        <span className="timer__label">TIME ENERGY {paused && timeLeft > 0 ? '// HOLD' : ''}</span>
        <strong>{String(timeLeft).padStart(2, '0')}<small> SEC</small></strong>
      </div>
      <div className="timer__segments" aria-hidden="true">
        {Array.from({ length: duration }, (_, index) => <i className={index < timeLeft ? 'is-charged' : ''} key={index} />)}
      </div>
    </div>
  )
}
