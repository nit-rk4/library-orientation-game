import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { useArcadeAudio, type ArcadeSound } from '../audio/ArcadeAudioContext'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
  sound?: ArcadeSound | false
}

export function Button({
  children,
  variant = 'primary',
  fullWidth = false,
  sound = 'navigate',
  className = '',
  onClick,
  ...props
}: ButtonProps) {
  const { play } = useArcadeAudio()

  return (
    <button
      className={`button button--${variant}${fullWidth ? ' button--full' : ''} ${className}`}
      onClick={(event) => { if (sound) play(sound); onClick?.(event) }}
      {...props}
    >
      <span>{children}</span>
      {variant === 'primary' && <span aria-hidden="true" className="button__arrow">▶</span>}
    </button>
  )
}
