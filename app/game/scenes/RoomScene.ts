// One room, larger than the stage, with a flat grey-box backdrop. Owns the
// player and the dead-zone camera and renders everything through the camera
// transform. This is the seam where 0008e (collectible/HUD) and 0008f
// (dialogue) hook in.

import { Camera } from "../engine/Camera"
import { EventBus, type GameEvents } from "../engine/EventBus"
import type { Input } from "../engine/Input"
import type { Stage } from "../engine/Stage"
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "../engine/constants"
import { Collectible } from "../entities/Collectible"
import { Player } from "../entities/Player"
import { renderHud } from "../ui/Hud"

/** Shards needed to complete a run (drives the `n/5` HUD). */
const TOTAL_SHARDS = 5

export class RoomScene {
  readonly worldWidth = 960
  readonly worldHeight = 540

  readonly player = new Player(this.worldWidth / 2, this.worldHeight / 2)
  readonly camera = new Camera()
  readonly events = new EventBus<GameEvents>()

  // One collectible for the MVP, at a fixed tile off to the side.
  private readonly collectibles = [
    new Collectible("shard-0", this.worldWidth / 2 + 160, this.worldHeight / 2 - 96),
  ]
  shards = 0

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

    this.checkPickups()
  }

  private checkPickups(): void {
    this.collectibles.forEach((c, index) => {
      if (c.picked || !c.overlaps(this.player)) return
      c.picked = true // guards double-count in a single frame
      this.shards += 1
      this.events.emit("pickup", { id: c.id, index })
    })
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

    // Collectibles (skip picked ones).
    ctx.fillStyle = "#ffc83c"
    for (const c of this.collectibles) {
      if (c.picked) continue
      ctx.fillRect(
        Math.round(c.x - c.width / 2) - camX,
        Math.round(c.y - c.height / 2) - camY,
        c.width,
        c.height,
      )
    }

    // Player box.
    const p = this.player
    ctx.fillStyle = "#3ce07a"
    ctx.fillRect(
      Math.round(p.x - p.width / 2) - camX,
      Math.round(p.y - p.height / 2) - camY,
      p.width,
      p.height,
    )

    // HUD overlay, pinned in stage space (drawn last, over the world).
    renderHud(stage, this.shards, TOTAL_SHARDS)
  }
}
