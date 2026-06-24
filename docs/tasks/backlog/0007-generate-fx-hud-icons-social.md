# 0007. Generate FX, HUD/UI, favicon & social

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Produce the remaining cutscene effects, the full HUD/UI skin, the favicon family,
and the social cards.

## Context
Covers batches **G, H, I, J** of
[asset-manifest.md](../../landing-page/asset-manifest.md). Motion cues are in
[interaction-and-motion.md](../../landing-page/interaction-and-motion.md#motion-choreography).
Depends on task 0001 (and 0003 for the assemble flare pairing with `canon-artifact`).

## Scope
- In (G): G1 `fx-cartridge`, G2 `logo-canonquest`, G3 `fx-sparkle`, G4 `fx-dust-puff`,
  G5 `fx-dust-motes`, G6 `fx-assemble-glow`.
- In (H): H1–H14 — pips, HUD bar, 9-slice window, cursor, sound/map/skip icons,
  minimap room glyphs, mobile D-pad + A button, CTA button skins.
- In (I): I1 `favicon` family ladder (16→512).
- In (J): J1 `og-card`, J2 `twitter-card`.
- Out: nothing remaining from the manifest after this task.

## Steps
1. Generate G batch; `fx-sparkle` (G3) first since it's reused by every pickup + `+1` pop.
2. Generate H batch; author `ui-window` as a 9-slice; H10 minimap glyphs on one sheet.
3. Generate the favicon 512 master, derive the ladder; readable at 16×16.
4. Generate J cards; keep text in the safe area; J1 doubles as the gallery `asset-social` sample.
5. Write `<slug>.yaml` descriptors into [../../assets/](../../assets/).

## Acceptance criteria
- [ ] All G/H/I/J assets generated at manifest sizes, on-palette, integer-pixel.
- [ ] `ui-window` stretches cleanly as a 9-slice with no corner distortion.
- [ ] Favicon is legible at 16×16; full ladder exported (incl. apple-touch 180, PWA 192/512).
- [ ] `og-card`/`twitter-card` render correctly in a link-preview validator.
- [ ] Each ships a `<slug>.yaml` descriptor (favicon family = one source).
