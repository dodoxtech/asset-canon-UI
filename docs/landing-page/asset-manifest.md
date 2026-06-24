# Asset Manifest

> The complete, countable list of every image asset the landing page needs to
> ship, derived from [concept.md](concept.md) (rooms, hero, companion, the
> level-up reward), [sections.md](sections.md) (what each room shows), and
> [interaction-and-motion.md](interaction-and-motion.md) (which frames animate).
>
> **Use this when generating art.** Each row is one deliverable. All sizes,
> colors, fonts, and pixel rules come from [art-direction.md](art-direction.md) —
> this doc does **not** restate hex values; it points every asset at that palette.
>
> **Reading the columns**
> - **Slug** — the `<slug>` for the file + its `<slug>.yaml` descriptor.
> - **Size** — authored at 1× (the virtual stage is 480×270; never pre-scale).
> - **Frames** — sprite-sheet frame count; `1` = static.
> - **Alpha** — `chroma` = generate on the chroma-green/magenta plate and key to
>   transparency; `cut` = transparent PNG cutout; `opaque` = full-bleed, no alpha.

---

## 0 · Counts at a glance

| Category | Distinct assets | Total animation frames |
|---|---|---|
| A. Hero character (Pix) | 4 | 11 |
| B. Companion (Cano) | 3 | 8 |
| C. Collectibles | 9 | 32 |
| D. Room backdrops | 7 | 7 |
| E. Tilesets & textures | 11 | — |
| F. Animated props & doors | 12 | 44 |
| G. Cutscene / FX | 6 | 22 |
| H. HUD & UI | 14 | — |
| I. Icon & favicon family | 1 (family) | — |
| J. Social / OG | 2 | — |
| **TOTAL** | **69 deliverables** | **~124 frames** |

> "Distinct assets" = things you generate separately. "Family" deliverables (the
> favicon ladder) export many files from one source. Treat **69** as the number of
> generation prompts; treat **~124 frames** as the spritesheet workload.

Everything below is grouped so you can generate one **batch** (one shared style
lock) at a time. Generate in the listed order — earlier batches define the palette
and lighting later ones must match.

---

## A · Hero character — "Pix"  (`asset-sprite`, 16×24)

Side-scroller: author **facing right**, flip in code for left. 1px `ink`
selective outline. Pix is a small artist-hero — apron, oversized beret/cap, a
stubby paintbrush at the hip. Warm skin, `paper`-light highlights.

| # | Slug | Size | Frames | Alpha | Description |
|---|---|---|---|---|---|
| A1 | `pix-idle-tired` | 16×24 | 2 | cut | **Start state.** Slumped shoulders, head slightly down, slow 2-frame breathing. Used only in the dim opening Workshop, before the first Shard. Sells "overwhelmed maker." |
| A2 | `pix-idle` | 16×24 | 2 | cut | **Default idle** after the studio lights up. Upright, confident, 2-frame breathe + a rare blink (fold the blink into frame 2 if budget is tight). |
| A3 | `pix-walk` | 16×24 | 4 | cut | Side walk cycle, ~8 fps, 1px vertical body-bob; brush sways. Frame 1 is the ground-contact frame (drives the dust puff). |
| A4 | `pix-pickup` | 16×24 | 3 | cut | Pickup/cheer: anticipation crouch → arms-up "got it!" → settle. Plays on every Shard collect. |

> **11 frames total.** A1 and A2 share the same body; A2 is a posture/expression
> repaint, not a new character — keep them on one sheet if your tool allows.

---

## B · Companion — "Cano"  (`asset-sprite`, 12×12)

A tiny floating orchestrator-sprite: a glowing `canon-green` cursor/spark with two
dot-eyes, a faint magenta rim-light, and a soft dithered glow halo (the halo can
be a separate additive sprite or baked in). Always hovers; never touches ground.

| # | Slug | Size | Frames | Alpha | Description |
|---|---|---|---|---|---|
| B1 | `cano-float` | 12×12 | 4 | chroma | Resting hover: 2px vertical bob + a 4-frame glow-pulse on the halo. The always-on idle. |
| B2 | `cano-react` | 12×12 | 2 | chroma | Happy squash-and-stretch bounce + eyes scrunch. Fires on each pickup ("Now we're cooking."). |
| B3 | `cano-point` | 12×12 | 2 | chroma | Leans/stretches toward the nearest un-found Shard with a little arrow-tail. The idle nudge. |

