import { Fragment } from "react"
import { RevealWords, FadeUp, Stagger, StaggerItem } from "../effects"
import { B } from "../site"

const STEPS = ["BRIEF", "PLAN", "GENERATE", "OPTIMIZE", "WRITE", "REPORT"] as const

const PIPELINE = [
  { id: "brief",    num: "01", icon: "○", name: "BRIEF",    desc: "Your words become the spec.",      accent: "#e8ecf8" },
  { id: "plan",     num: "02", icon: "◈", name: "PLAN",     desc: "Style locked. Targets mapped.",    accent: "#3ca0ff" },
  { id: "generate", num: "03", icon: "⬡", name: "GENERATE", desc: "Model renders every pixel.",       accent: "#3ce07a" },
  { id: "optimize", num: "04", icon: "◇", name: "OPTIMIZE", desc: "sharp compresses, no quality loss.", accent: "#ffc83c" },
  { id: "write",    num: "05", icon: "▣", name: "WRITE",    desc: "Deterministic files land on disk.", accent: "#3ce07a" },
  { id: "report",   num: "06", icon: "◉", name: "REPORT",   desc: "What shipped, where, why. Done.",  accent: "#ff2cc0" },
] as const

export function PipelineSection() {
  return (
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
  )
}
