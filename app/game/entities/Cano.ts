// Cano, the floating companion/orchestrator sprite. Hovers near Pix's head,
// easing toward an offset target each frame so it trails the player with a soft
// lag. Modes: `float` (default hover), `react` (happy bounce on a pickup),
// `point` (lean toward the nearest un-found Shard when the player idles). The
// scene sets the mode + point direction and owns the actual frame atlases.

import type { Player } from "./Player"

export type CanoMode = "float" | "react" | "point"

const OFFSET_X = 20
const OFFSET_Y = 34

export class Cano {
  x: number
  y: number
  mode: CanoMode = "float"
  /** Horizontal lean for `point` (+1 right, -1 left). */
  pointDir: 1 | -1 = 1
  private modeTimer = 0

  constructor(player: Player) {
    this.x = player.x + OFFSET_X
    this.y = player.y - OFFSET_Y
  }

  /** Temporarily switch mode; auto-reverts to `float` after `secs`. */
  setMode(mode: CanoMode, secs: number): void {
    this.mode = mode
    this.modeTimer = secs
  }

  update(dt: number, player: Player): void {
    if (this.modeTimer > 0) {
      this.modeTimer -= dt
      if (this.modeTimer <= 0) this.mode = "float"
    }

    // Float to the side Pix faces so Cano doesn't cover the path ahead.
    const targetX = player.x + OFFSET_X * player.facing
    const targetY = player.y - OFFSET_Y
    this.x += (targetX - this.x) * Math.min(1, dt * 6)
    this.y += (targetY - this.y) * Math.min(1, dt * 6)
  }
}
