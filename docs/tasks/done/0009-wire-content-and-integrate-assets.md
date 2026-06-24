# 0009. Wire all sections, cutscene/CTA & integrate real assets

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Completed:** 2026-06-24

## Goal
Turn the MVP into the full experience: all 5 rooms, the assemble cutscene, the CTA
payoff, and real art/audio in place of grey boxes.

## Context
Steps 3–5 of the build order in
[interaction-and-motion.md](../../landing-page/interaction-and-motion.md#build-order-suggested).
Copy is in [sections.md](../../landing-page/sections.md); flow + level-up reward in
[concept.md](../../landing-page/concept.md). Depends on task 0008 and on assets
from tasks 0002–0007 (integrate per batch as each lands).

## Scope
- In: all 5 rooms + collectibles; the 5 section panels wired from `data/sections.ts`;
  Cano companion reactions/nudges; per-room "lights-up" reward; assemble cutscene +
  Key + door; CTA room; minimap fast-travel; SFX via Howler; motion choreography.
- Out: accessibility fallback parity + perf/launch (task 0010).

## Steps
1. Build the 5 rooms on one horizontal map; place each shard.
2. Load packed spritesheets/atlases; replace grey boxes with real assets.
3. Wire each pickup → section panel + room lights-up + Cano reaction.
4. Implement the assemble cutscene (5th shard) → Key → door open → CTA room/chest.
5. Add audio (SFX sprite + mute), parallax, screen shake, pickup arcs, CRT overlay.

## Acceptance criteria
- [x] All 6 collectibles work; each reveals the correct section from sections.md.
- [x] Each pickup fires its room transformation + a Cano line.
- [x] Assemble cutscene → Key → door → CTA plays; CTA buttons link correctly.
- [x] Minimap fast-travel jumps to any visited room.
- [x] Real assets render pixel-perfect; loop holds 60 fps.

## Implementation notes
- World is one horizontal map of 6 rooms (`data/rooms.ts`); `WorldScene` owns the
  player, Cano, collectibles, per-room lights-up rewards, FX, cutscene + CTA.
- Assets stream through `engine/Assets.ts` (atlas JSON → sibling PNG) and draw via
  `engine/Sprite.ts` (anchor-aware `drawFrame` + `Anim` frame clock).
- Five Shards reveal sections (`data/sections.ts`, copy from sections.md); the
  Key is the cutscene payoff. Sections keyed by collectible id so order is free.
- Motion: pickup sparkle + arc-to-HUD, screen shake, parallax dust motes, CRT
  scanlines/vignette, assemble cutscene. All disabled under reduced-motion.
- **Deviation:** the asset pipeline produced no audio files and Howler isn't a
  dependency, so SFX (coin/chime/clunk/shatter/fanfare) are synthesized in
  `engine/Audio.ts` (WebAudio) with a mute toggle — same UX, zero download.
- Out of scope (task 0010): the semantic HTML fallback/"skip to read" page. The
  HUD Skip button currently fast-forwards to the CTA payoff.
