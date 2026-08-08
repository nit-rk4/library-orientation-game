import { useEffect, type ReactNode } from 'react'
import { useArcadeAudio } from '../audio/ArcadeAudioContext'
import { PixelIcon } from './ArcadeElements'

interface AppShellProps {
  route: string
  children: ReactNode
}

export function AppShell({ route, children }: AppShellProps) {
  const isPortal = route === '/'
  const systemStatus = isPortal ? 'FULL RUN READY' : route === '/leaderboard' ? 'SCORE ARCHIVE' : 'PLAYER 1'
  const { enabled: soundEnabled, play, toggle } = useArcadeAudio()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [route])

  return (
    <main className="app-shell">
      <div className="pixel-sky" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="brick-field brick-field--left" aria-hidden="true" />
      <div className="brick-field brick-field--right" aria-hidden="true" />
      <header className="system-header">
        <a aria-label="Library Game Central" className="system-brand" href="#/" onClick={() => play('navigate')}>
          <span className="system-brand__mark"><PixelIcon name="book" /></span>
          <span>LIBRARY<em>ARCADE</em><small>GAME CENTRAL</small></span>
        </a>
        <div className="system-header__controls">
          <div className="system-header__status"><span className="pixel-led" /> {systemStatus}</div>
          <button aria-label={soundEnabled ? 'Mute arcade sound' : 'Enable arcade sound'} aria-pressed={soundEnabled} className="sound-toggle" onClick={toggle} type="button">
            <span aria-hidden="true">{soundEnabled ? '♪' : '×'}</span> SOUND {soundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </header>
      <div className="cabinet-screen">
        <i className="cabinet-bolt cabinet-bolt--tl" aria-hidden="true" />
        <i className="cabinet-bolt cabinet-bolt--tr" aria-hidden="true" />
        <div className="scanlines" aria-hidden="true" />
        <div className="game-container" id="top">{children}</div>
      </div>
      <footer className="system-footer">
        <span className="coin-slot"><PixelIcon name="coin" /> INSERT KNOWLEDGE</span>
        <span className="speaker-grille" aria-hidden="true"><i /><i /><i /><i /><i /></span>
        <span>LIBRARY GAME CENTRAL // v3.0</span>
      </footer>
    </main>
  )
}
