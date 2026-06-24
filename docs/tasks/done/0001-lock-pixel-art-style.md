# 0001. Lock the shared pixel-art style

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24

## Goal
Produce one locked style reference so every later asset batch inherits the same
palette, lighting, and pixel discipline.

## Context
The page dogfoods asset-canon's "one style, one palette per batch" rule. Every
batch in [asset-manifest.md](../../landing-page/asset-manifest.md) depends on this
lock existing first. Style source of truth is
[art-direction.md](../../landing-page/art-direction.md), mirrored to
[style-profile.yaml](../../style-profile.yaml).

## Scope
- In: finalize `style-profile.yaml` (palette, `prompt_suffix`, `negative`, chroma
  plate); generate the 3 anchor assets that define the look — `pix-idle` (A2),
  `bg-workshop` (D2), `tiles-base` (E1).
- Out: all other asset batches (their own tasks); engine/build work.

## Steps
1. Confirm the 16-color palette + accent ramps in art-direction.md, mirror any
   change into style-profile.yaml.
2. Generate the 3 anchor assets via the locked style brief.
3. Review against the mood keywords; iterate until the look is approved.
4. Save approved anchors + their `<slug>.yaml` descriptors into [../../assets/](../../assets/).

## Acceptance criteria
- [ ] `style-profile.yaml` is complete and matches art-direction.md (palette, suffix, negative, plate).
- [ ] `pix-idle`, `bg-workshop`, `tiles-base` generated, on-palette, integer-pixel, approved.
- [ ] Each anchor has a `<slug>.yaml` descriptor in `docs/assets/`.
- [ ] The locked brief is reusable verbatim by tasks 0002–0007.
