// Sprite drawing + frame-clock helpers built on the AssetStore atlases.
//
// `drawFrame` blits one atlas frame at a world position, honouring the frame's
// authored anchor (so a [0.5,1] sprite plants on the floor at its feet) and an
// optional horizontal flip for left-facing walk. `Anim` is a tiny frame clock:
// advance it by dt and read `frame` — it loops a sub-range at the atlas fps, or
// plays it once and reports `done` for one-shots (pickup cheer, lock break).

import type { Atlas } from "./Assets"

export interface DrawOptions {
  /** Mirror horizontally about the anchor (face left). */
  flip?: boolean
  /** 0..1 opacity. */
  alpha?: number
  /** Multiply draw size (kept integer-friendly for crispness). */
  scale?: number
}

/**
 * Draw atlas frame `index` so its anchor lands on (x, y) in the *current*
 * context space. Callers pass already-camera-offset coordinates.
 */
export function drawFrame(
  ctx: CanvasRenderingContext2D,
  atlas: Atlas,
  index: number,
  x: number,
  y: number,
  opts: DrawOptions = {},
): void {
  const f = atlas.frames[Math.max(0, Math.min(index, atlas.frames.length - 1))]
  if (!f) return
  // Frame rects are in source pixels; divide by density to get the logical
  // (world) draw size, so higher-density art stays the same size in-game but
  // samples from a richer source for extra on-screen detail.
  const scale = (opts.scale ?? 1) / atlas.density
  const w = f.w * scale
  const h = f.h * scale
  const [ax, ay] = atlas.anchor
  // Top-left of the destination, anchored and pixel-snapped.
  const dx = Math.round(x - w * ax)
  const dy = Math.round(y - h * ay)

  const prevAlpha = ctx.globalAlpha
  if (opts.alpha != null) ctx.globalAlpha = opts.alpha

  if (opts.flip) {
    ctx.save()
    ctx.translate(dx + w, dy)
    ctx.scale(-1, 1)
    ctx.drawImage(atlas.image, f.x, f.y, f.w, f.h, 0, 0, w, h)
    ctx.restore()
  } else {
    ctx.drawImage(atlas.image, f.x, f.y, f.w, f.h, dx, dy, w, h)
  }

  ctx.globalAlpha = prevAlpha
}

/** Frame clock over an atlas (or a sub-clip of it). */
export class Anim {
  private t = 0
  frame: number
  done = false

  constructor(
    atlas: Atlas,
    private readonly loop = true,
    /** Inclusive frame range; defaults to the whole sheet. */
    private readonly from = 0,
    private readonly to = atlas.count - 1,
    private readonly fps = atlas.fps,
  ) {
    this.frame = from
  }

  reset(): void {
    this.t = 0
    this.frame = this.from
    this.done = false
  }

  update(dt: number): void {
    if (this.done) return
    const span = this.to - this.from + 1
    this.t += dt
    const step = 1 / Math.max(1, this.fps)
    while (this.t >= step) {
      this.t -= step
      const local = this.frame - this.from + 1
      if (local >= span) {
        if (this.loop) {
          this.frame = this.from
        } else {
          this.frame = this.to
          this.done = true
          return
        }
      } else {
        this.frame = this.from + local
      }
    }
  }
}
