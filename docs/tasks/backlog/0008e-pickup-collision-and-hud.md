# 0008e. Collision + pickup + HUD shard counter

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Parent:** [0008](0008-build-engine-mvp.md)

## Goal
Place one collectible in the room; walking into it removes it and increments a
GBA-style HUD shard counter.

## Scope
- In: a collectible box entity; AABB overlap test against the player; pickup that
  despawns the collectible and bumps a `shards` count; HUD overlay rendering
  `◆ 1/5` (filled vs empty), pinned and responsive.
- Out: SFX, screen shake, room "lights-up", section panel (0008f / 0009).

## Steps
1. Add a collectible entity at a fixed tile in the room.
2. Per-update AABB overlap check vs. player; on overlap, mark picked, despawn,
   `shards += 1` (guard against double-count in one frame).
3. HUD in `ui/`: a thin top status bar drawing `◆ ◆ ◇ ◇ ◇  n/5`. Decide DOM
   overlay vs. canvas — keep it readable at all scales and on phone.
4. Fire a single "pickup" event other systems (dialogue in 0008f) can subscribe to.

## Acceptance criteria
- [ ] Walking into the collectible despawns it and increments the counter once.
- [ ] HUD shows `◆ 1/5` with filled/empty pips and stays legible at every scale and on phone.
- [ ] A pickup event is emitted exactly once per collectible.
