import { Fragment } from "react"
import { sections } from "../data/sections"
import { Cursor, RevealWords, FadeUp, Stagger, StaggerItem, Marquee } from "./effects"

const REPO    = "https://github.com/dodoxtech/asset-canon"
const DOCS    = "https://github.com/dodoxtech/asset-canon#readme"
const INSTALL = "npx skills add github:dodoxtech/asset-canon"

const B = "/assets/generated/backdrops"
const S = "/assets/generated/sprites"
const C = "/assets/generated/comparisons"

const STEPS = ["BRIEF", "PLAN", "GENERATE", "OPTIMIZE", "WRITE", "REPORT"] as const

const PIPELINE = [
  { id: "brief",    num: "01", icon: "○", name: "BRIEF",    desc: "Your words become the spec.",      accent: "#e8ecf8" },
  { id: "plan",     num: "02", icon: "◈", name: "PLAN",     desc: "Style locked. Targets mapped.",    accent: "#3ca0ff" },
  { id: "generate", num: "03", icon: "⬡", name: "GENERATE", desc: "Model renders every pixel.",       accent: "#3ce07a" },
  { id: "optimize", num: "04", icon: "◇", name: "OPTIMIZE", desc: "sharp compresses, no quality loss.", accent: "#ffc83c" },
  { id: "write",    num: "05", icon: "▣", name: "WRITE",    desc: "Deterministic files land on disk.", accent: "#3ce07a" },
  { id: "report",   num: "06", icon: "◉", name: "REPORT",   desc: "What shipped, where, why. Done.",  accent: "#ff2cc0" },
] as const

const SKILLS = [
  { sprite: "lp-sprite-shard-canon",    name: "asset-icon",         desc: "Favicons & UI glyphs", rotate: -1.8 },
  { sprite: "lp-sprite-shard-pipeline", name: "asset-illustration", desc: "Heroes & spots",        rotate:  1.2 },
  { sprite: "lp-sprite-shard-keyring",  name: "asset-sprite",       desc: "Sprites, tiles & sheets", rotate: -0.8 },
  { sprite: "lp-sprite-shard-rune",     name: "asset-texture",      desc: "Seamless tiles",        rotate:  2.0 },
  { sprite: "lp-sprite-shard-cog",      name: "asset-social",       desc: "OG cards at exact sizes", rotate: -1.3 },
] as const

const BASE_PROMPT =
  "A tiny magical workshop where a coding agent turns a short asset brief into polished web game art."

const SKILL_PROMPT =
  "Same base prompt + style-profile.yaml auto loaded."

const STYLE_RUNS = [
  { step: "01", title: "Hero character", body: "Brave kid inventor, warm family-animation proportions, round expressive face, same costume language." },
  { step: "02", title: "Sidekick character", body: "Tiny clockwork helper, same eye shape, same palette, same soft storybook silhouette rules." },
  { step: "03", title: "Magic tool", body: "Oversized glowing paintbrush-wrench, same highlight colors, same outline weight, same material rules." },
  { step: "04", title: "Prop set", body: "Backpack, compass, star badge, and potion bottle generated later but still reading as one world." },
] as const

