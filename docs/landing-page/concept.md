# Concept & Player Journey

> The game design. What the visitor does, in what order, and how it maps to
> learning about asset-canon. For visuals see [art-direction.md](art-direction.md);
> for the exact section copy see [sections.md](sections.md); for how it's built see
> [interaction-and-motion.md](interaction-and-motion.md).

## The big idea: the game *is* the pitch

The visitor isn't told what asset-canon does — they **feel** it. They start as a
maker buried under a pile of "we need an icon… and a banner… and sprites…" and
they leave having watched a single tool turn that chaos into shippable files. The
fiction is a one-to-one mirror of the real problem the product solves, so the
quest and the sales message are the same thing. Nothing is decorative.

> **Design pillar:** every game beat must *earn* its content. If a room is fun but
> teaches nothing — or teaches without being fun — it's wrong. Joy and meaning
> ride together or not at all.

## The premise (the boot screen narrative)

The visitor "powers on a cartridge" called **CANON QUEST**. They wake up as
**Pix**, a little pixel artist-hero, standing in a cluttered, half-lit studio —
unfinished assets everywhere, a dim forge, a locked door. A floating companion
sprite, **Cano** (the orchestrator, personified as a tiny glowing cursor-sprite),
greets them and frames the quest in one breath:

> *"The studio's gone dark — the **Canon** that powered it shattered into five
> Shards. Find them, and you won't just fix the lights… you'll learn to ship art
> faster than you ever could by hand. Ready, maker?"*

Two things this version adds on purpose:

- **A reason to care.** The studio is *yours*, it's broken, and fixing it makes
  *you* more powerful — not an abstract fetch quest. The stakes are the player's
  own creative output.
- **A guide with personality.** Cano reacts, teases, and celebrates. A companion
  turns a static walk into a relationship and gives every pickup a voice.

## The collectibles → sections map

The player collects **5 Shards + 1 Key**. Each maps to exactly one section. Full
copy for each lives in [sections.md](sections.md); this is the skeleton:

| # | Collectible | Room | Section it unlocks |
|---|---|---|---|
| 0 | — (spawn) | Workshop | **Hero / boot** — title, tagline, "press ▶ to start" |
| 1 | 🟢 Canon Shard | Workshop | **What is asset-canon** — the elevator pitch |
| 2 | 🗺️ Pipeline Scroll | Hallway | **How it works** — brief → plan → generate → optimize → write → report |
| 3 | 🧰 Specialist Keyring | Gallery | **The 5 skills** — icon / illustration / sprite / texture / social |
| 4 | 🔖 Descriptor Rune | Archive | **Why it's reliable** — descriptors, style profiles, determinism |
| 5 | ⚙️ Install Cog | Forge | **Get started** — install commands + requirements |
| 6 | 🔑 Canon Key | (appears last) | **The final door → CTA** — GitHub, docs, "ship it" |

> The rooms are a single horizontal side-scrolling map. Order is *suggested* by
> layout and by Cano's nudges, but the player is free to roam; sections reveal as
> items are found, not in a forced sequence.

## The hook that makes it meaningful: the hero levels up

This is the new heart of the design. **Each Shard is a power the hero visibly
gains**, and that power is the very capability the section describes. The player
doesn't just read about a skill — they *watch the studio come back to life* as
proof.

| Shard | The section it teaches | What changes on screen (the reward) |
|---|---|---|
| 🟢 Canon Shard | What asset-canon is | The studio's main light flicks on; Pix straightens up — the world stops being grey. |
| 🗺️ Pipeline Scroll | How it works | A conveyor of pixel-nodes (`BRIEF→…→REPORT`) lights up across the hallway and starts running. |
| 🧰 Specialist Keyring | The 5 skills | Five dark picture frames in the Gallery snap to full color — each a real sample asset. |
| 🔖 Descriptor Rune | Why it's reliable | Shelves of YAML scrolls begin glowing; a faint grid/snap aligns the room (order from chaos). |
| ⚙️ Install Cog | Get started | The cold forge ignites — sparks, a working anvil, the studio is now *operational*. |

