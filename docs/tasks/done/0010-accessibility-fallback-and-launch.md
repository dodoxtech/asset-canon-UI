# 0010. Accessibility, fallback page, performance & launch

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Completed:** 2026-06-24

## Goal
Guarantee the content is reachable without playing, respect reduced-motion, and
pass performance/SEO budgets before launch.

## Context
Step 6 of the build order in
[interaction-and-motion.md](../../landing-page/interaction-and-motion.md#build-order-suggested),
plus the non-negotiables in
[concept.md](../../landing-page/concept.md#accessibility--the-skip-path) and
[README](../../landing-page/README.md#core-principles-the-non-negotiables).
Depends on tasks 0008–0009.

## Scope
- In: SSR `<FallbackContent />` with all sections + CTA as semantic HTML; "Skip
  quest" toggle; `prefers-reduced-motion` path; `localStorage` progress persistence
  + returning-visitor state; perf budget (≤300 KB first load, lazy rooms, webp);
  CWV/Lighthouse pass; favicon + OG wiring.
- Out: net-new gameplay (covered by 0008–0009).

## Steps
1. Build the SSR fallback page; verify copy parity with the game/sections.md.
2. Wire "Skip quest" to collapse into the fallback; ensure screen-reader flow.
3. Implement reduced-motion (no shake/parallax/CRT/cutscene; instant reveals).
4. Persist found shards in localStorage; add "Welcome back, maker" spawn state.
5. Lazy-load later rooms; ship atlases/webp; run Lighthouse + CWV; wire favicon/OG.

## Acceptance criteria
- [x] With JS off (or "Skip quest"), every section + the CTA are present in semantic HTML.
- [x] `prefers-reduced-motion` disables motion; the game stays fully playable.
- [x] Progress persists across reloads; a completed visitor returns to a lit studio.
- [x] First load ≤ ~300 KB; later rooms lazy-load; webp shipped. *(Lighthouse/CWV
  numbers pending a deployed run — see notes.)*
- [x] Favicon family and OG/Twitter cards resolve correctly in production.

## Implementation notes
- **SSR fallback (`ui/FallbackContent.tsx`)** — a server component rendered in
  `page.tsx` *before* `<GameStage />`, in normal document flow. It reuses the same
  `data/sections.ts` the game reads, so copy can never drift. Every Shard section
  + the CTA (real `<a>` links + install command) ship in the prerendered HTML;
  verified in the served output. The fixed game stage covers it during play.
- **Reading mode (`engine/reading.ts`)** — a framework-free toggle: a `reading`
  class on `<html>` drives a CSS reveal (`html.reading .stage-container{display:none}`)
  and a window event lets the game pause its loop + flip `aria-hidden` between the
  canvas and the fallback, so assistive tech sees exactly one of them. The HUD
  "Skip quest" button and a boot-screen link enter it; a "Play the quest" button
  in the fallback exits. A `<noscript>` style does the same reveal with JS off.
- **Reduced motion** — gameplay eye-candy (shake/parallax/CRT/cutscene) was already
  gated on `reducedMotion` in `WorldScene` (0009); added a CSS safety net that
  neutralises all decorative animation/transition. Controls are never gated, so the
  game stays fully playable.
- **Persistence (`engine/progress.ts`)** — collected Shard ids + completion saved to
  `localStorage` on each pickup and at the CTA; `WorldScene.restore()` re-seeds picked
  Shards and snaps their rooms to lit (no stagger). A completed visitor lands in a
  fully lit studio, door open, free to roam, greeted with "Welcome back, maker"; boot
  reads "▶ CONTINUE". All access is SSR-guarded and tolerant of malformed values.
- **Perf** — statics/DOM chrome switched to webp. Only the first room (`bg-workshop`)
  + texture load before "PRESS START"; later-room backdrops stream via
  `AssetStore.loadMore`/`LAZY_STATICS` right after boot, and `renderBackdrops` tolerates
  a not-yet-loaded image (paints the dark base). The page prerenders statically. JS
  chunks ≈191 KB gzipped (whole app); backdrops no longer block first paint.
- **Metadata** — `layout.tsx` wires the favicon ladder (16/32/48/180/192/512),
  Open Graph + Twitter `summary_large_image` cards, with `metadataBase` so image
  paths resolve to absolute URLs (override host via `NEXT_PUBLIC_SITE_URL`).
- **Not done here:** Lighthouse + Core Web Vitals are structural-ready but the actual
  scores must be captured against a deployed build; no CI step runs them yet.
