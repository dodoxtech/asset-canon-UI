# 0008. Build the playable engine MVP (grey-box) — epic

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Updated:** 2026-06-24

## Goal
Stand up a playable core loop with placeholder art: move a character, collect an
item, show a dialogue window, count it on the HUD. Runs fullscreen and responsive
on desktop and phone.

## Context
Steps 1–2 of the build order in
[interaction-and-motion.md](../../landing-page/interaction-and-motion.md#build-order-suggested).
The loop is defined in [concept.md](../../landing-page/concept.md#the-loop-what-happens-on-every-pickup).
No art dependency — uses colored boxes. Real assets are wired in task 0009.

**Where the image descriptions live:** every generated asset has a machine-readable
descriptor at `docs/assets/<slug>.yaml` (subject, style, palette, placement, and the
exact files on disk). Read those — and [docs/assets/README.md](../../assets/README.md)
— not the image binaries, whenever you need to know what an asset is or where it
lives. 0008 itself stays grey-box; the descriptors matter to 0008a (manifest) and 0009.

## Why this was split
The original single task bundled an asset move, the engine scaffold, scaling,
input, pickup, and dialogue — too large for one session and easy to leave
half-done. It is now an epic tracked by the sub-tasks below. Each sub-task is
sized to land, build, and commit in one sitting.

## Sub-tasks (do in order)
1. [0008a — Move assets to `/public/assets` + typed manifest](0008a-move-assets-to-public.md)
2. [0008b — Scaffold `<GameStage/>` + fixed-timestep loop](0008b-scaffold-gamestage-and-loop.md)
3. [0008c — Virtual-stage scaling + responsive desktop/phone](0008c-stage-scaling-and-responsive.md)
4. [0008d — Movable grey-box character: input + camera](0008d-character-input-and-camera.md)
5. [0008e — Collision + pickup + HUD shard counter](0008e-pickup-collision-and-hud.md)
6. [0008f — Dialogue window (open/typewriter/close)](0008f-dialogue-window.md)

## Out of scope (later tasks)
Real assets, all 5 sections, cutscene/CTA (0009); accessibility fallback +
perf/launch (0010).

## Done when
All six sub-tasks are in `done/` and the acceptance criteria below hold end-to-end.

## Epic acceptance criteria
- [ ] Stage scales by integer factor only, centered with letterbox, recomputes on resize.
- [ ] Fills the viewport and is fully playable on desktop and phone (portrait + landscape).
- [ ] Character moves via arrows/WASD, click-to-walk, and touch.
- [ ] Walking into the collectible increments `◆ 1/5` and opens the dialogue window.
- [ ] Runs at 60 fps with a fixed-timestep loop; pauses when the tab is hidden.
