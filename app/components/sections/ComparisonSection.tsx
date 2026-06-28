import { RevealWords, FadeUp } from "../effects"
import { B, C } from "../site"

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

export function ComparisonSection() {
  return (
    <section id="comparison" className="sect compare-sect" aria-labelledby="s4">
      <img className="sect-bg" src={`${B}/bg-archive-480x270.webp`} alt="" aria-hidden="true" />
      <div className="sect-overlay ol-center" aria-hidden="true" />

      <div className="sect-inner">
        <div className="sect-num" aria-hidden="true">05</div>

        {/* Header */}
        <div className="cmp-head">
          <FadeUp>
            <span className="tag">05 — Same Prompt</span>
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
  )
}
