# 0008c. Virtual-stage scaling + responsive desktop/phone

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Parent:** [0008](0008-build-engine-mvp.md)

## Goal
Render the 480×270 virtual stage crisp and centered at an integer scale, filling
the viewport with letterbox bars, and make the page itself responsive and
fullscreen on desktop and phone (portrait + landscape).

## Why (the responsive requirement)
The experience must be playable on any desktop and any phone. That means the
canvas fits the available viewport without scrolling, respects device pixel
ratio for crispness, and accounts for mobile chrome (URL bar, safe-area insets).

## Scope
- In: integer-factor scaling of the 480×270 stage, centered with letterbox;
  recompute on resize/orientation; DPR-aware backing store; page-level layout
  (full-viewport, no scroll, viewport meta, safe areas).
- Out: input/touch controls (0008d), gameplay.

## Steps
1. Compute `scale = max(1, floor(min(vw/480, vh/270)))`; center the stage and
   fill the remainder with letterbox (CSS background or canvas bars).
2. Size the canvas backing store by `scale * DPR`; keep nearest-neighbor
   (`image-rendering: pixelated`, no smoothing) so pixels stay sharp.
3. Recompute on `resize` and `orientationchange` (debounced/rAF-coalesced).
4. Page layout: `100dvh`, no body scroll, `viewport-fit=cover` + `<meta viewport>`
   with `maximum-scale`/`user-scalable` tuned for a game; honor `env(safe-area-*)`.
5. Sanity-check small phones (≤360px wide) still get a usable integer scale (≥1).

## Acceptance criteria
- [ ] Stage scales by integer factor only, centered, with letterbox bars.
- [ ] Recomputes correctly on window resize and phone orientation change.
- [ ] Pixels render crisp (nearest-neighbor) at all DPRs.
- [ ] No page scroll/overflow; fills viewport on desktop and phone, both orientations.
- [ ] Safe-area insets respected (notch/home-indicator not overlapped).
