// Virtual-stage presenter: maps the fixed 480×270 logical canvas onto the real
// viewport at an integer scale, crisp at any device-pixel ratio.
//
// - Display size is VIRTUAL × `scale` CSS px (integer factor only → no fuzzy
//   half-pixels). The surrounding container is the letterbox.
// - Backing store is that CSS size × DPR device px, and the 2D context is
//   pre-scaled by `scale × dpr`, so all game code draws in plain virtual
//   coordinates (0..480, 0..270) and still lands on whole device pixels.
// - `clientToStage` inverts the mapping for pointer/touch input (0008d).

import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "./constants"

/** Integer scale that fits the virtual stage inside the available CSS box. */
export function computeScale(availWidth: number, availHeight: number): number {
  return Math.max(
    1,
    Math.floor(Math.min(availWidth / VIRTUAL_WIDTH, availHeight / VIRTUAL_HEIGHT)),
  )
}

export interface StagePoint {
  x: number
  y: number
}

export class Stage {
  readonly canvas: HTMLCanvasElement
  readonly ctx: CanvasRenderingContext2D
  scale = 1
  dpr = 1

  constructor(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("2D canvas context unavailable")
    this.canvas = canvas
    this.ctx = ctx
  }

  /** Recompute scale for the given available CSS box and resize the canvas. */
  resize(availWidth: number, availHeight: number): void {
    const dpr = window.devicePixelRatio || 1
    const scale = computeScale(availWidth, availHeight)
    const cssWidth = VIRTUAL_WIDTH * scale
    const cssHeight = VIRTUAL_HEIGHT * scale

    this.canvas.style.width = `${cssWidth}px`
    this.canvas.style.height = `${cssHeight}px`
    // Resizing the backing store resets context state, so reapply the transform.
    this.canvas.width = Math.round(cssWidth * dpr)
    this.canvas.height = Math.round(cssHeight * dpr)

    this.scale = scale
    this.dpr = dpr
    this.applyTransform()
  }

  private applyTransform(): void {
    const k = this.scale * this.dpr
    this.ctx.setTransform(k, 0, 0, k, 0, 0)
    this.ctx.imageSmoothingEnabled = false
  }

  /** Map a viewport point (e.g. `clientX/Y`) to virtual stage coordinates. */
  clientToStage(clientX: number, clientY: number): StagePoint {
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left) / this.scale,
      y: (clientY - rect.top) / this.scale,
    }
  }
}
