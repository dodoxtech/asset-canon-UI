# 0003. Generate collectibles — shards, key & coin

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Produce every pickup the player collects, as a visually consistent family.

## Context
Covers batch **C** of [asset-manifest.md](../../landing-page/asset-manifest.md).
The 5 shards + key map 1:1 to sections in
[sections.md](../../landing-page/sections.md). Depends on task 0001.

## Scope
- In: C1 `shard-canon`, C2 `shard-pipeline`, C3 `shard-keyring`, C4 `shard-rune`,
  C5 `shard-cog`, C6 `key-canon`, C7 `coin`, C8 `sticker-easteregg`,
  C9 `canon-artifact`. (9 assets, 32 frames.)
- Out: the assemble cutscene effect (`fx-assemble-glow`, task 0007).

## Steps
1. Generate C1–C6 as one `asset-variants` batch off a shared "floating gem" base so they read as a family.
2. Generate C7–C9 (coin reuse classic 4-frame spin; C9 clearly = all five fused).
3. All on chroma plate, keyed to alpha; pack 4-frame sparkle loops as spritesheets.
4. Write `<slug>.yaml` descriptors into [../../assets/](../../assets/).

## Acceptance criteria
- [ ] All 9 assets generated at manifest sizes/frame counts, on-palette, integer-pixel.
- [ ] C1–C6 read as one cohesive family (same facet style + outline weight).
- [ ] C9 `canon-artifact` is visibly the five shards combined.
- [ ] Each ships a packed spritesheet + atlas + `<slug>.yaml` descriptor.
