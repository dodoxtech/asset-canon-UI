import { sections } from "../../data/sections"
import { RevealWords, FadeUp, Stagger, StaggerItem } from "../effects"
import { B } from "../site"

const SKILLS = [
  { name: "asset-icon",          desc: "Favicons & UI glyphs" },
  { name: "asset-illustration",  desc: "Heroes & spot art" },
  { name: "asset-sprite",        desc: "Sprites, tiles & sheets" },
  { name: "asset-texture",       desc: "Seamless tiling textures" },
  { name: "asset-social",        desc: "OG cards at exact sizes" },
  { name: "asset-style-extract", desc: "Reference image → reusable style profile" },
] as const

export function SkillsSection() {
  return (
    <section className="sect" aria-labelledby="s5">
      <img className="sect-bg" src={`${B}/bg-gallery-480x270.webp`} alt="" aria-hidden="true" />
      <div className="sect-overlay ol-center" aria-hidden="true" />

      <div className="sect-inner">
        <div className="sect-num" aria-hidden="true">06</div>

        <div className="skills-head">
          <FadeUp>
            <span className="tag">06 — Skills</span>
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
          {SKILLS.map(({ name, desc }, i) => (
            <StaggerItem key={name} className="bento-card">
              <div className="bento-inner">
                <div className="bento-top">
                  <span className="bento-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="bento-dot" aria-hidden="true" />
                </div>
                <code className="bento-name">{name}</code>
                <p className="bento-desc">{desc}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
