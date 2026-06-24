// Fixed-timestep game loop.
//
// `update(dt)` runs at a fixed rate (default 60 Hz) regardless of display
// refresh, so simulation is deterministic and frame-rate independent. `render`
// runs once per animation frame and receives `alpha` — the fractional progress
// toward the next update — so callers can interpolate for smooth motion at any
// refresh rate. An accumulator decouples the two; a per-frame clamp stops the
// "spiral of death" when the tab was backgrounded or the machine stalled.

export interface LoopCallbacks {
  /** Advance the simulation by a fixed `dt` seconds. */
  update: (dt: number) => void
  /** Draw a frame. `alpha` ∈ [0,1) is interpolation toward the next update. */
  render: (alpha: number) => void
}

/** Longest real frame we'll simulate in one go (s). Caps catch-up after a stall. */
const MAX_FRAME_TIME = 0.25

export class GameLoop {
  private readonly step: number
  private readonly callbacks: LoopCallbacks
  private accumulator = 0
  private lastTime = 0
  private rafId = 0
  private running = false

  // Rolling FPS sampled over ~0.5s windows, for the on-canvas readout.
  private fps = 0
  private fpsFrames = 0
  private fpsElapsed = 0
  private ticks = 0

  constructor(callbacks: LoopCallbacks, updatesPerSecond = 60) {
    this.callbacks = callbacks
    this.step = 1 / updatesPerSecond
  }

  start(): void {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.accumulator = 0
    this.rafId = requestAnimationFrame(this.frame)
  }

  stop(): void {
    this.running = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }

  /** Suspend simulation (e.g. tab hidden) without tearing down state. */
  pause(): void {
    if (!this.running) return
    this.running = false
    if (this.rafId) cancelAnimationFrame(this.rafId)
    this.rafId = 0
  }

  /** Resume after a pause; drops the elapsed gap so we don't fast-forward. */
  resume(): void {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.accumulator = 0
    this.rafId = requestAnimationFrame(this.frame)
  }

  get currentFps(): number {
    return this.fps
  }

  get tickCount(): number {
    return this.ticks
  }

  private frame = (now: number): void => {
    if (!this.running) return

    let frameTime = (now - this.lastTime) / 1000
    this.lastTime = now
    if (frameTime > MAX_FRAME_TIME) frameTime = MAX_FRAME_TIME

    this.accumulator += frameTime
    while (this.accumulator >= this.step) {
      this.callbacks.update(this.step)
      this.accumulator -= this.step
      this.ticks++
    }

    this.callbacks.render(this.accumulator / this.step)

    this.fpsFrames++
    this.fpsElapsed += frameTime
    if (this.fpsElapsed >= 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsElapsed)
      this.fpsFrames = 0
      this.fpsElapsed = 0
    }

    this.rafId = requestAnimationFrame(this.frame)
  }
}
