import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { useArcadeAudio } from '../audio/ArcadeAudioContext'

export type PixelIconName = 'book' | 'search' | 'brick' | 'lock' | 'coin' | 'spark'

export function PixelIcon({ name, className = '' }: { name: PixelIconName; className?: string }) {
  return <span aria-hidden="true" className={`pixel-icon pixel-icon--${name} ${className}`}><i /></span>
}

export function ArcadeFrame({ children, className = '', tone = 'blue' }: {
  children: ReactNode
  className?: string
  tone?: 'blue' | 'gold' | 'red' | 'mint'
}) {
  return (
    <div className={`arcade-frame arcade-frame--${tone} ${className}`}>
      <i className="arcade-frame__corner arcade-frame__corner--tl" aria-hidden="true" />
      <i className="arcade-frame__corner arcade-frame__corner--tr" aria-hidden="true" />
      {children}
    </div>
  )
}

export function PixelBadge({ children, tone = 'blue', className = '' }: {
  children: ReactNode
  tone?: 'blue' | 'gold' | 'red' | 'mint'
  className?: string
}) {
  return <span className={`pixel-badge pixel-badge--${tone} ${className}`}>{children}</span>
}

export function HudCounter({ label, value, detail, tone = 'blue' }: {
  label: string
  value: string
  detail?: string
  tone?: 'blue' | 'gold' | 'red' | 'mint'
}) {
  return (
    <div className={`hud-counter hud-counter--${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  )
}

export function ArcadeLink({ children, className = '', onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { play } = useArcadeAudio()
  return (
    <a className={className} onClick={(event) => { play('navigate'); onClick?.(event) }} {...props}>
      {children}
    </a>
  )
}
