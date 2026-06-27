import { sections } from "../../data/sections"
import { RevealWords, FadeUp, Stagger, StaggerItem } from "../effects"
import { B } from "../site"

const PILLARS = [
  { label: "Descriptors", body: "Every asset ships a .yaml sidecar so another agent can use it without opening the image." },
  { label: "Style Profiles", body: "Shared validation keeps a family consistent across all generated assets in a batch." },
  { label: "Deterministic", body: "Fixed sizes, one palette per batch, predictable names. Reproducible and diff-able." },
] as const

export function ReliabilitySection() {
  return (
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
          {PILLARS.map(({ label, body }, i) => (
            <StaggerItem key={label} className="rel-pillar">
              <span className="pillar-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="pillar-title">{label}</h3>
              <p className="pillar-body">{body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
