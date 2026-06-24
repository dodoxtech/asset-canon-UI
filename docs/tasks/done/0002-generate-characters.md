# 0002. Generate character sprites — Pix & Cano

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Produce the hero and companion sprites so the page has a movable, expressive
character and guide.

## Context
Covers batches **A (Pix)** and **B (Cano)** of
[asset-manifest.md](../../landing-page/asset-manifest.md). Animation timing is in
[interaction-and-motion.md](../../landing-page/interaction-and-motion.md#idle--locomotion).
Depends on the locked style from task 0001.

## Scope
- In: A1 `pix-idle-tired`, A2 `pix-idle`, A3 `pix-walk`, A4 `pix-pickup`;
  B1 `cano-float`, B2 `cano-react`, B3 `cano-point`. (4 + 3 assets, 19 frames.)
- Out: collectibles, props, FX (other tasks).

## Steps
1. Generate Pix facing right on chroma/transparent plate; flip-left handled in code.
2. Generate Cano with its glow halo contained in the frame box.
3. Pack each multi-frame asset as a horizontal frame-grid spritesheet; run `asset-optimize` for atlas JSON.
4. Write `<slug>.yaml` descriptors into [../../assets/](../../assets/).

## Acceptance criteria
- [ ] All 7 assets generated at the manifest's sizes/frame counts, on-palette, integer-pixel.
- [ ] Pix walk frame 1 is the ground-contact frame (drives the dust puff).
- [ ] Each asset ships a packed spritesheet + atlas + `<slug>.yaml` descriptor.
- [ ] Sprites read cleanly at 1× against `bg-workshop`.
