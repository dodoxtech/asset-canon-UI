import { RevealWords, FadeUp, Marquee } from "../effects"
import { REPO, DOCS, INSTALL, B } from "../site"

export function Hero() {
  return (
    <section className="hero hero-luxury" aria-label="Hero">
      <div className="luxury-paper" aria-hidden="true" />

      <div className="hero-inner">

        {/* Left: editorial headline + commands */}
        <div className="hero-left">
          <FadeUp delay={0.05} immediate>
            <div className="eyebrow-row">
              <span className="live-dot" aria-hidden="true" />
              <span className="eyebrow-label">consistent image generation workflow</span>
            </div>
          </FadeUp>

          <h1 className="headline">
            <span className="headline-row">
              <RevealWords text="Generate" delay={0.15} immediate />
            </span>
            <span className="headline-row headline-dim">
              <RevealWords text="images in" delay={0.22} immediate />
            </span>
            <span className="headline-row headline-accent">
              <RevealWords text="one style." delay={0.29} immediate />
            </span>
          </h1>

          <FadeUp delay={0.52} immediate>
            <p className="hero-sub">
              asset-canon gives your coding agent a repeatable workflow for
              image generation: plan the brief, lock the style, generate the
              set, optimize the files, and document every asset.
            </p>
          </FadeUp>

          <FadeUp delay={0.62} immediate>
            <div className="terminal-card hero-terminal">
              <span className="terminal-prompt">$</span>
              <code className="terminal-cmd">{INSTALL}</code>
            </div>
          </FadeUp>

          <FadeUp delay={0.72} immediate>
            <div className="hero-btns">
              <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary">
                Star on GitHub
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </a>
              <a href={DOCS} target="_blank" rel="noreferrer" className="btn-ghost">
                Read the docs
              </a>
            </div>
          </FadeUp>

          <FadeUp delay={0.82} immediate>
            <div className="hero-stats" aria-label="asset-canon highlights">
              <div>
                <strong>05</strong>
                <span>specialists</span>
              </div>
              <div>
                <strong>1x</strong>
                <span>style profile</span>
              </div>
              <div>
                <strong>yaml</strong>
                <span>sidecars</span>
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Right: quiet art-object preview */}
        <div className="hero-right" aria-hidden="true">
          <div className="luxury-plate">
            <picture className="luxury-visual">
              <source
                type="image/webp"
                srcSet={`${B}/hero-forge-backdrop-800x450.webp 800w, ${B}/hero-forge-backdrop-1200x675.webp 1200w, ${B}/hero-forge-backdrop-1600x900.webp 1600w`}
                sizes="(max-width: 1024px) 90vw, 42vw"
              />
              <img
                src={`${B}/hero-forge-backdrop-1200x675.png`}
                alt=""
                width={1200}
                height={675}
              />
            </picture>
            <div className="luxury-plate-caption">
              <span>01</span>
              <span>generated image asset</span>
            </div>
          </div>
          <div className="luxury-proof">
            <span>style-profile.yaml</span>
            <span>webp · png · descriptors</span>
          </div>
        </div>
      </div>

      {/* Marquee belt */}
      <Marquee>
        BRIEF IN · FILES OUT · IN YOUR REPO · asset-icon · asset-illustration ·
        asset-sprite · asset-texture · asset-social · ONE INSTALL LINE ·&nbsp;
      </Marquee>
    </section>
  )
}
