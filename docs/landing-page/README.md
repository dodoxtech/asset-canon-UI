# Landing Page

> The design knowledge base for the **asset-canon** marketing landing page.
> This folder answers **"what are we building, why, and to what spec?"** Read this
> README first, then jump to the file that matches your task. Implementation lives
> in [`../../app/`](../../app/); this folder is the source of truth for the design.

## The one-line pitch

A **playable GBA-style pixel landing page**. Visitors don't scroll a page — they
walk a small 2D character through a handful of rooms, **collecting hidden items**.
Each item they pick up *unlocks and reveals one section* about asset-canon. Collect
them all and the final door opens onto the call-to-action (install + GitHub).

The page is a tiny game whose only goal is to teach you what asset-canon does.

## Why this concept fits the product

asset-canon is a skill that **generates game-ready pixel art** (`asset-sprite`,
`asset-texture`, `asset-icon`, …). So the landing page is a live demo of its own
output: **every pixel on this page can be produced by asset-canon itself.** The
medium *is* the message — we dogfood the product to advertise it.

> Build note: the character, items, tiles, and UI are generated with the
> `asset-sprite` / `asset-icon` skills; backgrounds with `asset-illustration` /
> `asset-texture`; the share card with `asset-social`. ChatGPT is used only for
> early concept sketches. See [art-direction.md](art-direction.md#asset-production-plan).

## Map of this folder

| File | Read it when you want to… |
|---|---|
| [concept.md](concept.md) | Understand the game mechanic, the player journey, and the win state |
| [art-direction.md](art-direction.md) | Look up the color palette, fonts, and how every asset gets made |
| [sections.md](sections.md) | See each collectible item, the section it unlocks, and the exact copy |
| [asset-manifest.md](asset-manifest.md) | Get the full, counted list of every image asset to generate (sizes, frames, descriptions) |
| [interaction-and-motion.md](interaction-and-motion.md) | Build controls, animation, motion, and the tech stack |

## Core principles (the non-negotiables)

- **Pixel-perfect, always.** Integer scaling only, `image-rendering: pixelated`,
  no anti-aliased upscales. The whole page renders on a fixed virtual resolution
  (see [interaction-and-motion.md](interaction-and-motion.md#the-virtual-stage)).
- **One palette.** Every asset shares the single palette in
  [art-direction.md](art-direction.md#color-palette) — the same "one palette per
  batch" rule asset-canon enforces.
- **Play is optional, content is not.** Anyone who can't or won't play must still
  reach every section and the CTA. There is always a "Skip the quest / read it"
  fallback. See [concept.md](concept.md#accessibility--the-skip-path).
- **Motion serves meaning.** Animation rewards an action (a pickup, a reveal) — it
  never loops for decoration alone. Respect `prefers-reduced-motion`.

## Conventions

- Filenames: lowercase `kebab-case`, `.md`.
- Link, don't duplicate: palette/fonts/sizes are defined once in
  [art-direction.md](art-direction.md) — reference it, don't restate hex codes.