By the fifth Shard the studio has gone from dim and broken to bright and humming.
The transformation **is** the testimonial: "this tool turns a mess into something
that ships." No claim needed — the player lived it.

## The loop (what happens on every pickup)

1. Player walks Pix into a Shard's tile. Cano perks up nearby ("Ooh — over here!").
2. **Pickup beat:** the Shard pops with a sparkle, a coin-style SFX, light screen
   shake, a `+1` on the HUD counter (`◆ 1/5`), **and the room's lights-up reward
   fires** (see table above).
3. Cano drops a one-line reaction in character ("*Now we're cooking.*"), then the
   matching **section panel slides up** as a GBA-style dialogue/menu window with
   typewriter text. The world dims slightly behind it.
4. Player closes the panel (▶ / click / Esc) and keeps exploring. Idle too long
   and Cano gently points toward the nearest un-found Shard — never blocking,
   just helpful.
5. On the 5th pickup, the **Canon assembles** (a short cutscene: the five Shards
   orbit and fuse, the whole studio flares to full brightness), the **Key** drops,
   and the final door unlocks.

Short, legible, rewarding — and now *cumulative*: every pickup leaves the world
visibly better than it found it. **Target play time: 60–90 seconds** to find all
five at a brisk pace; a curious player who reads every panel lands around **2–3
minutes**. Either is a complete, satisfying arc.

## HUD (heads-up display)

A thin GBA-style status bar, pinned top:

- **Shard counter** — `◆ ◆ ◇ ◇ ◇  2/5` (filled vs. empty).
- **Map / fast-travel button** — opens a tiny minimap; clicking a found room jumps
  there. Lets returning visitors re-read any section instantly.
- **Sound toggle** + **Skip quest** link (see below).

## Win state

When all 5 Shards + the Key are collected, the final door opens and the camera
pans to the **CTA room**: a big pixel chest that bursts open into the install
commands and primary buttons (**Star on GitHub**, **Read the docs**, **Copy
install**). A "QUEST COMPLETE — 100%" banner confirms it, and Cano signs off with
a final line that hands the torch over: *"You fixed the studio. Now go break in a
new one."* The CTA is the payoff of the whole game, not a footer afterthought.

## Replay & delight (the joy budget)

Small touches that cost little and reward curiosity — none are required to
understand the product:

- **Cano has opinions.** Different one-liners per room, plus rare idle barbs if
  you wander. Personality is the cheapest fun on the page.
- **A hidden 6th sparkle.** An optional easter-egg pickup (e.g., a tiny "made with
  asset-canon" sticker) that does nothing but make the dogfooding reveal land
  harder for the people who explore.
- **Completion stamp.** Finishing sets a `localStorage` flag; returning visitors
  get a subtle "Welcome back, maker" and spawn with the studio already lit, so a
  re-visit feels like *their* studio, not a reset.

## Accessibility & the "skip path"

Playing must never gate the content. Non-negotiable guarantees:

- **Skip the quest** (always visible in the HUD, and offered up front on the boot
  screen) instantly reveals every section stacked as a normal, scrollable,
  screen-reader-friendly page — same copy, same CTA, no game required.
- **Keyboard + click + touch** all drive the character (arrows/WASD, on-screen
  D-pad on mobile, click-to-walk).
- `prefers-reduced-motion`: disables screen shake, parallax, and the assemble
  cutscene; pickups and room lights-up resolve as instant reveals.
- All section copy exists as real semantic HTML behind the canvas/stage, so SEO
  and assistive tech see a complete page regardless of play state.
- Persist progress in `localStorage` so a returning visitor isn't forced to replay.

## Tone

Playful, retro, a little nostalgic — but the *content* is crisp and professional.
The game is the wrapper and Cano is the charm; the message ("asset-canon turns a
brief into shippable art") is delivered plainly inside every dialogue box. The
fiction earns the smile; the copy closes the sale.
