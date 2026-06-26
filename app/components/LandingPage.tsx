import { Fragment } from "react"
import { sections } from "../data/sections"
import { Cursor, RevealWords, FadeUp, Stagger, StaggerItem, Marquee, SpriteDirectionDemo } from "./effects"

const REPO    = "https://github.com/dodoxtech/asset-canon"
const DOCS    = "https://github.com/dodoxtech/asset-canon#readme"
const INSTALL = "npx skills add github:dodoxtech/asset-canon"

const B = "/assets/generated/backdrops"
const S = "/assets/generated/sprites"
const C = "/assets/generated/comparisons"
const D = "/assets/generated/sprites"

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

// The identical base prompt used for BOTH comparison images
const SHARED_PROMPT =
  "A small friendly coding-agent character at a wooden workbench, a glowing asset shard, " +
  "neat shelves of sprites and icons. Wide 16:9. No text, no labels, no UI chrome."

// Compact excerpt from docs/style-profile.yaml shown as the "added" diff
const PROFILE_YAML = `id: canon-quest
prompt_suffix: >
  16-bit GBA-era pixel art, 16×16 tile
  grid, 1px selective ink (#0B0E1A),
  flat cel shading, ordered dithering
  — never smooth gradients
palette:
  "#0B0E1A" "#141A30" "#1E2A44"
  "#00B140" "#3CE07A" "#FFC83C"
  "#3CA0FF" "#FF5C5C" +7 more
negative:
  - smooth gradients, anti-aliasing
  - photorealistic rendering
  - off-palette colors`

