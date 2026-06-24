// Input layer: normalizes keyboard, click/tap-to-walk, and touch-drag into two
// queries the scene reads each update —
//   - direction(): a unit movement vector held *this frame* (keyboard or an
//     active touch/mouse drag acting as a virtual joystick), or {0,0}.
//   - takeWalkTarget(): a one-shot tap point in stage coords (the scene maps it
//     to world space and walks the player there).
//
// All pointer math is in virtual stage coordinates via Stage.clientToStage, so
// it stays correct across integer scales and DPR.

import type { Stage, StagePoint } from "./Stage"

const MOVE_KEYS = new Set([
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "a",
  "d",
  "w",
  "s",
  "A",
  "D",
  "W",
  "S",
])

/** Drag past this many stage px = joystick intent, not a tap. */
const DRAG_DEADZONE = 4
/** Drag distance (stage px) that maps to full-speed movement. */
const DRAG_FULL = 22

export class Input {
  private readonly stage: Stage
  private readonly target: HTMLElement
  private readonly keys = new Set<string>()

  private pointerId: number | null = null
  private start: StagePoint | null = null
  private current: StagePoint | null = null
  private dragging = false
  private pendingTap: StagePoint | null = null

  constructor(stage: Stage) {
    this.stage = stage
    this.target = stage.canvas
  }

  attach(): void {
    window.addEventListener("keydown", this.onKeyDown)
    window.addEventListener("keyup", this.onKeyUp)
    this.target.addEventListener("pointerdown", this.onPointerDown)
    this.target.addEventListener("pointermove", this.onPointerMove)
    this.target.addEventListener("pointerup", this.onPointerUp)
    this.target.addEventListener("pointercancel", this.onPointerUp)
  }

  detach(): void {
    window.removeEventListener("keydown", this.onKeyDown)
    window.removeEventListener("keyup", this.onKeyUp)
    this.target.removeEventListener("pointerdown", this.onPointerDown)
    this.target.removeEventListener("pointermove", this.onPointerMove)
    this.target.removeEventListener("pointerup", this.onPointerUp)
    this.target.removeEventListener("pointercancel", this.onPointerUp)
    this.keys.clear()
  }

  /** Unit movement direction held this frame, or {0,0} if idle. */
  direction(): StagePoint {
    let kx = 0
    let ky = 0
    if (this.keys.has("ArrowLeft") || this.keys.has("a") || this.keys.has("A")) kx -= 1
    if (this.keys.has("ArrowRight") || this.keys.has("d") || this.keys.has("D")) kx += 1
    if (this.keys.has("ArrowUp") || this.keys.has("w") || this.keys.has("W")) ky -= 1
    if (this.keys.has("ArrowDown") || this.keys.has("s") || this.keys.has("S")) ky += 1
    if (kx || ky) return normalize(kx, ky)

    if (this.dragging && this.start && this.current) {
      const dx = this.current.x - this.start.x
      const dy = this.current.y - this.start.y
      const len = Math.hypot(dx, dy)
      if (len > DRAG_DEADZONE) {
        // Magnitude scales toward full speed but direction is what movement uses.
        const mag = Math.min(1, len / DRAG_FULL)
        const u = normalize(dx, dy)
        return { x: u.x * mag, y: u.y * mag }
      }
    }
    return { x: 0, y: 0 }
  }

  /** Consume a pending tap target (stage coords), if any. */
  takeWalkTarget(): StagePoint | null {
    const t = this.pendingTap
    this.pendingTap = null
    return t
  }

  private onKeyDown = (e: KeyboardEvent): void => {
    if (MOVE_KEYS.has(e.key)) {
      this.keys.add(e.key)
      e.preventDefault()
    }
  }

  private onKeyUp = (e: KeyboardEvent): void => {
    this.keys.delete(e.key)
  }

  private onPointerDown = (e: PointerEvent): void => {
    if (this.pointerId !== null) return
    this.pointerId = e.pointerId
    this.start = this.stage.clientToStage(e.clientX, e.clientY)
    this.current = this.start
    this.dragging = false
    this.target.setPointerCapture(e.pointerId)
    e.preventDefault()
  }

  private onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId || !this.start) return
    this.current = this.stage.clientToStage(e.clientX, e.clientY)
    const len = Math.hypot(this.current.x - this.start.x, this.current.y - this.start.y)
    if (len > DRAG_DEADZONE) this.dragging = true
  }

  private onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId !== this.pointerId) return
    // A press that never became a drag is a tap → walk toward it.
    if (!this.dragging && this.start) this.pendingTap = this.start
    this.pointerId = null
    this.start = null
    this.current = null
    this.dragging = false
  }
}

function normalize(x: number, y: number): StagePoint {
  const len = Math.hypot(x, y)
  return len === 0 ? { x: 0, y: 0 } : { x: x / len, y: y / len }
}
