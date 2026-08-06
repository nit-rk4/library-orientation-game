import { ArcadeFrame, ArcadeLink, PixelBadge, PixelIcon } from '../components/ArcadeElements'
import { Button } from '../components/Button'

interface StartScreenProps {
  onStart: () => void
}

export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <section className="screen screen--start" aria-labelledby="game-title">
      <ArcadeLink className="text-link text-link--top" href="#/">◀ GAME SELECT</ArcadeLink>
      <div className="attract-mode">
        <div className="attract-mode__art" aria-hidden="true">
          <PixelIcon name="search" /><PixelIcon name="book" /><i /><i /><i />
        </div>
        <PixelBadge tone="gold">ATTRACT MODE // GAME 01</PixelBadge>
        <p className="eyebrow">KNOWSMORE SEARCH ARCADE</p>
        <h1 id="game-title"><span>Missing</span><em>Word</em></h1>
        <p className="hero-copy">
          Ten library words are corrupted. Read the clue, lock onto the correct
          search result, and restore the database before time runs out.
        </p>
      </div>

      <ArcadeFrame className="query-preview" tone="blue">
        <span className="query-preview__label">DEMO QUERY // READY</span>
        <div><PixelIcon name="search" /><strong>C_LL N_MB_R</strong><em>▶</em><b>CALL NUMBER</b></div>
        <small>CONTEXT + ACCURACY + SPEED = HIGH SCORE</small>
      </ArcadeFrame>

      <div className="attract-rules" aria-label="How to play">
        <span><b>1</b> READ CLUE</span><span><b>2</b> PICK RESULT</span><span><b>3</b> RUN SEARCH</span>
      </div>
      <div className="hero-actions">
        <Button onClick={onStart}>Press start</Button>
        <p><span className="pixel-led" /> 10 ROUNDS · 15 SECONDS · PASS AT 7</p>
      </div>
    </section>
  )
}
