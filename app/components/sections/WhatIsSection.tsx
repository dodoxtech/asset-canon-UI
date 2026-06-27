import { sections } from "../../data/sections"
import { RevealWords, FadeUp } from "../effects"
import { B } from "../site"

export function WhatIsSection() {
  return (
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
  )
}
