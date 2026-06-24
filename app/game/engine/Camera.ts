// Dead-zone follow camera. The camera only scrolls when the target leaves a
// centered dead-zone box, then clamps to the room so no out-of-room area shows.
// Position is the top-left of the view (the virtual stage) in world space.

import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "./constants"

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v
}

export interface Vec2 {
  x: number
  y: number
}

export class Camera {
  x = 0
  y = 0

  /** Width/height of the centered dead-zone the target can roam without scroll. */
  constructor(
    private readonly deadWidth = 120,
    private readonly deadHeight = 80,
  ) {}

  follow(target: Vec2, worldWidth: number, worldHeight: number): void {
    const left = this.x + (VIRTUAL_WIDTH - this.deadWidth) / 2
    const right = this.x + (VIRTUAL_WIDTH + this.deadWidth) / 2
    const top = this.y + (VIRTUAL_HEIGHT - this.deadHeight) / 2
    const bottom = this.y + (VIRTUAL_HEIGHT + this.deadHeight) / 2

    if (target.x < left) this.x -= left - target.x
    else if (target.x > right) this.x += target.x - right
    if (target.y < top) this.y -= top - target.y
    else if (target.y > bottom) this.y += target.y - bottom

    this.x = clamp(this.x, 0, Math.max(0, worldWidth - VIRTUAL_WIDTH))
    this.y = clamp(this.y, 0, Math.max(0, worldHeight - VIRTUAL_HEIGHT))
  }
}
