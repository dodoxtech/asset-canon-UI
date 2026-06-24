// Grey-box player. Position is the box *center* in world coordinates (keeps
// movement and camera-follow math symmetric). Moves from a held direction
// (keyboard / drag joystick) or walks toward a tap target, clamped to the room.

import type { StagePoint } from "../engine/Stage"

/** Pixels/second at full speed (virtual units). */
const SPEED = 88

export class Player {
  width = 12
  height = 16
  walkTarget: StagePoint | null = null

  constructor(
    public x: number,
    public y: number,
  ) {}

  /** `dir` is a (sub-)unit vector; its magnitude scales speed (for drag). */
  update(
    dt: number,
    dir: StagePoint,
    worldWidth: number,
    worldHeight: number,
  ): void {
    let vx = 0
    let vy = 0

    const held = dir.x !== 0 || dir.y !== 0
    if (held) {
      // A held direction overrides any in-progress walk-to-target.
      this.walkTarget = null
      vx = dir.x * SPEED
      vy = dir.y * SPEED
    } else if (this.walkTarget) {
      const dx = this.walkTarget.x - this.x
      const dy = this.walkTarget.y - this.y
      const dist = Math.hypot(dx, dy)
      if (dist <= SPEED * dt || dist < 0.5) {
        this.x = this.walkTarget.x
        this.y = this.walkTarget.y
        this.walkTarget = null
      } else {
        vx = (dx / dist) * SPEED
        vy = (dy / dist) * SPEED
      }
    }

    this.x += vx * dt
    this.y += vy * dt

    const halfW = this.width / 2
    const halfH = this.height / 2
    this.x = clamp(this.x, halfW, worldWidth - halfW)
    this.y = clamp(this.y, halfH, worldHeight - halfH)
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}
