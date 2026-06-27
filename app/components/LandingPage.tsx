import { Cursor } from "./effects"
import {
  Nav,
  Hero,
  WhatIsSection,
  PipelineSection,
  StyleProfileSection,
  ComparisonSection,
  SkillsSection,
  SpriteDemoSection,
  ReliabilitySection,
  CtaSection,
  Footer,
} from "./sections"

export default function LandingPage() {
  return (
    <>
      {/* Global effects */}
      <div className="grain" aria-hidden="true" />
      <div className="mesh-bg" aria-hidden="true" />
      <Cursor />

      <main className="lp-root">
        <Nav />
        <Hero />
        <WhatIsSection />
        <PipelineSection />
        <StyleProfileSection />
        <ComparisonSection />
        <SkillsSection />
        <SpriteDemoSection />
        <ReliabilitySection />
        <CtaSection />
        <Footer />
      </main>
    </>
  )
}
