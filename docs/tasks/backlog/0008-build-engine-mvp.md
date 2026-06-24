# 0008. Build the playable engine MVP (grey-box)

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Stand up a playable core loop with placeholder art: move a character, collect an
item, show a dialogue window, count it on the HUD.

## Context
Steps 1–2 of the build order in
[interaction-and-motion.md](../../landing-page/interaction-and-motion.md#build-order-suggested).
The loop is defined in [concept.md](../../landing-page/concept.md#the-loop-what-happens-on-every-pickup).
Tech stack recommendations in the same doc. No art dependency — uses colored boxes.

## Scope
- In: virtual-stage scaling (480×270, integer factor, letterbox); input (keyboard/
  click/touch); camera with dead-zone; one room; collision-based pickup; HUD shard
  counter; one dialogue window with typewriter text.
- Out: real assets, all 5 sections, cutscene/CTA, accessibility polish (later tasks).

## Steps
1. Scaffold `<GameStage />` (client) + the engine/scenes/entities/ui structure.
2. Implement stage scaling + a movable grey-box character on one room.
3. Add collision + a pickup that increments the HUD counter.
4. Wire one dialogue window (open/typewriter/close) from typed section data.

## Acceptance criteria
- [ ] Stage scales by integer factor only, centered with letterbox, recomputes on resize.
- [ ] Character moves via arrows/WASD, click-to-walk, and touch.
- [ ] Walking into the collectible increments `◆ 1/5` and opens the dialogue window.
- [ ] Runs at 60 fps with a fixed-timestep loop; pauses when the tab is hidden.
