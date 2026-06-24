import { sections, spawnIntro } from "../data/sections"

// The "skip the quest / just read it" page: every section and the CTA as plain
// semantic HTML, server-rendered with zero JS so search engines, assistive tech,
// and JS-off visitors get the complete page. Copy comes straight from the same
// `sections` data the game uses, so the two can never drift apart. It lives in
// normal document flow underneath the fixed game stage; the stage hides it (or
// `<noscript>` does, with JS off) and the HUD "Skip quest" button reveals it.
//
// The leading <h1> + intro double as the document's SEO heading; each Shard
// becomes an <article>. Order follows the intended reading order, not pickup
// order. The "Play the quest" control is a tiny client island (ReadingToggle),
// inert and harmless when JS is unavailable.

import ReadingToggle from "./ReadingToggle"

const SECTION_ORDER = [
  "shard-canon",
  "shard-pipeline",
  "shard-keyring",
  "shard-rune",
  "shard-cog",
]

const REPO = "https://github.com/dodoxtech/asset-canon"
const DOCS = "https://github.com/dodoxtech/asset-canon#readme"
const INSTALL = "npx skills add github:dodoxtech/asset-canon"

export default function FallbackContent() {
  return (
    <main id="fallback" className="fallback-content">
      <header className="fallback-head">
        <h1>{spawnIntro.title}</h1>
        <p className="fallback-tagline">Turn a brief into shippable art.</p>
        <ReadingToggle />
      </header>

      {SECTION_ORDER.map((id) => {
        const s = sections[id]
        if (!s) return null
        return (
          <article key={s.id} className="fallback-section">
            <h2>{s.title}</h2>
            {s.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>
        )
      })}

      <article className="fallback-section fallback-cta">
        <h2>NOW GO BUILD SOMETHING.</h2>
        <p>
          <code>{INSTALL}</code>
        </p>
        <p className="fallback-actions">
          <a href={REPO} target="_blank" rel="noreferrer">
            ★ Star on GitHub
          </a>
          <a href={DOCS} target="_blank" rel="noreferrer">
            Read the docs
          </a>
        </p>
        <p>asset-canon — turn a brief into shippable art, straight to your repo.</p>
      </article>

      <footer className="fallback-foot">
        <ReadingToggle label="▶ Play the quest" />
      </footer>
    </main>
  )
}
