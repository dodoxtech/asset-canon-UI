import { sections } from "../../data/sections"
import { RevealWords, FadeUp, Stagger, StaggerItem } from "../effects"
import { B } from "../site"

const SKILLS = [
  { sprite: "lp-sprite-shard-canon",    name: "asset-icon",         desc: "Favicons & UI glyphs", rotate: -1.8 },
  { sprite: "lp-sprite-shard-pipeline", name: "asset-illustration", desc: "Heroes & spots",        rotate:  1.2 },
  { sprite: "lp-sprite-shard-keyring",  name: "asset-sprite",       desc: "Sprites, tiles & sheets", rotate: -0.8 },
  { sprite: "lp-sprite-shard-rune",     name: "asset-texture",      desc: "Seamless tiles",        rotate:  2.0 },
  { sprite: "lp-sprite-shard-cog",      name: "asset-social",       desc: "OG cards at exact sizes", rotate: -1.3 },
] as const

export function SkillsSection() {
  return (
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
  )
}
