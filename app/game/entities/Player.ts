// Pix, the hero. Position is the sprite's *feet* (bottom-center) in world space,
// matching the [0.5,1] sprite anchor so the character plants on the floor. The
// collision box is a smaller body rect centred above the feet. Movement comes
// from a held direction (keyboard / drag joystick) or a tap walk-target, clamped
// to the room width and the walkable floor band.

import type { StagePoint } from "../engine/Stage"
import { FEET_MAX, FEET_MIN, WORLD_WIDTH } from "../data/rooms"

/** Pixels/second at full speed (virtual units). */
const SPEED = 96

export class Player {
  /** Collision body box (smaller than the 16×24 sprite). */
  readonly width = 12
  readonly height = 16
  facing: 1 | -1 = 1
  moving = false
  /** Slumped "overwhelmed maker" posture until the first Shard lights the studio. */
  tired = true
  /** Seconds remaining of the pickup cheer animation. */
  cheer = 0
  walkTarget: StagePoint | null = null

  constructor(
    /** Horizontal centre. */
    public x: number,
    /** Feet (bottom). */
    public y: number,
  ) {}

  /** Centre of the collision body (for overlap tests). */
  get cx(): number {
    return this.x
  }
  get cy(): number {
    return this.y - this.height / 2
  }

  startCheer(): void {
    this.cheer = 0.5
    this.walkTarget = null
    this.moving = false
  }

  update(dt: number, dir: StagePoint): void {
    if (this.cheer > 0) {
      this.cheer = Math.max(0, this.cheer - dt)
      return
    }

    let vx = 0
    let vy = 0
    const held = dir.x !== 0 || dir.y !== 0
    if (held) {
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
    this.moving = vx !== 0 || vy !== 0
    if (vx !== 0) this.facing = vx < 0 ? -1 : 1

    const halfW = this.width / 2
    this.x = clamp(this.x, halfW, WORLD_WIDTH - halfW)
    this.y = clamp(this.y, FEET_MIN, FEET_MAX)
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}
