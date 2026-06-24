# 0008b. Scaffold `<GameStage/>` + fixed-timestep loop

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Parent:** [0008](0008-build-engine-mvp.md)

## Goal
Create the client-side game shell and the folder structure, with a fixed-timestep
loop that pauses when the tab is hidden. No gameplay yet — just a clearing canvas
proving the loop runs.

## Scope
- In: `<GameStage/>` client component mounted from `app/page.tsx`; the
  `engine/`, `scenes/`, `entities/`, `ui/` structure; a fixed-timestep
  update/render loop; visibility-based pause.
- Out: scaling math (0008c), input, entities, HUD, dialogue.

## Steps
1. Create `app/game/` with `engine/` (loop, time), `scenes/`, `entities/`, `ui/`.
2. `GameStage.tsx` (`"use client"`): owns a `<canvas>` ref and starts/stops the loop
   on mount/unmount.
3. Implement a fixed-timestep loop (accumulator, e.g. 1/60s update) with a
   separate render call; decouple update rate from `requestAnimationFrame`.
4. Pause/resume on `document.visibilitychange`; reset the accumulator on resume
   so a backgrounded tab doesn't spiral.
5. Render a clear color + an on-canvas FPS/tick readout to prove timing.

## Acceptance criteria
- [ ] `app/page.tsx` renders `<GameStage/>`; page builds and loads with no console errors.
- [ ] Loop uses a fixed update step decoupled from render; holds ~60 fps.
- [ ] Hiding the tab pauses updates; returning resumes without a time spike.
- [ ] Loop is cleanly torn down on unmount (no leaked rAF/listeners).
