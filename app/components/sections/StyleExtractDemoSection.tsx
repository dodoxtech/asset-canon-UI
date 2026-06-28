import { RevealWords, FadeUp } from "../effects"

const SOURCE_PROMPT = `Generate an 8-frame front-running sprite for Homer Simpson from ref-starrynight-v1.
Use only the extracted style: post-impressionist impasto oil, cobalt and
ultramarine night blues, luminous golden highlights, swirling brushstrokes,
visible canvas texture, low-key nocturnal contrast.`

const ANALYSIS_RESULT = [
  ["medium", "post-impressionist oil / thick impasto"],
  ["palette", "deep cobalt + ultramarine field, golden-yellow accents"],
  ["texture", "visible swirling directional brushstrokes and canvas grain"],
  ["lighting", "warm point-source glow against cool nocturnal shadows"],
  ["guardrails", "no flat color, no vector edges, no plastic sheen"],
] as const

const STARRY_YAML = `id: ref-starrynight-v1
source_ref: docs/assets/refs/starry-night.jpg
medium: painterly
palette:
  - "#0B1320"
  - "#1D212E"
  - "#263961"
  - "#45648E"
  - "#6988A3"
  - "#94A399"
  - "#B2BDA3"
  - "#CCCE7B"
  - "#B4A640"
color:
  saturation: muted
  temperature: cool
  contrast: medium
  harmony: complementary
line: none
shading: soft-gradient
lighting: "luminous point-sources (stars/moon), low-key nocturnal"
fx: [bloom, grain]
prompt_suffix: >
  post-impressionist oil painting, thick impasto with visible swirling
  directional brushstrokes, deep cobalt and ultramarine blue-dominant palette
  with luminous golden-yellow accents, complementary blue/yellow harmony,
  warm glowing halos around light sources against cool shadows, expressive
  swirling motion, low-key nocturnal value range, heavy visible canvas texture
negative:
  - flat color
  - smooth gradients
  - hard vector edges
  - clean outlines
  - photographic realism
  - pillow shading
  - digital airbrush smoothness
  - AI plastic sheen`

export function StyleExtractDemoSection() {
  return (
    <section id="style-extract-demo" className="sect style-extract-sect" aria-labelledby="s3b">
      <div className="style-extract-sky" aria-hidden="true" />
      <div className="sect-overlay ol-center" aria-hidden="true" />

      <div className="sect-inner">
        <div className="sect-num" aria-hidden="true">04</div>

        <div className="style-extract-head">
          <div>
            <FadeUp>
              <span className="tag">04 - asset-style-extract demo</span>
            </FadeUp>
            <RevealWords
              text="REFERENCE STYLE BECOMES A SPRITE."
              className="sect-title"
              as="h2"
              delay={0.08}
            />
          </div>
          <FadeUp delay={0.18}>
            <p className="sect-sub">
              The reference is analyzed into a reusable YAML profile, then that profile
              drives a new sprite render in the same painterly world.
            </p>
          </FadeUp>
        </div>

        <div className="style-extract-board">
          <FadeUp delay={0.14} className="style-reference-panel">
            <div className="style-panel-top">
              <span>01</span>
              <strong>reference image</strong>
            </div>
            <div className="style-ref-frame">
              <img
                src="/assets/generated/refs/ref-starrynight-v1.jpg"
                alt="Reference image for ref-starrynight-v1 style extraction"
                width={960}
                height={760}
                loading="lazy"
              />
            </div>
            <div className="style-prompt-block">
              <span>source prompt</span>
              <pre>{SOURCE_PROMPT}</pre>
            </div>
          </FadeUp>

          <FadeUp delay={0.22} className="style-generated-panel">
            <div className="style-panel-top">
              <span>04</span>
            </div>
            <div className="style-output-stage">
              <img
                src="/assets/generated/sprites/homer-starrynight-sprite-1024x1024.png"
                alt="Impasto oil game sprite generated from the ref-starrynight-v1 style profile"
                width={1024}
                height={1024}
                loading="lazy"
              />
            </div>
          </FadeUp>

          <FadeUp delay={0.3} className="style-analysis-panel">
            <div className="style-panel-top">
              <span>02</span>
              <strong>analysis result</strong>
            </div>
            <div className="style-analysis-list">
              {ANALYSIS_RESULT.map(([label, value]) => (
                <div className="style-analysis-row" key={label}>
                  <span>{label}</span>
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={0.38} className="style-yaml-panel">
            <div className="style-panel-top">
              <span>03</span>
              <strong>ref-starrynight-v1.yaml</strong>
            </div>
            <pre>{STARRY_YAML}</pre>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
