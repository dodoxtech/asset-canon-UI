# 0004. Generate room backdrops

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Produce the painted far-wall backdrop for every room plus the boot screen.

## Context
Covers batch **D** of [asset-manifest.md](../../landing-page/asset-manifest.md).
Rooms and their content come from [concept.md](../../landing-page/concept.md) and
[sections.md](../../landing-page/sections.md). Depends on task 0001.

## Scope
- In: D1 `bg-boot`, D2 `bg-workshop`, D3 `bg-hallway`, D4 `bg-gallery`,
  D5 `bg-archive`, D6 `bg-forge`, D7 `bg-cta`. (7 backdrops, 480×270, opaque.)
- Out: floor/wall/prop tiles (task 0005); dim "before" states (CSS tint + props).

## Steps
1. Generate each backdrop in its **lit** state at 480×270.
2. Keep a consistent horizon/floor line across D2–D6 for a continuous side-scroll.
3. `bg-forge` authored ignited; `bg-cta` brightest/triumphant; `bg-boot` most atmospheric.
4. Write `<slug>.yaml` descriptors into [../../assets/](../../assets/).

## Acceptance criteria
- [ ] All 7 backdrops generated at 480×270, on-palette, integer-pixel, dithered (no smooth gradients).
- [ ] Floor line is continuous across Workshop→Forge so the camera reads as one studio.
- [ ] Each ships a `<slug>.yaml` descriptor.
