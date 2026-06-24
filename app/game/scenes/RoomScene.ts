// One room, larger than the stage, with a flat grey-box backdrop. Owns the
// player and the dead-zone camera and renders everything through the camera
// transform. This is the seam where 0008e (collectible/HUD) and 0008f
// (dialogue) hook in.

import { Camera } from "../engine/Camera"
import type { Input } from "../engine/Input"
import type { Stage } from "../engine/Stage"
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "../engine/constants"
import { Player } from "../entities/Player"

export class RoomScene {
  readonly worldWidth = 960
  readonly worldHeight = 540

  readonly player = new Player(this.worldWidth / 2, this.worldHeight / 2)
  readonly camera = new Camera()

  constructor() {
    // Centre the camera on the player at start.
    this.camera.follow(this.player, this.worldWidth, this.worldHeight)
  }

  update(dt: number, input: Input): void {
    const tap = input.takeWalkTarget()
    if (tap) {
      // Tap is in stage coords; offset by the camera to get a world target.
      this.player.walkTarget = {
        x: tap.x + this.camera.x,
        y: tap.y + this.camera.y,
      }
    }

    this.player.update(dt, input.direction(), this.worldWidth, this.worldHeight)
    this.camera.follow(this.player, this.worldWidth, this.worldHeight)
  }

  render(stage: Stage): void {
    const ctx = stage.ctx
    // Integer camera offset keeps drawn pixels aligned (crisp).
    const camX = Math.round(this.camera.x)
    const camY = Math.round(this.camera.y)

    // Backdrop fill.
    ctx.fillStyle = "#141a30"
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)

    // Grid so motion/scrolling is visible (drawn through the camera).
    ctx.fillStyle = "#1e2a44"
    const grid = 32
    const startX = -((camX % grid) + grid) % grid
    const startY = -((camY % grid) + grid) % grid
    for (let x = startX; x < VIRTUAL_WIDTH; x += grid) {
      ctx.fillRect(x, 0, 1, VIRTUAL_HEIGHT)
    }
    for (let y = startY; y < VIRTUAL_HEIGHT; y += grid) {
      ctx.fillRect(0, y, VIRTUAL_WIDTH, 1)
    }

    // Room border (world edges), so the clamp is visible.
    ctx.strokeStyle = "#324063"
    ctx.lineWidth = 1
    ctx.strokeRect(
      0.5 - camX,
      0.5 - camY,
      this.worldWidth - 1,
      this.worldHeight - 1,
    )

    // Player box.
    const p = this.player
    ctx.fillStyle = "#3ce07a"
    ctx.fillRect(
      Math.round(p.x - p.width / 2) - camX,
      Math.round(p.y - p.height / 2) - camY,
      p.width,
      p.height,
    )
  }
}
