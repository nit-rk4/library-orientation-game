import { ArcadeLink, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { gameModules } from '../data/gameModules'

export function LandingPage() {
  return (
    <section className="screen portal" aria-labelledby="portal-title">
      <div className="portal__intro">
        <div className="portal__bootline">
          <PixelBadge tone="gold">SYSTEM BOOT // READY</PixelBadge>
          <span><i /> SYSTEM ONLINE</span>
        </div>
        <div className="portal__sprites" aria-hidden="true">
          <PixelIcon name="book" /><PixelIcon name="search" /><PixelIcon name="brick" />
        </div>
        <div className="portal__title-row">
          <h1 id="portal-title"><span>LIBRARY</span><em>.EXE</em></h1>
          <span aria-hidden="true" className="portal__cursor" />
        </div>
        <p className="portal__subtitle">FRESHMAN MODE: <strong>ACTIVATED</strong></p>
        <p className="hero-copy">A freshman arcade challenge for the campus library. Press START to enter the Library.</p>
        <p className="portal__mission"><span className="pixel-led" /> ONE PLAYER. TWO LEVELS. RESTORE THE LIBRARY SYSTEM.</p>
        <div className="portal-actions" aria-label="Arcade actions">
          <ArcadeLink className="portal-action portal-action--primary" href="#/knowsmore">
            <span className="portal-action__label"><i aria-hidden="true">A</i> PRESS START</span><span aria-hidden="true">▶</span>
          </ArcadeLink>
          <ArcadeLink className="portal-action portal-action--secondary" href="#/leaderboard">
            <span className="portal-action__label"><i aria-hidden="true">B</i> LEADERBOARD</span><span aria-hidden="true">★</span>
          </ArcadeLink>
        </div>
        <div className="portal__telemetry" aria-label="Arcade status">
          <span><i /> 02 LEVELS ONLINE</span><span>1 PLAYER</span><span>20 TOTAL ROUNDS</span>
          <div className="portal__input-hints" aria-hidden="true">
            <span className="cabinet-stick"><i /></span>
            <span><i className="control-dot control-dot--gold" /> A SELECT</span>
            <span><i className="control-dot control-dot--red" /> B SCORES</span>
          </div>
        </div>
      </div>

      <div className="run-map" aria-label="Two-level run preview">
        <div className="run-map__header"><span>RUN MAP</span><strong>LEVEL 01 → LEVEL 02</strong></div>
        {gameModules.map((game, index) => (
          <article className={`run-level run-level--${game.id}`} key={game.id}>
            <div className="run-level__number"><small>LEVEL</small><strong>0{index + 1}</strong></div>
            <div className="run-level__copy">
              <p className="eyebrow">{game.eyebrow}</p>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <div className="module-card__meta"><PixelBadge tone={index === 0 ? 'blue' : 'red'}>{game.mode}</PixelBadge><PixelBadge tone="gold">{game.duration}</PixelBadge></div>
              <span className="run-level__sequence"><i /> {index === 0 ? 'STARTS FIRST' : 'LOADS NEXT'}</span>
            </div>
            <PixelIcon name={index === 0 ? 'search' : 'brick'} />
          </article>
        ))}
        <div className="run-map__footer"><span className="pixel-led" /> COMPLETE BOTH LEVELS TO POST A COMBINED SCORE</div>
      </div>
    </section>
  )
}