> **8 frames total.** Keep the halo within the 12×12 box or pad to 16×16 so the
> glow doesn't clip.

---

## C · Collectibles  (`asset-sprite`, 16×16, on chroma plate → keyed)

Each Shard is a glowing pickup with a **4-frame sparkle/spin loop**. Bright,
high-contrast, readable at 1× against any room. Generate all six Shards as one
`asset-variants` batch off a shared "floating gem" base for visual consistency.

| # | Slug | Size | Frames | Alpha | Description |
|---|---|---|---|---|---|
| C1 | `shard-canon` | 16×16 | 4 | chroma | **Canon Shard.** A faceted `canon-green` crystal, green-lite inner glow, slow spin + sparkle. The "what is asset-canon" pickup / tutorial. |
| C2 | `shard-pipeline` | 16×16 | 4 | chroma | **Pipeline Scroll.** A rolled parchment with a glowing arrow-chain (`→→→`) on it; `sky` accent. Unlocks "how it works." |
| C3 | `shard-keyring` | 16×16 | 4 | chroma | **Specialist Keyring.** A ring holding 5 tiny differently-colored keys (one per skill); gentle jingle-sparkle. Unlocks "the 5 skills." |
| C4 | `shard-rune` | 16×16 | 4 | chroma | **Descriptor Rune.** A flat `canon-magenta` runestone etched with a `{ }` / YAML glyph, pulsing glow. Unlocks "why it's reliable." |
| C5 | `shard-cog` | 16×16 | 4 | chroma | **Install Cog.** A `gold`/`stone` gear that slowly rotates, with a spark on the teeth. Unlocks "get started." |
| C6 | `key-canon` | 16×16 | 4 | chroma | **Canon Key.** Ornate `gold` key with a green gem in the bow; heavier, prestigious sparkle. Drops after the assemble cutscene; opens the final door. |
| C7 | `coin` | 16×16 | 4 | chroma | Generic `gold` coin spin (4-frame), optional scattered micro-pickups for game feel / the coin SFX. Reuse the classic 4-frame coin rotation. |
| C8 | `sticker-easteregg` | 16×16 | 2 | chroma | **Hidden easter egg:** a tiny "made with asset-canon" holographic sticker, 2-frame shimmer. Optional pickup that hardens the dogfood reveal. |
| C9 | `canon-artifact` | 32×32 | 2 | cut | The **assembled Canon** — the five Shards fused into one radiant emblem. Shown mid-cutscene and as the chest's contents. Larger; 2-frame glow pulse. |

> **32 frames total.** C1–C6 must read as a *family* (same facet style, same
> outline weight). C9 is the payoff — make it clearly "all five combined."

---

## D · Room backdrops  (`asset-illustration`, 480×270, opaque)

One painted backdrop per room — the far wall + ambient lighting. Floors, walls you
walk against, and interactive props are the **tilesets/props** below, layered on
top. Each backdrop is authored in its **lit** state; the dim "before" state is a
CSS tint/vignette overlay (cheaper than a second painting) **except** where a prop
changes — those changes live in the animated props (§F), not here.

| # | Slug | Size | Frames | Alpha | Description |
|---|---|---|---|---|---|
| D1 | `bg-boot` | 480×270 | 1 | opaque | **Boot / title screen.** A dark cartridge-slot / CRT-glow backdrop for the `CANON QUEST` title and `▶ PRESS START`. Most atmospheric, least busy. |
| D2 | `bg-workshop` | 480×270 | 1 | opaque | **Workshop.** Cozy artist's studio: easels, paint cans, a hanging lamp, a window with GBA-dusk light. The home room. |
| D3 | `bg-hallway` | 480×270 | 1 | opaque | **Hallway.** A corridor lined with the conveyor/pipeline rig along the back wall (the `BRIEF→…→REPORT` nodes mount here). |
| D4 | `bg-gallery` | 480×270 | 1 | opaque | **Gallery.** A museum-like wall of 5 evenly-spaced empty picture frames + soft spotlights. |
| D5 | `bg-archive` | 480×270 | 1 | opaque | **Archive.** Tall shelves of rolled YAML scrolls, a card-catalog, faint motes of dust in light shafts. |
| D6 | `bg-forge` | 480×270 | 1 | opaque | **Forge.** A workshop forge: furnace, anvil, tool rack, chimney. Authored **lit/ignited**; the cold state is handled by the furnace prop. |
| D7 | `bg-cta` | 480×270 | 1 | opaque | **CTA room / vault.** A celebratory chamber with a pedestal for the chest, banners, and the now-open final door behind. Brightest, most triumphant. |

