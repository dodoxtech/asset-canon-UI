# 0008d. Movable grey-box character: input + camera

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Parent:** [0008](0008-build-engine-mvp.md)

## Goal
A grey-box character that walks one room via keyboard, click-to-walk, and touch,
followed by a dead-zone camera. Still placeholder art (colored boxes).

## Scope
- In: one room larger than the stage; a player entity drawn as a box; input layer
  (arrows/WASD, click/tap-to-walk, touch drag/virtual control); camera that
  follows with a dead-zone and clamps to room bounds.
- Out: collision with collectibles (0008e), dialogue, real sprites.

## Steps
1. Define a room scene (size, a flat backdrop fill) and a player entity with
   position/velocity; render both through the camera transform.
2. Input layer normalizing sources into a movement intent:
   keyboard (arrows + WASD), pointer click/tap → walk toward point, touch drag.
   Map screen → stage → world coords through the 0008c scale + camera.
3. Movement with per-frame speed in the fixed update step; clamp player to room.
4. Dead-zone camera: only scroll when the player leaves the central box; clamp
   camera to room edges (no out-of-room reveal).
5. Verify touch works on a phone (or device emulation) without page scroll/zoom
   stealing the gesture.

## Acceptance criteria
- [ ] Character moves via arrows/WASD, click-to-walk, and touch.
- [ ] Camera follows with a dead-zone and clamps at room bounds.
- [ ] Screen-to-world mapping stays correct across integer scales and DPR.
- [ ] Touch input drives movement on phone without scrolling/zooming the page.