const STYLE_RUNS = [
  {
    step: "01",
    title: "Hero character",
    body: "Brave kid inventor, warm family-animation proportions, round expressive face, same costume language.",
    img: "/assets/generated/illustrations/style-run-hero-character-512x768.webp",
    alt: "Generated hero character: brave kid inventor in a warm storybook animation style",
    pass: "generation pass 01",
  },
  {
    step: "02",
    title: "Sidekick character",
    body: "Tiny clockwork helper, same eye shape, same palette, same soft storybook silhouette rules.",
    img: "/assets/generated/illustrations/style-run-sidekick-character-512x768.webp",
    alt: "Generated sidekick character: tiny clockwork helper with matching palette and eye shape",
    pass: "generation pass 02",
  },
  {
    step: "03",
    title: "Magic tool",
    body: "Oversized glowing paintbrush-wrench, same highlight colors, same outline weight, same material rules.",
    img: "/assets/generated/illustrations/style-run-magic-tool-720x720.webp",
    alt: "Generated magic tool: oversized paintbrush-wrench with gold and blue highlights",
    pass: "generation pass 03",
  },
  {
    step: "04",
    title: "Prop set",
    body: "Backpack, compass, star badge, and potion bottle generated later but still reading as one world.",
    img: "/assets/generated/illustrations/style-run-prop-set-960x640.webp",
    alt: "Generated prop set: backpack, compass, star badge, and potion bottle in one shared style",
    pass: "generation pass 04",
  },
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
        <section className="hero hero-luxury" aria-label="Hero">
          <div className="luxury-paper" aria-hidden="true" />

          <div className="hero-inner">

            {/* Left: editorial headline + commands */}
            <div className="hero-left">
              <FadeUp delay={0.05}>
                <div className="eyebrow-row">
                  <span className="live-dot" aria-hidden="true" />
                  <span className="eyebrow-label">consistent image generation workflow</span>
                </div>
              </FadeUp>

              <h1 className="headline">
                <span className="headline-row">
                  <RevealWords text="Generate" delay={0.15} />
                </span>
                <span className="headline-row headline-dim">
                  <RevealWords text="images in" delay={0.22} />
                </span>
                <span className="headline-row headline-accent">
                  <RevealWords text="one style." delay={0.29} />
                </span>
              </h1>

              <FadeUp delay={0.52}>
                <p className="hero-sub">
                  asset-canon gives your coding agent a repeatable workflow for
                  image generation: plan the brief, lock the style, generate the
                  set, optimize the files, and document every asset.
                </p>
              </FadeUp>

              <FadeUp delay={0.62}>
                <div className="terminal-card hero-terminal">
                  <span className="terminal-prompt">$</span>
                  <code className="terminal-cmd">{INSTALL}</code>
                </div>
              </FadeUp>

              <FadeUp delay={0.72}>
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

              <FadeUp delay={0.82}>
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
                    The skill writes <code>docs/style-profile.yaml</code> first, then makes each image
                    in a separate generation pass. Four prompts, four renders, one shared visual world.
                  </p>
                </FadeUp>
                <FadeUp delay={0.26}>
                  <div className="profile-mini-flow" aria-label="Style profile flow">
                    <code>BRIEF</code>
                    <span>→</span>
                    <code>style-profile.yaml</code>
                    <span>→</span>
                    <code>4 SEPARATE IMAGE GENERATIONS</code>
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
                  <div className="run-media">
                    <img src={run.img} alt={run.alt} width={960} height={960} loading="lazy" />
                    <span className="run-pass">{run.pass}</span>
                  </div>
                  <div className="run-topline">
                    <span className="run-step">{run.step}</span>
                    <span className="run-separate">separate render</span>
                  </div>
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

            {/* Header */}
            <div className="cmp-head">
              <FadeUp>
                <span className="tag">04 — Same Prompt</span>
              </FadeUp>
              <RevealWords
                text="SAME BRIEF. DIFFERENT OUTCOME."
                className="sect-title"
                as="h2"
                delay={0.08}
              />
              <FadeUp delay={0.2}>
                <p className="sect-sub">
                  The only difference between these two outputs is a 50-line YAML file.
                </p>
              </FadeUp>
            </div>

            {/* Shared prompt source card */}
            <FadeUp delay={0.25}>
              <div className="cmp-source">
                <div className="cmp-source-top">
                  <span className="cmp-source-dot" aria-hidden="true" />
                  <span className="cmp-source-label">SHARED PROMPT</span>
                  <span className="cmp-source-sublabel">sent to the model in both cases</span>
                </div>
                <p className="cmp-source-text">"{SHARED_PROMPT}"</p>
              </div>
            </FadeUp>

            {/* Two arrows pointing down to panels */}
            <div className="cmp-arrows" aria-hidden="true">
              <span className="cmp-arrow-down" />
              <span className="cmp-arrow-down" />
            </div>

            {/* Two comparison panels — image on top for immediate visual alignment */}
            <div className="cmp-panels">

              {/* LEFT — without skill */}
              <FadeUp delay={0.35} className="cmp-panel cmp-panel-bad">
                <div className="cmp-panel-header">
                  <span className="cmp-badge cmp-badge-bad">✕ Without skill</span>
                  <span className="cmp-panel-note">Raw model output</span>
                </div>

                {/* Image FIRST — immediate visual comparison */}
                <div className="cmp-img-wrap">
                  <img
                    className="cmp-img cmp-img-bad"
                    src={`${C}/comparison-without-skill-960x540.webp`}
                    alt="Raw prompt output, inconsistent style, no palette lock"
                    width={960} height={540}
                  />
                </div>

                {/* Only STYLE row — PROMPT already shown in shared source card above */}
                <div className="cmp-recipe">
                  <div className="cmp-row">
                    <span className="cmp-row-num">—</span>
                    <div className="cmp-row-content">
                      <span className="cmp-row-label">STYLE</span>
                      <span className="cmp-none-tag">none</span>
                    </div>
                  </div>
                </div>
              </FadeUp>

              {/* RIGHT — with skill */}
              <FadeUp delay={0.45} className="cmp-panel cmp-panel-good">
                <div className="cmp-panel-header">
                  <span className="cmp-badge cmp-badge-good">✓ With asset-canon</span>
                  <span className="cmp-panel-note">style-profile.yaml auto-loaded</span>
                </div>

                {/* Image FIRST */}
                <div className="cmp-img-wrap">
                  <img
                    className="cmp-img"
                    src={`${C}/comparison-with-skill-960x540.webp`}
                    alt="Skill output, GBA pixel art, locked palette, consistent style"
                    width={960} height={540}
                  />
                </div>

                {/* Only STYLE row with YAML diff */}
                <div className="cmp-recipe">
                  <div className="cmp-row">
                    <span className="cmp-row-num cmp-row-num-green">+</span>
                    <div className="cmp-row-content">
                      <span className="cmp-row-label cmp-row-label-green">STYLE</span>
                      <div className="cmp-yaml-wrap">
                        <div className="cmp-yaml-file">
                          <span className="cmp-yaml-icon" aria-hidden="true">▣</span>
                          <span>docs/style-profile.yaml</span>
                        </div>
                        <pre className="cmp-yaml">{PROFILE_YAML}</pre>
                      </div>
                    </div>
                  </div>
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

        {/* ── ASSET-SPRITE PLAYABLE DEMO ───────────────────── */}
        <section className="sect sect-dark sprite-demo-sect" aria-labelledby="s6">
          <img className="sect-bg" src={`${B}/bg-workshop-480x270.webp`} alt="" aria-hidden="true" />
          <div className="sect-overlay ol-center" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">06</div>

            <div className="sprite-demo-head">
              <div>
                <FadeUp>
                  <span className="tag">06 — asset-sprite demo</span>
                </FadeUp>
                <RevealWords
                  text="RAW PLATE TO PLAYABLE CHARACTER."
                  className="sect-title"
                  as="h2"
                  delay={0.08}
                />
              </div>
              <FadeUp delay={0.2}>
                <p className="sect-sub">
                  The same generated character is shown before keying, after background removal,
                  and as a final atlas-driven sprite you can control with WASD.
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
                      src={`${D}/demo-navigator-source-256x512.png`}
                      alt="Original generated character sprite sheet on chroma green background"
                      width={256}
                      height={512}
                      loading="lazy"
                    />
                  </div>
                  <p>Generated on a locked chroma plate so the background can be removed deterministically.</p>
                </FadeUp>

                <FadeUp delay={0.24} className="sprite-output-card">
                  <div className="sprite-card-top">
                    <span>02</span>
                    <strong>background removed</strong>
                  </div>
                  <div className="sprite-image-wrap sprite-image-alpha">
                    <img
                      src={`${D}/demo-navigator-alpha-sheet-256x512.webp`}
                      alt="Alpha-keyed character sprite sheet with transparent background"
                      width={256}
                      height={512}
                      loading="lazy"
                    />
                  </div>
                  <p>Green is keyed to alpha; no green pixels are reserved inside the character palette.</p>
                </FadeUp>
              </div>

              <FadeUp delay={0.32} className="sprite-live-card">
                <div className="sprite-live-top">
                  <span>03</span>
                  <strong>usable output</strong>
                  <code>64x64 · 32 frames · atlas.json</code>
                </div>
                <SpriteDirectionDemo />
                <div className="sprite-links" aria-label="Generated sprite files">
                  <a href={`${D}/demo-navigator-alpha-sheet-256x512.png`} target="_blank" rel="noreferrer">
                    PNG sheet
                  </a>
                  <a href={`${D}/demo-navigator-alpha-sheet-256x512.json`} target="_blank" rel="noreferrer">
                    atlas JSON
                  </a>
                  <span>docs/assets/demo-navigator.yaml</span>
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ── RELIABILITY ──────────────────────────────────── */}
        <section className="sect sect-dark" aria-labelledby="s7">
          <img className="sect-bg" src={`${B}/bg-forge-480x270.webp`} alt="" aria-hidden="true" />
          <div className="sect-overlay ol-left" aria-hidden="true" />

          <div className="sect-inner">
            <div className="sect-num" aria-hidden="true">07</div>

            <div className="rel-head">
              <FadeUp>
                <span className="tag">07 — Reliability</span>
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