> **7 backdrops.** Keep a consistent horizon/floor line across D2–D6 so the
> side-scroll camera reads as one continuous studio.

---

## E · Tilesets & textures  (`asset-sprite` 16×16 / `asset-texture` seamless)

The walkable/foreground layer. A tileset = one packed sheet of 16×16 tiles
(floor, wall, edge, corner + that room's static props). Textures are seamless
fills for large surfaces behind the tiles.

| # | Slug | Type | Tiles / Size | Alpha | Description |
|---|---|---|---|---|---|
| E1 | `tiles-base` | `asset-sprite` | ~16 tiles, 16×16 | cut | Shared structural kit: floor, wall, wall-top, edges, corners, baseboard. The skeleton every room reuses. |
| E2 | `tiles-workshop` | `asset-sprite` | ~8 tiles, 16×16 | cut | Workshop props: workbench, stool, easel base, paint-can stack, rug. |
| E3 | `tiles-hallway` | `asset-sprite` | ~8 tiles, 16×16 | cut | Hallway props: wall sconces, doorway trims, conveyor mounting brackets. |
| E4 | `tiles-gallery` | `asset-sprite` | ~6 tiles, 16×16 | cut | Gallery props: frame mounts, velvet rope, bench, spotlight housing. |
| E5 | `tiles-archive` | `asset-sprite` | ~8 tiles, 16×16 | cut | Archive props: shelf units, ladder, card-catalog drawers, scroll bins. |
| E6 | `tiles-forge` | `asset-sprite` | ~8 tiles, 16×16 | cut | Forge props: anvil base, water trough, tool rack, coal pile, chimney. |
| E7 | `tiles-cta` | `asset-sprite` | ~6 tiles, 16×16 | cut | CTA props: pedestal, banner poles, confetti tile, doorway frame. |
| E8 | `tex-floor-wood` | `asset-texture` | 32×32 seamless | opaque | Seamless plank floor (Workshop/Gallery), 2×2 seam-checked. |
| E9 | `tex-floor-stone` | `asset-texture` | 32×32 seamless | opaque | Seamless flagstone floor (Hallway/Archive/Forge). |
| E10 | `tex-wall-plaster` | `asset-texture` | 32×32 seamless | opaque | Seamless interior wall fill for the upper backdrop band. |
| E11 | `tex-dither-glow` | `asset-texture` | 32×32 tileable | chroma | A reusable Bayer-dither glow/gradient swatch for lamp pools, magic auras, and the "lit-up" wash. |

> **11 deliverables.** Tile counts are guidance, not a contract — pack what each
> room needs into one sheet and let `asset-optimize` atlas it.

---

## F · Animated props & doors  (`asset-sprite`, mixed sizes)

These carry the **level-up reward** from [concept.md](concept.md#the-hook-that-makes-it-meaningful-the-hero-levels-up): most ship a **dark/off**
state and a **lit/on** state so the room visibly "comes alive" on pickup.

| # | Slug | Size | Frames | Alpha | Description |
|---|---|---|---|---|---|
| F1 | `prop-lamp` | 16×24 | 2 | cut | Workshop hanging lamp, 2-frame flicker. Has an `off` (dim) and `on` (warm pool) variant — the first Shard turns it on. |
| F2 | `prop-conveyor-belt` | 16×16 | 4 | cut | A tiling conveyor segment for the hallway, 4-frame scroll. Runs after the Pipeline Scroll is found. |
| F3 | `prop-pipeline-nodes` | 16×16 ×6 | 2 each | cut | Six labeled pipeline nodes — `BRIEF · PLAN · GENERATE · OPTIMIZE · WRITE · REPORT` — each with an `unlit` and `lit` (glowing) frame. Light up left→right on pickup. |
| F4 | `prop-frame-empty` | 24×24 | 1 | cut | Gallery picture frame, dark/empty. ×5 placements (same art, different sample inside). |
| F5 | `prop-frame-lit` | 24×24 | 5 | cut | The 5 framed **sample assets** revealed when the Keyring is found — one per skill: a HUD icon (icon), a room spot (illustration), the hero sprite (sprite), a tile (texture), the share card (social). These are the dogfood proof; each frame shows a real generated sample. |
| F6 | `prop-scroll-shelf` | 16×16 | 4 | cut | A YAML-scroll on the Archive shelf with a 4-frame glow-on ramp. Dark → glowing when the Rune is found. |
| F7 | `prop-furnace` | 32×32 | 4 | cut | Forge furnace: a `cold` static frame + a 4-frame fire loop for the `ignited` state. The Install Cog lights the forge. |
| F8 | `prop-anvil-sparks` | 16×16 | 3 | chroma | Spark burst off the anvil, 3-frame, additive. Plays in the lit forge. |
| F9 | `door-locked` | 24×32 | 1 | cut | The final door, closed, with a glowing lock. Sits at the end of the map. |
| F10 | `door-lockbreak` | 24×32 | 3 | cut | 3-frame lock-shatter that plays when the Key is used. |
| F11 | `door-open` | 24×32 | 2 | cut | The opened final door (doors swing/light spill), 2-frame. Camera pans through to CTA. |
| F12 | `prop-chest` | 32×24 | 4 | cut | Treasure chest: 1 `closed` frame + a 3-frame `lid bounce-open` reveal in the CTA room. Bursts into the install commands + buttons. |

> **~44 frames total** (F3 = 12 frames, F5 = 5 distinct paintings, F7 = 5). F3 and
> F5 are the most content-heavy props — budget time there.

---

## G · Cutscene / FX  (`asset-sprite` / `asset-illustration`)

Event-driven effects from [interaction-and-motion.md](interaction-and-motion.md#motion-choreography). Many transitions (iris wipe,
white flash, screen shake, dim) are **CSS/engine** and need no art — only the
sprites below are generated.

| # | Slug | Size | Frames | Alpha | Description |
|---|---|---|---|---|---|
| G1 | `fx-cartridge` | 64×48 | 3 | cut | The `CANON QUEST` cartridge that "clicks in" at boot: 3-frame insert shudder. Label art on the cartridge = mini Canon emblem. |
| G2 | `logo-canonquest` | 240×72 | 1 | cut | Stylized `CANON QUEST` title lockup (pixel display logo). Optional — can fall back to Press Start 2P text; the painted logo reads better on D1. |
| G3 | `fx-sparkle` | 16×16 | 4 | chroma | Shared 4-frame pickup sparkle/star-burst, `gold`. Reused by every collectible and the `+1` pop. |
| G4 | `fx-dust-puff` | 16×16 | 3 | chroma | Small ground dust puff on the walk contact-frame and on character landing. |
| G5 | `fx-dust-motes` | 32×32 | 4 | chroma | Drifting ambient dust motes (Archive light shafts, general atmosphere), 4-frame loop, very subtle. |
| G6 | `fx-assemble-glow` | 64×64 | 8 | chroma | The assemble-cutscene burst: a radial dithered flare the 5 Shards orbit into before fusing into `canon-artifact` (C9). 8-frame charge→flash. |

> **~22 frames total.** G3 is the single most-reused FX — get it crisp first.

---

## H · HUD & UI  (`asset-icon` 16×16 + 9-slice windows)

Crisp DOM/canvas UI over the stage. Pixel-authored; colors from the palette.

| # | Slug | Size | Frames | Alpha | Description |
|---|---|---|---|---|---|
| H1 | `hud-pip-filled` | 8×8 | 1 | cut | Filled Shard pip `◆` (`gold`) for the `2/5` counter. |
| H2 | `hud-pip-empty` | 8×8 | 1 | cut | Empty Shard pip `◇` (`stone`). |
| H3 | `hud-bar` | 480×16 | 1 | cut | The top status-bar frame/background the HUD elements sit in. |
| H4 | `ui-window` | 9-slice, 48×48 src | 1 | cut | The GBA dialogue/menu window: `panel-dark` fill, `border` 1px edge, beveled corners. Authored as a 9-slice so it stretches to any size. |
| H5 | `ui-cursor` | 8×8 | 2 | cut | The blinking `▶` advance cursor / menu pointer, 2-frame blink. |
| H6 | `icon-sound-on` | 16×16 | 1 | cut | Speaker-on toggle icon. |
| H7 | `icon-sound-off` | 16×16 | 1 | cut | Speaker-muted toggle icon. |
| H8 | `icon-map` | 16×16 | 1 | cut | Minimap / fast-travel button icon (folded map). |
| H9 | `icon-skip` | 16×16 | 1 | cut | "Skip quest / read it" icon (fast-forward `▶▶` or document). |
| H10 | `minimap-rooms` | 16×16 ×6 | 1 each | cut | Six tiny room glyphs for the fast-travel minimap (workshop, hallway, gallery, archive, forge, vault) — visited vs locked tint via CSS. |
| H11 | `ui-dpad` | 48×48 | 1 | cut | Mobile on-screen D-pad. |
| H12 | `ui-btn-a` | 24×24 | 1 | cut | Mobile "A" / interact button. |
| H13 | `btn-cta-primary` | 9-slice | 1 | cut | Primary CTA button skin (`canon-green`), pixel-beveled. `★ Star on GitHub`. |
| H14 | `btn-cta-secondary` | 9-slice | 1 | cut | Secondary/tertiary CTA button skin (`stone`/`sky`) for "Read the docs" / "Copy install." |

> **14 deliverables.** H10 is six small glyphs on one sheet. Buttons can be pure
> CSS if you prefer — listed here so the count is complete if you go sprite-skinned.

---

## I · Icon & favicon family  (`asset-icon`)

| # | Slug | Sizes | Alpha | Description |
|---|---|---|---|---|
| I1 | `favicon` | 16, 32, 48, 180 (apple-touch), 192, 512 (PWA) | cut | One mark — the **Canon Shard emblem** (or the cartridge) — exported across the full favicon/app-icon ladder. Readable down to 16×16; the green facet is the recognizable silhouette. |

> **1 family deliverable**, multiple exported files. Generate the 512 master,
> let the size ladder derive the rest.

---

## J · Social / OG  (`asset-social`)

| # | Slug | Size | Alpha | Description |
|---|---|---|---|---|
| J1 | `og-card` | 1200×630 | opaque | Open Graph / link-preview card: Pix mid-walk in a lit Workshop, the `CANON QUEST` logo, tagline *"Turn a brief into shippable art,"* and a `▶ PLAY` cue. This is also the sample shown in the Gallery's `asset-social` frame (F5). |
| J2 | `twitter-card` | 1200×600 | opaque | Same composition retargeted to the X/Twitter summary-large-image ratio. Can be a crop of J1 if dimensions allow. |

> **2 deliverables.** Keep text in the safe area; assume the platform crops edges.

---

## Generation notes (read before you prompt another AI)

- **One style lock, inherited everywhere.** Generate batch **A → J in order**.
  Lock the palette/lighting on the hero + Workshop first (A, D2, E1) so every later
  batch matches. Feed the shared style brief from
  [`../style-profile.yaml`](../style-profile.yaml) (the machine form of
  [art-direction.md](art-direction.md)) into every prompt.
- **Chroma plates.** Anything marked `chroma` must be generated on the
  `canon-green` (or `canon-magenta` for green subjects) plate, then keyed to alpha
  — never with a soft/anti-aliased edge. `cut` assets need a hard-edged
  transparent background.
- **Integer pixels only.** Author at the sizes given (1×). Do **not** upscale or
  add anti-aliasing — the page scales by integer factors and uses
  `image-rendering: pixelated`. Sub-pixel detail will shimmer.
- **16-color discipline.** Every asset uses only the single 16-color palette in
  [art-direction.md](art-direction.md#color-palette). No new hues; shade with the
  3-step accent ramps and Bayer dithering, not gradients.
- **Sheets, not loose frames.** Deliver multi-frame assets as a horizontal
  frame-grid spritesheet so `asset-optimize` can pack them + emit the atlas JSON.
- **Descriptors.** Each shipped asset writes its `<slug>.yaml` sidecar into
  [`../assets/`](../assets/) so the frontend can place it without opening the
  image — same as a real asset-canon run.

## Priority tiers (if you can't make all 69 at once)

1. **Playable-grey MVP (no art):** none — the build starts with colored boxes
   ([interaction-and-motion.md](interaction-and-motion.md#build-order-suggested)).
2. **Vertical slice:** A2, A3, B1, C1, D2, E1, H1–H5, H13–H14, G3. (Walk +
   collect + one dialogue + one CTA button, fully art'd.)
3. **All rooms playable:** the rest of C, D, E, F.
4. **Polish & launch:** A1/A4, B2/B3, G1/G2/G4–G6, full HUD, I1, J1/J2.
