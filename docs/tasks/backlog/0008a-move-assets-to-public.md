# 0008a. Move assets to `/public/assets` + typed manifest

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Parent:** [0008](0008-build-engine-mvp.md)

## Goal
Make the generated art serveable by Next.js and reachable from code via a typed
path helper, so later tasks load assets by name instead of magic strings.

## Why
Next.js only serves static files from `/public`. Today they live in `/assets`
(3.7 MB under `assets/generated/`), which is not web-reachable. Move once, up
front, before any engine code references paths.

## Scope
- In: move `assets/generated/**` → `public/assets/generated/**`; a tiny typed
  manifest/helper that maps asset ids → `/assets/...` URLs.
- Out: loading or rendering assets (that's 0008d/0009); image optimization.

## Steps
1. `git mv` the `assets/` tree into `public/` (preserve the `generated/...`
   subfolder layout so doc references stay valid by suffix).
2. Add `app/game/assets.ts` (or `lib/assets.ts`) exporting an `asset(id)` helper
   and/or a small typed manifest of the backdrops + spritesheets that exist now.
   The source of truth for *which assets exist and what each one is* is the
   descriptor set in [docs/assets/](../../assets/) — one `docs/assets/<slug>.yaml`
   per asset, listing its `files:` paths, subject, and placement. Build the manifest
   from those descriptors (the `.yaml` "image descriptions"), not by eyeballing the
   image tree. See [docs/assets/README.md](../../assets/README.md).
3. Grep the repo for `assets/generated` references and update any that assume the
   old path. Note the `/public` prefix is stripped in URLs (`/assets/...`).
4. Confirm `next dev` serves a sample file, e.g. `/assets/generated/backdrops/bg-boot-480x270.png`.

## Acceptance criteria
- [ ] `public/assets/generated/**` exists; `assets/` no longer at repo root.
- [ ] Hitting `/assets/generated/backdrops/bg-boot-480x270.png` in `next dev` returns 200.
- [ ] A typed helper resolves at least one backdrop and one spritesheet URL.
- [ ] No stale references to the old `assets/` root path remain (grep clean).
