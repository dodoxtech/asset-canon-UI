# Interaction & Motion

> How the page moves and how it's built — controls, animation choreography, and the
> tech stack. Concept is in [concept.md](concept.md); visual values in
> [art-direction.md](art-direction.md).

## The virtual stage

The page renders to a fixed **480×270** logical stage (see
[art-direction.md](art-direction.md#pixel--layout-rules)).

- A single root element is scaled by the **largest integer factor** that fits the
  viewport (`min(floor(vw/480), floor(vh/270))`), centered with `ink` letterbox
  bars. Recompute on resize.
- `image-rendering: pixelated` on the stage and every sprite.
- The world is a horizontal map a few screens wide; the camera follows the
  character with a soft dead-zone so small movements don't scroll.
- **Mobile:** same stage, plus an on-screen D-pad + A button overlaid outside the
  letterbox; portrait shows a "rotate or tap to walk" hint.

## Controls

| Input | Action |
|---|---|
| `← →` / `A D` | Walk left/right |
| `↑ ↓` / `W S` | Walk up/down (if overworld) or no-op (side-scroll) |
| `Space` / `Z` / click character path | Interact / advance dialogue |
| `Esc` | Close dialogue window |
| `M` / HUD map button | Open minimap fast-travel |
| Click/tap a tile | Click-to-walk pathing toward it |
| `Skip quest` (HUD) | Collapse the game into the scrollable fallback page |

Movement is the only skill required; pickups happen on collision, so no precise
platforming. Forgiving by design.

## Motion choreography

Motion is **event-driven** — it rewards an action, never loops just to decorate.

### Boot sequence

1. Black screen → a `▮` cursor blink (VT323).
2. Cartridge "click-in" shudder + a quick power-on flash (white wipe).
3. Title `CANON QUEST` snaps in letter-row by letter-row; tagline types under it.
4. `▶ PRESS START` blinks at ~1.2 s interval. On input → iris-in wipe to the
   Workshop and the character fades up with a landing "puff".

### Idle & locomotion

- **Idle:** 2-frame breathing loop, ~2 fps, plus a rare blink/look every few seconds.
- **Walk:** 4-frame cycle, ~8 fps, with a 1px vertical body bob and a small dust
  puff on the first contact frame.
- **Parallax:** 2–3 background layers drift at 0.25× / 0.5× of camera. Foreground
  props (lamps, plants) at 1.1× for depth.

### Pickup beat (the core reward)

On collision with a collectible, in sequence (~600 ms total):

1. Collectible **pops** up 4px with a 4-frame sparkle, then arcs to the HUD counter.
2. **SFX:** a bright coin/chime. **Screen shake:** 2px, 120 ms.
3. HUD shard fills: `◇ → ◆` with a small scale-punch; a `+1` floats up in `gold`.
4. World dims ~15%; the **section window slides up** from the bottom with a 2-step
   ease and a soft "whoosh".
5. Dialogue text **typewriters** at ~45 chars/s; `▶` blinks when a box is complete.
6. Close → window slides down, world un-dims, control returns.

### Assemble cutscene (after 5th shard)

The five shards lift off the HUD, orbit the character once, and **fuse** into the
Canon with a white flash + 6px shake; the **Key** drops with a heavy "clunk"; the
far door's lock sprite breaks (3-frame) and the camera pans to the CTA room. ~2.5 s,
skippable with any input.

### CTA room

Chest lid bounce-opens; buttons rise in with a 1-step stagger; a slow gold sparkle
emitter loops *only here* (the one allowed ambient loop, as the celebratory payoff).

### Ambient (subtle, always-on)

Flickering workshop lamp (2-frame), dust motes drifting, a faint CRT scanline +
vignette. All disabled under reduced-motion.

## `prefers-reduced-motion`

When set: no screen shake, no parallax, no CRT/scanline, no sparkle emitters. The
boot is an instant title card; pickups resolve as **immediate** window reveals
(no typewriter — full text shown). The game is still playable; it's just calm.

## Performance budget

- **First load:** ≤ ~300 KB for the initial stage (boot + Workshop). Lazy-load
  later rooms' tiles/backgrounds as the player approaches.
- Ship art as **packed spritesheets + atlas JSON** (the `asset-optimize` output),
  not loose PNGs — one decode, fewer requests.
- Prefer **webp** with png fallback; favicon/OG from `asset-icon` / `asset-social`.
- Target **60 fps** on the game loop; cap the loop with `requestAnimationFrame` and
  a fixed timestep for movement. Pause the loop when the tab is hidden.
- Core Web Vitals: the **fallback page is server-rendered HTML** so LCP/SEO don't
  depend on the canvas booting.

## Recommended tech stack

Keep it lean; this is a one-page experience on the existing Next.js app.

| Concern | Recommendation | Why |
|---|---|---|
| Framework | **Next.js (App Router)** — already set up | SSR the fallback page for SEO + LCP |
| Game layer | **Pixi.js** (WebGL2 + pixel-perfect) — or a tiny custom canvas loop if scope stays small | Handles sprites, atlases, camera, batching |
| Alt. (jam-style) | **Kaboom/kaplay.js** | Faster to prototype the movement+collect loop |
| Tilemap | hand-rolled 16×16 grid, or **LDtk** export → JSON | Simple authored rooms |
| Animation/tweens | Pixi ticker + a small tween lib (e.g. **@tweenjs/tween.js**) | Pickup arcs, slides, shakes |
| Audio | **Howler.js** | SFX sprite, mute toggle, mobile unlock |
| State / progress | React context + **localStorage** | Persist found shards across visits |
| Styling (HUD/CTA/fallback) | CSS modules with the palette as CSS vars | Crisp DOM UI over the canvas |
| Fonts | self-hosted Press Start 2P / Silkscreen / Pixelify Sans / VT323 | No FOUT, pixel-crisp |

**Architecture sketch**

```
app/page.tsx
 ├─ <FallbackContent />     // semantic HTML: all sections + CTA (SSR, SEO, a11y)
 └─ <GameStage />           // client-only: Pixi canvas + HUD overlay
      ├─ engine/            // loop, camera, input, collision
      ├─ scenes/ rooms      // workshop, hallway, gallery, archive, forge, cta
      ├─ entities/          // player, collectibles, doors
      ├─ ui/                // HUD, dialogue window, minimap (DOM over canvas)
      └─ data/sections.ts   // copy imported/typed from sections.md
```

The DOM `<FallbackContent />` is the SEO/accessibility backbone and the "Skip quest"
target; `<GameStage />` enhances on top of it on capable clients.

## Build order (suggested)

1. Stage scaling + a movable character on one room (no art — colored boxes).
2. Collision + pickup + HUD counter + one dialogue window.
3. Wire all 5 sections' copy + the assemble/CTA flow.
4. Drop in real assets as each asset-canon batch lands.
5. Polish pass: motion choreography, audio, CRT, reduced-motion, perf.
6. Fallback page parity check + Lighthouse/CWV pass.
