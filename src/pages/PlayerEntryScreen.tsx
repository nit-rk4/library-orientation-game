import { useState, type FormEvent } from 'react'
import { ArcadeFrame, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Button } from '../components/Button'
import { InitialsInput } from '../components/InitialsInput'
import { programs } from '../data/programs'
import type { PlayerProfile } from '../types/game'

interface PlayerEntryScreenProps {
  initialPlayer: PlayerProfile | null
  onContinue: (player: PlayerProfile) => void
}

export function PlayerEntryScreen({ initialPlayer, onContinue }: PlayerEntryScreenProps) {
  const [initials, setInitials] = useState(initialPlayer?.initials ?? '')
  const [program, setProgram] = useState(initialPlayer?.program ?? '')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (initials.length === 3 && program) onContinue({ initials, program })
  }

  return (
    <section className="screen screen--entry" aria-labelledby="entry-title">
      <PixelBadge tone="gold">PLAYER REGISTRATION</PixelBadge>
      <h1 id="entry-title">Enter your<br /><em>player data</em></h1>
      <p className="screen-copy">Create a local arcade profile for your score, streak, and program leaderboard entry.</p>
      <ArcadeFrame className="registration-console" tone="blue">
        <div className="registration-console__header"><PixelIcon name="coin" /><span>PLAYER 1</span><strong>{initials.length === 3 && program ? 'READY' : 'JOINING…'}</strong></div>
        <form className="entry-form" onSubmit={submit}>
          <div className="entry-field">
            <span className="entry-field__label">ENTER 3 INITIALS <i>REQUIRED</i></span>
            <InitialsInput onChange={setInitials} value={initials} />
            <small id="initials-hint">Use letters only. Paste is supported.</small>
          </div>
          <label>
            <span>CHOOSE PROGRAM <i>REQUIRED</i></span>
            <select onChange={(event) => setProgram(event.target.value)} value={program}>
              <option value="" disabled>SELECT PROGRAM</option>
              {programs.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <Button disabled={initials.length !== 3 || !program} fullWidth sound="execute" type="submit">Player 1 ready</Button>
        </form>
      </ArcadeFrame>
      <p className="privacy-note">LOCAL HIGH SCORES ONLY // NO ACCOUNT NEEDED</p>
    </section>
  )
}
