import { RevealWords, FadeUp, Stagger, StaggerItem } from "../effects"

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

export function StyleProfileSection() {
  return (
    <section id="style-profile" className="sect sect-dark" aria-labelledby="s3">
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
  )
}
