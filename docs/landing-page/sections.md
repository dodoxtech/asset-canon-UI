# Sections & Copy

> The content spec: every collectible, the room it lives in, the section it unlocks,
> and the **exact copy** to ship. Mechanic and order are in
> [concept.md](concept.md); visuals in [art-direction.md](art-direction.md).
> Copy here is the draft of record — edit it here, then implement.

There are **7 beats**: a boot screen, 5 collectible sections, and the CTA. Each
section is delivered inside a GBA-style dialogue/menu window with typewriter text.

---

## 0 · Boot screen — "CANON QUEST"

**Trigger:** page load. **Collectible:** none (spawn point).

A cartridge powers on (see motion in
[interaction-and-motion.md](interaction-and-motion.md#boot-sequence)). Title card:

- **Title:** `CANON QUEST`
- **Subtitle / tagline:** *"Turn a brief into shippable art."*
- **Under-line:** *Codex-powered image-asset skills for Claude Code, Codex & Cursor.*
- **Prompt:** `▶ PRESS START` (or click / tap)
- First dialogue box on spawn:
  > *"Five Asset Shards are hidden in the studio. Collect them to assemble the
  > Canon — and see what it can build. Use ← → (or WASD) to move."*

---

## 1 · 🟢 Canon Shard — "What is asset-canon"

**Room:** Workshop. **Collectible:** the green Canon Shard.

- **Heading:** `WHAT IS ASSET-CANON?`
- **Body:**
  > asset-canon is a set of **AI image-generation skills** for your coding agent.
  > Describe what you need in a sentence — it plans, generates, optimizes, and
  > writes **production-ready image files** straight to your repo.
- **One-liner stat row (three pixel cards):**
  - `BRIEF IN` — a sentence is enough
  - `FILES OUT` — webp / png / ico, sized & packed
  - `IN YOUR REPO` — no dashboards, no copy-paste
- **Micro-CTA:** *"Pick up the Canon Shard to begin →"* (this is the tutorial pickup)

---

## 2 · 🗺️ Pipeline Scroll — "How it works"

**Room:** Hallway. **Collectible:** the Pipeline Scroll.

- **Heading:** `HOW IT WORKS`
- **Intro:** *"One deterministic path, every time:"*
- **The pipeline (render as 6 lit-up pixel nodes, left → right):**

  `BRIEF → PLAN → GENERATE → OPTIMIZE → WRITE → REPORT`

  | Step | What happens |
  |---|---|
  | **Brief** | You describe the asset in plain language |
  | **Plan** | The orchestrator picks the right specialist & locks the style |
  | **Generate** | The image model (Codex / OpenAI) renders the pixels |
  | **Optimize** | Resize ladders, format export, sprite packing, metadata strip |
  | **Write** | Files land on disk with deterministic names |
  | **Report** | You get a summary of exactly what shipped |

- **Pull-quote:** *"Pixels come from an image model — never hand-drawn by code.
  The pipeline just orchestrates and optimizes."*

---

## 3 · 🧰 Specialist Keyring — "The five skills"

**Room:** Gallery (a wall of framed sample assets). **Collectible:** the Keyring.

- **Heading:** `FIVE SPECIALIST SKILLS`
- **Intro:** *"One orchestrator routes your brief to the right specialist:"*
- **Five pixel "cabinet" cards** (each shows a sample asset made by that skill):

  | Skill | Makes | Sample shown |
  |---|---|---|
  | **asset-icon** | Favicons, app icons, UI glyph families | the page's own HUD icons |
  | **asset-illustration** | Heroes, spots, empty states | a room background |
  | **asset-sprite** | Game sprites, tiles, spritesheets + atlases | the hero character |
  | **asset-texture** | Seamless tileable backgrounds & patterns | the floor tiles |
  | **asset-social** | OG cards, thumbnails, banners at exact sizes | this page's share card |

- **Punchline:** *"Everything you're looking at on this page was made by these
  five skills."* (the dogfooding reveal)

---

## 4 · 🔖 Descriptor Rune — "Why it's reliable"

**Room:** Archive (shelves of glowing YAML scrolls). **Collectible:** the Rune.

- **Heading:** `BUILT TO BE RELIABLE`
- **Three reliability pillars (pixel runestones):**
  - **Descriptors** — *every asset ships a `<slug>.yaml` sidecar describing its
    content, style & placement, so another agent can use it without opening the
    image.*
  - **Style profiles** — *shared style validation + anti-slop guards keep a whole
    asset family consistent.*
  - **Deterministic** — *fixed canvas sizes, one palette per batch, predictable
    `<slug>-<variant>-<WxH>.<ext>` names. Reproducible and diff-able.*
- **Pull-quote:** *"Instruction-first: the skills are instructions your agent runs
  with its own tools. Optional scripts, never required."*

---

## 5 · ⚙️ Install Cog — "Get started"

**Room:** Forge. **Collectible:** the Install Cog.

- **Heading:** `GET STARTED IN ONE LINE`
- **Install tabs** (VT323 terminal window):
  - **npx:** `npx skills add github:dodoxtech/asset-canon`
  - **Claude Code plugin:**
    ```
    /plugin marketplace add dodoxtech/asset-canon
    /plugin install asset-canon
    ```
- **Requirements row (pixel checklist):**
  - ✅ Node.js ≥ 18
  - ✅ An image model — Codex CLI or `OPENAI_API_KEY`
  - ◻️ Optional: `sharp` for pixel-level resize/format ops (degrades gracefully)
- **Commands cheat-sheet:**
  `/asset-new` · `/asset-gen` · `/asset-variants` · `/asset-optimize`

---

## 6 · 🔑 Canon Key → CTA — "Ship it"

**Trigger:** appears after all 5 shards; opens the final door. **Collectible:** Key.

The assemble cutscene plays, the door opens, the chest bursts. CTA room:

- **Banner:** `QUEST COMPLETE — 100%`
- **Headline:** `NOW GO BUILD SOMETHING.`
- **Primary button (canon-green):** `★ Star on GitHub` → `github.com/dodoxtech/asset-canon`
- **Secondary button:** `Read the docs`
- **Tertiary:** `Copy install command`
- **Footer line:** *"asset-canon — turn a brief into shippable art."* + license / repo links.

---

## Copy principles

- **Show, don't claim.** Every benefit ("game-ready sprites") is proven by a real
  asset visible on the page made by that skill.
- **Short dialogue.** ≤ 38 chars/line, ≤ 3 lines per textbox; chain boxes with `▶`.
- **One verb per CTA.** Star / Read / Copy — never stacked.
- **Keep the exact commands verbatim** from the asset-canon README so they always work.
