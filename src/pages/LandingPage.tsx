import { ArcadeLink, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { gameModules } from '../data/gameModules'

export function LandingPage() {
  return (
    <section className="screen portal" aria-labelledby="portal-title">
      <div className="portal__intro">
        <div className="portal__sprites" aria-hidden="true">
          <PixelIcon name="book" /><PixelIcon name="search" /><PixelIcon name="spark" />
        </div>
        <PixelBadge tone="gold">FRESHMAN ARCADE // SELECT MODE</PixelBadge>
        <h1 id="portal-title"><span>Library</span><em>Game Central</em></h1>
        <p className="hero-copy">
          Your campus library just went arcade. Choose a cabinet, learn the
          system, and build your high score.
        </p>
        <div className="insert-prompt"><PixelIcon name="coin" /><span>PRESS START TO LEARN</span><i /></div>
        <div className="portal__telemetry" aria-label="Arcade status">
          <span><i /> 01 GAME READY</span><span>1 PLAYER</span><span>MOBILE MODE</span>
        </div>
      </div>

      <div className="module-grid" aria-label="Game cabinets">
        {gameModules.map((game, index) => (
          <article className={`module-card module-card--${game.status}`} key={game.id}>
            <div className="module-card__marquee">
              <span>GAME 0{index + 1}</span>
              <PixelIcon name={game.status === 'online' ? 'search' : 'brick'} />
            </div>
            <div className="module-card__screen">
              <div className="module-card__status">
                <span className="pixel-led" /> {game.status === 'online' ? 'NOW PLAYING' : 'UNDER CONSTRUCTION'}
              </div>
              <p className="eyebrow">{game.eyebrow}</p>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <div className="module-card__meta"><PixelBadge>{game.mode}</PixelBadge><PixelBadge tone="gold">{game.duration}</PixelBadge></div>
            </div>
            <div className="module-card__controls" aria-hidden="true">
              <span className="mini-joystick"><i /></span><span className="arcade-button arcade-button--red" /><span className="arcade-button arcade-button--gold" />
            </div>
            <ArcadeLink className={`module-card__link${game.status === 'queued' ? ' module-card__link--preview' : ''}`} href={`#${game.route}`}>
              {game.status === 'online' ? 'PRESS START' : 'VIEW PREVIEW'} <span aria-hidden="true">▶</span>
            </ArcadeLink>
          </article>
        ))}
      </div>
    </section>
  )
}
