# 0010. Accessibility, fallback page, performance & launch

- **Status:** backlog
- **Owner:** unassigned
- **Created:** 2026-06-24

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
- [ ] With JS off (or "Skip quest"), every section + the CTA are present in semantic HTML.
- [ ] `prefers-reduced-motion` disables motion; the game stays fully playable.
- [ ] Progress persists across reloads; a completed visitor returns to a lit studio.
- [ ] First load ≤ ~300 KB; later rooms lazy-load; Lighthouse + CWV pass.
- [ ] Favicon family and OG/Twitter cards resolve correctly in production.
