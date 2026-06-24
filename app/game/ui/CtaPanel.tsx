"use client"

import { useState } from "react"

// The payoff panel that rises in the Vault when the quest completes. The chest
// "burst" of install commands + the three calls to action from sections.md.
// Buttons are real links (semantic, accessible); copy uses the clipboard with a
// short confirmation. Shown over the canvas once the scene reaches the CTA phase.

const REPO = "https://github.com/dodoxtech/asset-canon"
const DOCS = "https://github.com/dodoxtech/asset-canon#readme"
const INSTALL = "npx skills add github:dodoxtech/asset-canon"

export default function CtaPanel() {
  const [copied, setCopied] = useState(false)

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="cta-panel" role="dialog" aria-label="Quest complete">
      <p className="cta-banner">QUEST COMPLETE — 100%</p>
      <h2 className="cta-headline">NOW GO BUILD SOMETHING.</h2>
      <code className="cta-install">{INSTALL}</code>
      <div className="cta-buttons">
        <a className="cta-btn cta-btn-primary" href={REPO} target="_blank" rel="noreferrer">
          ★ Star on GitHub
        </a>
        <a className="cta-btn cta-btn-secondary" href={DOCS} target="_blank" rel="noreferrer">
          Read the docs
        </a>
        <button type="button" className="cta-btn cta-btn-secondary" onClick={copyInstall}>
          {copied ? "Copied!" : "Copy install command"}
        </button>
      </div>
      <p className="cta-footer">
        asset-canon — turn a brief into shippable art. You fixed the studio. Now go break in a new one.
      </p>
    </div>
  )
}
