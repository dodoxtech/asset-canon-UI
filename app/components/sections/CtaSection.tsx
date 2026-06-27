import { RevealWords, FadeUp } from "../effects"
import { REPO, DOCS, INSTALL, B } from "../site"

export function CtaSection() {
  return (
    <section className="cta-sect" aria-labelledby="s5">
      <img className="sect-bg cta-bg-img" src={`${B}/bg-cta-480x270.webp`} alt="" aria-hidden="true" />
      <div className="cta-veil" aria-hidden="true" />

      {/* Artifact behind everything */}
      <div className="cta-artifact" aria-hidden="true">
        <div className="lp-sprite lp-sprite-artifact" />
      </div>

      <div className="cta-inner">
        {/* immediate: this is the last section (only a short footer below),
            so the scroll observer has almost no runway to fire reliably.
            Animate on mount like the hero — it's fully revealed by the
            time the user scrolls here. */}
        <FadeUp delay={0.05} immediate>
          <span className="tag tag-gold">GET STARTED</span>
        </FadeUp>
        <RevealWords
          text="NOW GO BUILD SOMETHING."
          className="cta-headline"
          as="h2"
          delay={0.1}
          immediate
        />
        <FadeUp delay={0.35} immediate>
          <div className="cta-terminal">
            <span className="terminal-prompt">$</span>
            <code className="terminal-cmd">{INSTALL}</code>
          </div>
        </FadeUp>
        <FadeUp delay={0.48} immediate>
          <p className="cta-note">
            Node 18+ · Codex CLI or <code>OPENAI_API_KEY</code> ·{" "}
          </p>
        </FadeUp>
        <FadeUp delay={0.58} immediate>
          <div className="cta-btns">
            <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary btn-lg">
              ★ Star on GitHub
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </a>
            <a href={DOCS} target="_blank" rel="noreferrer" className="btn-ghost btn-lg">
              Read the docs
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
