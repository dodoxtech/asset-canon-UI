# 0006. Generate animated props & doors

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Produce the animated objects that carry the "room comes alive" level-up reward.

## Context
Covers batch **F** of [asset-manifest.md](../../landing-page/asset-manifest.md).
These deliver the level-up payoff in
[concept.md](../../landing-page/concept.md#the-hook-that-makes-it-meaningful-the-hero-levels-up).
The 5 gallery samples (F5) are the dogfooding reveal in
[sections.md](../../landing-page/sections.md). Depends on tasks 0001–0005.

## Scope
- In: F1 `prop-lamp`, F2 `prop-conveyor-belt`, F3 `prop-pipeline-nodes` (×6),
  F4 `prop-frame-empty`, F5 `prop-frame-lit` (×5 samples), F6 `prop-scroll-shelf`,
  F7 `prop-furnace`, F8 `prop-anvil-sparks`, F9 `door-locked`, F10 `door-lockbreak`,
  F11 `door-open`, F12 `prop-chest`. (12 deliverables, ~44 frames.)
- Out: cutscene flares (task 0007).

## Steps
1. Generate each prop with its off/on (or closed/open) states per the manifest.
2. F3: six pipeline nodes labeled BRIEF·PLAN·GENERATE·OPTIMIZE·WRITE·REPORT, unlit + lit.
3. F5: each framed sample is a real asset from another skill (icon/illustration/sprite/texture/social).
4. Pack frames as spritesheets; run `asset-optimize`; write `<slug>.yaml` descriptors.

## Acceptance criteria
- [ ] All 12 deliverables generated at manifest sizes/frame counts, on-palette, integer-pixel.
- [ ] Each transforming prop has a clear dark/off and lit/on state.
- [ ] F5's 5 samples are genuinely produced by the 5 specialist skills (the dogfood proof).
- [ ] Door lock-break (F10) and chest open (F12) read as clean 3-frame reveals.
- [ ] Each ships a packed spritesheet + atlas + `<slug>.yaml` descriptor.
