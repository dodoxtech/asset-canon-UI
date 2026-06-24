# 0005. Generate tilesets & seamless textures

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Produce the walkable/foreground tile layer and the seamless surface fills.

## Context
Covers batch **E** of [asset-manifest.md](../../landing-page/asset-manifest.md).
Tilemap approach is in
[interaction-and-motion.md](../../landing-page/interaction-and-motion.md#recommended-tech-stack).
Depends on task 0001 (`tiles-base` was anchored there).

## Scope
- In: E1 `tiles-base`, E2–E7 per-room prop tilesets (workshop/hallway/gallery/
  archive/forge/cta), E8 `tex-floor-wood`, E9 `tex-floor-stone`,
  E10 `tex-wall-plaster`, E11 `tex-dither-glow`. (11 deliverables.)
- Out: animated props (task 0006); backdrops (task 0004).

## Steps
1. Generate `tiles-base` structural kit (floor/wall/edges/corners) if not finalized in 0001.
2. Generate each room's prop tiles, packed one sheet per room.
3. Generate seamless textures; 2×2 seam-check each (no visible tiling seam).
4. Run `asset-optimize` to atlas the tilesheets; write `<slug>.yaml` descriptors.

## Acceptance criteria
- [ ] All 11 deliverables generated at manifest sizes, on-palette, integer-pixel.
- [ ] Every `asset-texture` tiles seamlessly under a 2×2 repeat test.
- [ ] Tile edges align to the 16×16 grid and connect cleanly across tiles.
- [ ] Each ships an atlas (tilesets) + `<slug>.yaml` descriptor.
