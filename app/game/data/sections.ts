// Section copy shown in the dialogue window on each pickup, keyed by the
// collectible id (the player roams freely, so we map by *what* was found, not by
// pickup order). Copy is the implemented form of docs/landing-page/sections.md;
// `cano` is the in-character one-liner the companion drops just before the panel.

export interface Section {
  id: string
  title: string
  body: string
  /** Cano's reaction line, shown as a speech bubble before the panel opens. */
  cano: string
}

export const sections: Record<string, Section> = {
  "shard-canon": {
    id: "shard-canon",
    title: "WHAT IS ASSET-CANON?",
    body:
      "asset-canon is a set of AI image-generation skills for your coding " +
      "agent. Describe what you need in a sentence — it plans, generates, " +
      "optimizes, and writes production-ready image files straight to your " +
      "repo.\n\nBRIEF IN · FILES OUT (webp/png/ico) · IN YOUR REPO.",
    cano: "The lights! Now we're cooking.",
  },
  "shard-pipeline": {
    id: "shard-pipeline",
    title: "HOW IT WORKS",
    body:
      "One deterministic path, every time:\n\n" +
      "BRIEF → PLAN → GENERATE → OPTIMIZE → WRITE → REPORT\n\n" +
      "You describe it, the orchestrator locks the style, the image model " +
      "renders the pixels, and optimized files land on disk with " +
      "deterministic names — plus a report of exactly what shipped.",
    cano: "Watch the line light up — that's the whole pipeline.",
  },
  "shard-keyring": {
    id: "shard-keyring",
    title: "FIVE SPECIALIST SKILLS",
    body:
      "One orchestrator routes your brief to the right specialist:\n\n" +
      "asset-icon · favicons & UI glyphs\n" +
      "asset-illustration · heroes & spots\n" +
      "asset-sprite · sprites, tiles, sheets\n" +
      "asset-texture · seamless tiles\n" +
      "asset-social · OG cards at exact sizes\n\n" +
      "Everything on this page was made by these five skills.",
    cano: "Five frames, five skills — and yes, this whole page is the demo.",
  },
  "shard-rune": {
    id: "shard-rune",
    title: "BUILT TO BE RELIABLE",
    body:
      "Descriptors — every asset ships a <slug>.yaml sidecar so another agent " +
      "can use it without opening the image.\n\n" +
      "Style profiles — shared validation keeps a family consistent.\n\n" +
      "Deterministic — fixed sizes, one palette per batch, predictable names. " +
      "Reproducible and diff-able.",
    cano: "Order from chaos. Feels good, doesn't it?",
  },
  "shard-cog": {
    id: "shard-cog",
    title: "GET STARTED IN ONE LINE",
    body:
      "npx skills add github:dodoxtech/asset-canon\n\n" +
      "Or as a Claude Code plugin:\n" +
      "/plugin marketplace add dodoxtech/asset-canon\n" +
      "/plugin install asset-canon\n\n" +
      "Needs Node 18+ and an image model (Codex CLI or OPENAI_API_KEY). " +
      "sharp is optional and degrades gracefully.",
    cano: "Forge's lit. The studio's yours again — go ship something.",
  },
}

/** The boot/spawn intro shown once when play begins. */
export const spawnIntro: Section = {
  id: "spawn",
  title: "CANON QUEST",
  body:
    "Five Asset Shards are hidden in the studio. Collect them to assemble the " +
    "Canon — and see what it can build.\n\nUse ← → ↑ ↓ (or WASD), or tap to " +
    "walk. Walk into a Shard to grab it.",
  cano: "The studio's gone dark — find the five Shards and fix it. Ready, maker?",
}

export function sectionForId(id: string): Section | null {
  return sections[id] ?? null
}