export default function LandingPage() {
  return (
    <>
      {/* Global effects */}
      <div className="grain" aria-hidden="true" />
      <div className="mesh-bg" aria-hidden="true" />
      <Cursor />

      <main className="lp-root">

        {/* ── NAV ──────────────────────────────────────────── */}
        <header className="nav">
          <div className="nav-inner">
            <img
              className="nav-logo"
              src={`${S}/logo-assets-canon-240x72.webp`}
              alt="assets-canon"
              width={120} height={36}
            />
            <nav className="nav-links" aria-label="Primary">
              <a href={REPO} target="_blank" rel="noreferrer" className="nav-link">GitHub</a>
              <a href={DOCS}  target="_blank" rel="noreferrer" className="nav-link">Docs</a>
            </nav>
            <a href={REPO} target="_blank" rel="noreferrer" className="nav-cta">
              Install ↗
            </a>
          </div>
        </header>

        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="hero" aria-label="Hero">
          <div className="hero-inner">

            {/* Left: headline + meta */}
            <div className="hero-left">
              <FadeUp delay={0.05}>
                <div className="eyebrow-row">
                  <span className="live-dot" aria-hidden="true" />
                  <span className="eyebrow-label">AI image-generation · for your coding agent</span>
                </div>
              </FadeUp>

              <h1 className="headline">
                <span className="headline-row">
                  <RevealWords text="DESCRIBE." delay={0.15} />
                </span>
                <span className="headline-row headline-dim">
                  <RevealWords text="GENERATE." delay={0.22} />
                </span>
                <span className="headline-row headline-accent">
                  <RevealWords text="SHIP." delay={0.29} />
                </span>
              </h1>

              <FadeUp delay={0.52}>
                <p className="hero-sub">
                  asset-canon turns your brief into production-ready image files —
                  webp, png, ico — straight to your repo.
                </p>
              </FadeUp>

              <FadeUp delay={0.62}>
                <div className="terminal-card">
                  <span className="terminal-prompt">$</span>
                  <code className="terminal-cmd">{INSTALL}</code>
                </div>
              </FadeUp>

              <FadeUp delay={0.72}>
                <div className="hero-btns">
                  <a href={REPO} target="_blank" rel="noreferrer" className="btn-primary">
                    ★ Star on GitHub
                    <span className="btn-arrow" aria-hidden="true">↗</span>
                  </a>
                  <a href={DOCS} target="_blank" rel="noreferrer" className="btn-ghost">
                    Read the docs
                  </a>
                </div>
              </FadeUp>
            </div>

            {/* Right: portal with Pix + Cano */}
            <div className="hero-right" aria-hidden="true">
              <div className="portal">
                <img
                  className="portal-bg"
                  src={`${B}/bg-boot-480x270.webp`}
                  alt=""
                />
                <div className="portal-vignette" />
                <div className="lp-sprite lp-sprite-pix portal-pix" />
                <div className="portal-ring" />
                <div className="portal-ring portal-ring-outer" />
              </div>
              {/* Glow blob behind portal */}
              <div className="portal-glow" />
            </div>
          </div>

          {/* Marquee belt */}
          <Marquee>
            BRIEF IN · FILES OUT · IN YOUR REPO · asset-icon · asset-illustration ·
            asset-sprite · asset-texture · asset-social · ONE INSTALL LINE ·&nbsp;
          </Marquee>
        </section>

        {/* ── WHAT IS ASSET-CANON ──────────────────────────── */}
        <section className="sect" aria-labelledby="s1">
          <img className="sect-bg" src={`${B}/bg-workshop-480x270.webp`} alt="" aria-hidden="true" />
          <div className="sect-overlay ol-right" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">01</div>
            <div className="sect-split">
              <div className="sect-visual">
                <FadeUp>
                  <div className="bezel">
                    <div className="bezel-in">
                      <div className="lp-sprite lp-sprite-shard-canon" />
                    </div>
                  </div>
                </FadeUp>
              </div>
              <div className="sect-text">
                <FadeUp delay={0.05}>
                  <span className="tag">01 — Canon</span>
                </FadeUp>
                <RevealWords
                  text={sections["shard-canon"].title}
                  className="sect-title"
                  as="h2"
                  delay={0.1}
                />
                {sections["shard-canon"].body.split("\n\n").map((p, i) => (
                  <FadeUp key={i} delay={0.15 + i * 0.08}>
                    <p className="sect-body">{p}</p>
                  </FadeUp>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PIPELINE ─────────────────────────────────────── */}
        <section className="sect sect-dark pipe-sect" aria-labelledby="s2">
          <img className="sect-bg" src={`${B}/bg-hallway-480x270.webp`} alt="" aria-hidden="true" />
          <div className="sect-overlay ol-center" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">02</div>

            {/* Asymmetric editorial header */}
            <div className="pipe-head">
              <div className="pipe-head-l">
                <FadeUp><span className="tag">02 — Pipeline</span></FadeUp>
                <RevealWords
                  text="ONE PATH. EVERY TIME."
                  className="pipe-headline"
                  as="h2"
                  delay={0.1}
                />
              </div>
              <FadeUp delay={0.25} className="pipe-head-r">
                <p className="pipe-desc">
                  Describe it once. The orchestrator plans, the model generates,
                  and deterministic files land straight in your repo.
                </p>
                <div className="pipe-mini-flow" aria-label="Pipeline flow">
                  {STEPS.map((s, i) => (
                    <Fragment key={s}>
                      <code className="pmf-step">{s}</code>
                      {i < STEPS.length - 1 && <span className="pmf-arrow" aria-hidden="true">→</span>}
                    </Fragment>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* Six step cards */}
            <Stagger className="pipe-cards">
              {PIPELINE.map((step, i) => (
                <StaggerItem key={step.id} className="pipe-card">
                  <div
                    className="pci"
                    style={{ "--accent": step.accent } as React.CSSProperties}
                  >
                    {/* Accent stripe */}
                    <div className="pci-stripe" aria-hidden="true" />

                    {/* Top: step num + icon */}
                    <div className="pci-top">
                      <span className="pci-stepnum">{step.num}</span>
                      <span className="pci-icon" aria-hidden="true">{step.icon}</span>
                    </div>

                    {/* Bottom: name + desc */}
                    <div className="pci-bot">
                      <h3 className="pci-name">{step.name}</h3>
                      <p className="pci-desc">{step.desc}</p>
                    </div>

                    {/* Ghost number */}
                    <span className="pci-ghost" aria-hidden="true">{step.num}</span>
                  </div>

                  {/* Connector between cards */}
                  {i < PIPELINE.length - 1 && (
                    <div className="pipe-conn" aria-hidden="true">
                      <span className="pipe-conn-line" />
                      <span className="pipe-conn-arrow">›</span>
                    </div>
                  )}
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── STYLE PROFILE FIRST ──────────────────────────── */}
        <section className="sect sect-dark" aria-labelledby="s3">
          <div className="sect-overlay ol-left" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">03</div>

            <div className="profile-layout">
              <div className="profile-copy">
                <FadeUp>
                  <span className="tag">03 — Style Profile First</span>
                </FadeUp>
                <RevealWords
                  text="CONSISTENCY STARTS IN YAML."
                  className="sect-title"
                  as="h2"
                  delay={0.08}
                />
                <FadeUp delay={0.18}>
                  <p className="sect-body">
                    The skill writes <code>docs/style-profile.yaml</code> before generating the batch.
                    Every later image reads that file, so characters, tools, props, icons,
                    and scenes keep the same palette, shape language, line weight, and negative prompts.
                  </p>
                </FadeUp>
                <FadeUp delay={0.26}>
                  <div className="profile-mini-flow" aria-label="Style profile flow">
                    <code>BRIEF</code>
                    <span>→</span>
                    <code>style-profile.yaml</code>
                    <span>→</span>
                    <code>4 GENERATIONS</code>
                    <span>→</span>
                    <code>ONE WORLD</code>
                  </div>
                </FadeUp>
              </div>

              <FadeUp delay={0.14} className="profile-code">
                <div className="code-head">
                  <span>docs/style-profile.yaml</span>
                  <span>created first</span>
                </div>
                <pre>{`id: storybook-adventure
style: disney-inspired family animation
palette: [ink, cream, sky, cherry, gold]
line: rounded clean outline
shading: soft cel, no photorealism
shape_language: warm, expressive, toy-like
negative:
  - random style drift
  - harsh realism
  - mismatched costumes
  - off-palette colors`}</pre>
              </FadeUp>
            </div>

            <Stagger className="profile-runs">
              {STYLE_RUNS.map((run) => (
                <StaggerItem key={run.step} className="profile-run">
                  <span className="run-step">{run.step}</span>
                  <h3>{run.title}</h3>
                  <p>{run.body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── SAME PROMPT COMPARISON ──────────────────────── */}
        <section id="comparison" className="sect compare-sect" aria-labelledby="s4">
          <img className="sect-bg" src={`${B}/bg-archive-480x270.webp`} alt="" aria-hidden="true" />
          <div className="sect-overlay ol-center" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">04</div>

            <div className="compare-head">
              <FadeUp>
                <span className="tag">04 — Same Prompt</span>
              </FadeUp>
              <RevealWords
                text="SKILL ON. SKILL OFF."
                className="sect-title"
                as="h2"
                delay={0.08}
              />
              <FadeUp delay={0.18}>
                <p className="sect-sub">
                  Same base prompt: a tiny magical workshop where a coding agent turns
                  a short asset brief into polished web game art.
                </p>
              </FadeUp>
            </div>

            <div className="compare-grid">
              <FadeUp delay={0.1} className="compare-panel">
                <div className="compare-meta">
                  <span className="compare-kicker">Without skill</span>
                  <span className="compare-note">Raw prompt</span>
                </div>
                <img
                  className="compare-img"
                  src={`${C}/comparison-without-skill-960x540.webp`}
                  alt="Raw prompt generation with crowded labels and mixed visual style"
                  width={960}
                  height={540}
                />
                <div className="prompt-strip">
                  <span className="prompt-label">Prompt used</span>
                  <p>{BASE_PROMPT}</p>
                </div>
              </FadeUp>

              <FadeUp delay={0.18} className="compare-panel compare-panel-good">
                <div className="compare-meta">
                  <span className="compare-kicker">With asset-canon</span>
                  <span className="compare-note">style-profile.yaml auto loaded</span>
                </div>
                <img
                  className="compare-img"
                  src={`${C}/comparison-with-skill-960x540.webp`}
                  alt="Skill-directed generation matching the landing page pixel-art style"
                  width={960}
                  height={540}
                />
                <div className="prompt-strip prompt-strip-good">
                  <span className="prompt-label">Prompt used</span>
                  <p>{SKILL_PROMPT}</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── FIVE SKILLS ──────────────────────────────────── */}
        <section className="sect" aria-labelledby="s5">
          <img className="sect-bg" src={`${B}/bg-gallery-480x270.webp`} alt="" aria-hidden="true" />
          <div className="sect-overlay ol-center" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">05</div>

            <div className="skills-head">
              <FadeUp>
                <span className="tag">05 — Skills</span>
              </FadeUp>
              <RevealWords
                text={sections["shard-keyring"].title}
                className="sect-title"
                as="h2"
                delay={0.08}
              />
              <FadeUp delay={0.2}>
                <p className="sect-sub">One orchestrator routes your brief to the right specialist.</p>
              </FadeUp>
            </div>

            <Stagger className="bento">
              {SKILLS.map(({ sprite, name, desc, rotate }, i) => (
                <StaggerItem key={name} className={`bento-card bc-${i}`} rotate={rotate}>
                  <div className="bento-inner">
                    <div className="bento-sprite-wrap" aria-hidden="true">
                      <div className={`lp-sprite ${sprite}`} />
                    </div>
                    <code className="bento-name">{name}</code>
                    <p className="bento-desc">{desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── RELIABILITY ──────────────────────────────────── */}
        <section className="sect sect-dark" aria-labelledby="s6">
          <img className="sect-bg" src={`${B}/bg-forge-480x270.webp`} alt="" aria-hidden="true" />
          <div className="sect-overlay ol-left" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">06</div>

            <div className="rel-head">
              <FadeUp>
                <span className="tag">06 — Reliability</span>
              </FadeUp>
              <RevealWords
                text={sections["shard-rune"].title}
                className="sect-title"
                as="h2"
                delay={0.08}
              />
            </div>

            <Stagger className="rel-pillars">
              {[
                { label: "Descriptors", body: "Every asset ships a .yaml sidecar so another agent can use it without opening the image." },
                { label: "Style Profiles", body: "Shared validation keeps a family consistent across all generated assets in a batch." },
                { label: "Deterministic", body: "Fixed sizes, one palette per batch, predictable names. Reproducible and diff-able." },
              ].map(({ label, body }, i) => (
                <StaggerItem key={label} className="rel-pillar">
                  <span className="pillar-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="pillar-title">{label}</h3>
                  <p className="pillar-body">{body}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────── */}
        <section className="cta-sect" aria-labelledby="s5">
          <img className="sect-bg cta-bg-img" src={`${B}/bg-cta-480x270.webp`} alt="" aria-hidden="true" />
          <div className="cta-veil" aria-hidden="true" />

          {/* Artifact behind everything */}
          <div className="cta-artifact" aria-hidden="true">
            <div className="lp-sprite lp-sprite-artifact" />
          </div>

          <div className="cta-inner">
            <FadeUp delay={0.05}>
              <span className="tag tag-gold">GET STARTED</span>
            </FadeUp>
            <RevealWords
              text="NOW GO BUILD SOMETHING."
              className="cta-headline"
              as="h2"
              delay={0.1}
            />
            <FadeUp delay={0.35}>
              <div className="cta-terminal">
                <span className="terminal-prompt">$</span>
                <code className="terminal-cmd">{INSTALL}</code>
              </div>
            </FadeUp>
            <FadeUp delay={0.48}>
              <p className="cta-note">
                Node 18+ · Codex CLI or <code>OPENAI_API_KEY</code> ·{" "}
                <code>sharp</code> optional
              </p>
            </FadeUp>
            <FadeUp delay={0.58}>
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

        {/* ── FOOTER ───────────────────────────────────────── */}
        <footer className="foot">
          <div className="foot-inner">
            <img
              className="foot-logo"
              src={`${S}/logo-assets-canon-240x72.webp`}
              alt="assets-canon"
              width={100} height={30}
            />
            <p className="foot-text">asset-canon — turn a brief into shippable art.</p>
            <div className="foot-links">
              <a href={REPO} target="_blank" rel="noreferrer" className="foot-link">GitHub</a>
              <a href={DOCS} target="_blank" rel="noreferrer" className="foot-link">Docs</a>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}
