import { ArcadeFrame, ArcadeLink, PixelBadge, PixelIcon } from '../components/ArcadeElements'

export function RalphPreviewPage() {
  return (
    <section className="screen preview-page" aria-labelledby="ralph-title">
      <div className="preview-bricks" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
      <ArcadeLink className="text-link text-link--top" href="#/">◀ GAME SELECT</ArcadeLink>
      <PixelBadge tone="red">GAME 02 // UNDER CONSTRUCTION</PixelBadge>
      <div className="preview-lock" aria-hidden="true"><PixelIcon name="lock" /><span>02</span></div>
      <p className="eyebrow">RALPH INTEGRITY ARCADE</p>
      <h1 id="ralph-title"><span>True or False</span><em>Smash!</em></h1>
      <p className="screen-copy">Maling information has entered the arcade. This future group game will ask players to save verified library rules and smash false ones.</p>
      <div className="preview-actions" aria-label="Future game controls">
        <ArcadeFrame className="preview-action preview-action--save" tone="mint"><span>TRUE SIGNAL</span><strong>SAVE IT</strong><i aria-hidden="true">A</i></ArcadeFrame>
        <ArcadeFrame className="preview-action preview-action--smash" tone="red"><span>FALSE SIGNAL</span><strong>SMASH IT</strong><i aria-hidden="true">B</i></ArcadeFrame>
      </div>
      <div className="construction-sign"><PixelIcon name="brick" /><span>COMING SOON</span><small>NO QUESTIONS OR GAMEPLAY LOADED</small></div>
    </section>
  )
}
