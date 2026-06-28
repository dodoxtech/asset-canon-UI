import { RevealWords, FadeUp, SpriteDirectionDemo } from "../effects"
import { B, D } from "../site"

export function SpriteDemoSection() {
  return (
    <section className="sect sect-dark sprite-demo-sect" aria-labelledby="s6">
      <img className="sect-bg" src={`${B}/bg-workshop-480x270.webp`} alt="" aria-hidden="true" />
      <div className="sect-overlay ol-center" aria-hidden="true" />

      <div className="sect-inner">
        <div className="sect-num" aria-hidden="true">07</div>

        <div className="sprite-demo-head">
          <div>
            <FadeUp>
              <span className="tag">07 — asset-sprite demo</span>
            </FadeUp>
            <RevealWords
              text="CLAY SHEET TO PLAYABLE ASSASSIN."
              className="sect-title"
              as="h2"
              delay={0.08}
            />
          </div>
          <FadeUp delay={0.2}>
            <p className="sect-sub">
              A realistic clay-style assassin moves from chroma plate to clean alpha,
              then into a crisp atlas-driven WASD preview.
            </p>
          </FadeUp>
        </div>

        <div className="sprite-demo-grid">
          <div className="sprite-pipeline">
            <FadeUp delay={0.16} className="sprite-output-card">
              <div className="sprite-card-top">
                <span>01</span>
                <strong>source render</strong>
              </div>
              <div className="sprite-image-wrap sprite-image-green">
                <img
                  src={`${D}/john-wick-clay-source-1024x1024.png`}
                  alt="Original generated realistic clay assassin sprite sheet on chroma green background"
                  width={1024}
                  height={1024}
                  loading="lazy"
                />
              </div>
              <p>Generated on a chroma clay board so the silhouette can be cut cleanly.</p>
            </FadeUp>

            <FadeUp delay={0.24} className="sprite-output-card">
              <div className="sprite-card-top">
                <span>02</span>
                <strong>background removed</strong>
              </div>
              <div className="sprite-image-wrap sprite-image-alpha">
                <img
                  src={`${D}/john-wick-clay-sheet-1024x1024.webp`}
                  alt="Alpha-keyed realistic clay assassin sprite sheet with transparent background"
                  width={1024}
                  height={1024}
                  loading="lazy"
                />
              </div>
              <p>The key plate is removed and the matte clay edge stays intact.</p>
            </FadeUp>
          </div>

          <FadeUp delay={0.32} className="sprite-live-card">
            <div className="sprite-live-top">
              <span>03</span>
              <strong>usable output</strong>
              <code>128x128 · 64 frames · atlas.json</code>
            </div>
            <SpriteDirectionDemo />
            <div className="sprite-links" aria-label="Generated sprite files">
              <a href={`${D}/john-wick-clay-sheet-1024x1024.png`} target="_blank" rel="noreferrer">
                PNG sheet
              </a>
              <a href={`${D}/john-wick-clay-sheet-1024x1024.json`} target="_blank" rel="noreferrer">
                atlas JSON
              </a>
              <span>docs/assets/john-wick-clay.yaml</span>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
