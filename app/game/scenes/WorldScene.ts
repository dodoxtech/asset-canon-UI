// The whole playable world: six rooms on one horizontal map, the player, the
// Cano companion, all collectibles, the per-room "lights-up" rewards, the FX
// layer, the assemble cutscene, the final door, and the CTA chest. Backdrops and
// sprites come from the AssetStore; copy/layout from data/. The scene owns a
// small phase machine (`play → cutscene → cta`) and emits gameplay events the
// React shell turns into the dialogue window, Cano bubbles, minimap and CTA panel.

import type { AssetStore, Atlas } from "../engine/Assets"
import { Camera } from "../engine/Camera"
import { EventBus, type GameEvents } from "../engine/EventBus"
import type { Input } from "../engine/Input"
import type { Stage } from "../engine/Stage"
import { VIRTUAL_HEIGHT, VIRTUAL_WIDTH } from "../engine/constants"
import { Anim, drawFrame } from "../engine/Sprite"
import { audio } from "../engine/Audio"
import { Player } from "../entities/Player"
import { Cano } from "../entities/Cano"
import { Collectible } from "../entities/Collectible"
import {
  CHEST_X,
  DOOR_X,
  FLOOR_Y,
  ROOM_WIDTH,
  SPAWN_X,
  WORLD_WIDTH,
  rooms,
  roomIndexAt,
  type RewardKind,
} from "../data/rooms"
import { renderHud } from "../ui/Hud"

const TOTAL_SHARDS = 5
/** Seconds of pickup beat (sparkle/shake/cheer) before the section panel opens. */
const PICKUP_BEAT = 0.45
/** Idle seconds before Cano points to the nearest un-found Shard. */
const IDLE_NUDGE = 6

interface Fx {
  atlas: Atlas
  anim: Anim
  x: number
  y: number
  additive?: boolean
}

interface Flyer {
  atlas: Atlas
  /** Stage-space (screen) path. */
  x: number
  y: number
  fromX: number
  fromY: number
  toX: number
  toY: number
  t: number
}

interface FloatText {
  text: string
  x: number
  y: number
  t: number
}

type Phase = "play" | "cutscene" | "cta"

const ROOM_HINTS: Record<string, string> = {
  workshop: "Your studio. Grab the green Shard to wake it up.",
  hallway: "The pipeline rig — find the Scroll to run it.",
  gallery: "Five empty frames... the Keyring fills them.",
  archive: "Shelves of scrolls. The Rune brings order.",
  forge: "A cold forge. The Cog relights it.",
}
const NUDGES = [
  "Psst — a Shard's that way.",
  "Still some to find. Keep moving!",
  "Over here, maker.",
]

export class WorldScene {
  readonly events = new EventBus<GameEvents>()
  readonly player = new Player(SPAWN_X, FLOOR_Y)
  readonly cano = new Cano(this.player)
  private readonly camera = new Camera()

  shards = 0
  phase: Phase = "play"
  reducedMotion = false

  private readonly collectibles: Collectible[]
  /** Per-room lit flag + seconds since it lit (drives staggered reveals). */
  private readonly lit: boolean[] = rooms.map(() => false)
  private readonly litTime: number[] = rooms.map(() => 0)
  private readonly visited: boolean[] = rooms.map(() => false)

  // Animators
  private readonly anims: Record<string, Anim> = {}
  private readonly collectibleAnims = new Map<string, Anim>()

  // Transient layers
  private fx: Fx[] = []
  private flyers: Flyer[] = []
  private floats: FloatText[] = []

  // Beat / idle timers
  private beatTimer = 0
  private beatId: string | null = null
  private idleTime = 0
  private nudgeCooldown = 0

  // Shake
  private shakeT = 0
  private shakeMag = 0

  // Cutscene + door
  private cutT = 0
  private assembleStarted = false
  private doorState: "locked" | "breaking" | "open" = "locked"
  private keyDropped = false
  private chestOpen = false
  private panGoal: number | null = null

  // Ambient dust motes (fixed screen positions, parallax-ish drift)
  private moteOffset = 0

  constructor(private readonly assets: AssetStore) {
    this.collectibles = rooms
      .filter((r) => r.shard)
      .map((r) => new Collectible(r.shard!.id, r.shard!.atlas, r.shard!.x, r.shard!.y))

    // Player / Cano animators.
    this.anims.tired = this.anim("pix-idle-tired")
    this.anims.idle = this.anim("pix-idle")
    this.anims.walk = this.anim("pix-walk")
    this.anims.pickup = this.anim("pix-pickup", false)
    this.anims.canoFloat = this.anim("cano-float")
    this.anims.canoReact = this.anim("cano-react")
    this.anims.canoPoint = this.anim("cano-point")

    // Reward / prop animators.
    this.anims.conveyor = this.anim("prop-conveyor-belt")
    this.anims.scroll = this.anim("prop-scroll-shelf")
    this.anims.furnace = this.anim("prop-furnace", true, 1, 4)
    this.anims.anvil = this.anim("prop-anvil-sparks")
    this.anims.lamp = this.anim("prop-lamp")
    this.anims.motes = this.anim("fx-dust-motes")
    this.anims.canonArtifact = this.anim("canon-artifact")
    this.anims.keyCanon = this.anim("key-canon")

    // Per-collectible spin loops.
    for (const c of this.collectibles) {
      this.collectibleAnims.set(c.id, this.anim(c.atlas))
    }

    this.camera.follow(this.player, WORLD_WIDTH, VIRTUAL_HEIGHT)
    this.markVisit(roomIndexAt(this.player.x))
  }

  private anim(id: string, loop = true, from?: number, to?: number): Anim {
    const a = this.assets.atlas(id)
    return new Anim(a, loop, from ?? 0, to ?? a.count - 1)
  }

  // --- Public control surface (called from the React shell) ---

  /** Ids of Shards collected so far (for localStorage persistence). */
  collectedIds(): string[] {
    return this.collectibles.filter((c) => c.picked).map((c) => c.id)
  }

  /**
   * Re-seed scene state for a returning visitor (persisted progress). Collected
   * Shards are marked found and their rooms snap to fully lit (no staggered
   * reveal); a completed visitor lands in a fully lit studio with the door open,
   * the Canon assembled, but free to roam — no cutscene replays.
   */
  restore(shardIds: string[], complete: boolean): void {
    for (const c of this.collectibles) {
      if (!shardIds.includes(c.id)) continue
      c.picked = true
      this.shards += 1
      const room = rooms.find((r) => r.shard?.id === c.id)
      if (room) {
        this.lit[room.index] = true
        this.litTime[room.index] = 99 // past every stagger threshold → instant
      }
      if (c.id === "shard-canon") this.player.tired = false
    }

    if (complete) {
      this.lit.forEach((_, i) => {
        this.lit[i] = true
        this.litTime[i] = 99
      })
      this.shards = TOTAL_SHARDS
      this.player.tired = false
      this.assembleStarted = true
      this.keyDropped = true
      this.doorState = "open"
      this.chestOpen = true
      this.visited.forEach((_, i) => {
        if (!this.visited[i]) {
          this.visited[i] = true
          this.events.emit("visit", { index: i })
        }
      })
    }
  }

  /** Begin the assemble cutscene once all five Shards are in. */
  startAssemble(): void {
    if (this.assembleStarted) return
    this.assembleStarted = true
    this.phase = "cutscene"
    this.cutT = 0
    this.player.startCheer()
    this.events.emit("phase", { phase: "cutscene" })
    if (this.reducedMotion) this.skipCutscene()
  }

  /** Jump straight to the end of the cutscene (skip / reduced-motion). */
  skipCutscene(): void {
    if (this.phase !== "cutscene") return
    this.keyDropped = true
    this.doorState = "open"
    this.phase = "cta"
    this.camera.x = clampCam(CHEST_X - VIRTUAL_WIDTH / 2)
    this.panGoal = null
    this.chestOpen = true
    this.markVisit(rooms.length - 1)
    audio.play("fanfare")
    this.events.emit("phase", { phase: "cta" })
  }

  /** Skip the quest: light everything, collect all, jump to the CTA payoff. */
  skipQuest(): void {
    if (this.phase === "cta") return
    for (const c of this.collectibles) c.picked = true
    this.shards = TOTAL_SHARDS
    this.player.tired = false
    this.lit.forEach((_, i) => {
      this.lit[i] = true
      this.litTime[i] = 99
    })
    this.visited.fill(true)
    this.assembleStarted = true
    this.beatTimer = 0
    this.beatId = null
    this.phase = "cutscene"
    this.skipCutscene()
  }

  /** True once all five Shards are collected (the shell starts the cutscene). */
  get allShardsFound(): boolean {
    return this.shards >= TOTAL_SHARDS
  }

  /** Whether the assemble cutscene has already been kicked off. */
  get assembleInProgress(): boolean {
    return this.assembleStarted
  }

  /** Minimap fast-travel to a visited room (re-centres player + camera). */
  fastTravel(index: number): void {
    if (!this.visited[index]) return
    const cx = index * ROOM_WIDTH + ROOM_WIDTH / 2
    const gate = this.gateX()
    this.player.x = Math.min(cx, gate)
    this.player.y = FLOOR_Y
    this.player.walkTarget = null
    this.camera.x = clampCam(cx - VIRTUAL_WIDTH / 2)
    audio.play("blip")
  }

  // --- Update ---

  update(dt: number, input: Input): void {
    this.tickTimers(dt)
    this.updateAnims(dt)

    if (this.phase === "cutscene") {
      this.updateCutscene(dt, input)
    } else {
      this.updatePlay(dt, input)
    }

    this.updateFx(dt)
    this.camera.x = clampCam(this.camera.x)
  }

  private tickTimers(dt: number): void {
    if (this.shakeT > 0) this.shakeT = Math.max(0, this.shakeT - dt)
    if (this.nudgeCooldown > 0) this.nudgeCooldown -= dt
    this.moteOffset = (this.moteOffset + dt * 6) % 64
    for (let i = 0; i < this.lit.length; i++) {
      if (this.lit[i]) this.litTime[i] += dt
    }
    // Resolve the pickup beat → open the section panel.
    if (this.beatTimer > 0) {
      this.beatTimer -= dt
      if (this.beatTimer <= 0 && this.beatId) {
        this.events.emit("pickup", { id: this.beatId })
        this.beatId = null
      }
    }
  }

  private updateAnims(dt: number): void {
    for (const a of Object.values(this.anims)) a.update(dt)
    for (const a of this.collectibleAnims.values()) a.update(dt)
  }

  private updatePlay(dt: number, input: Input): void {
    // A pending dialogue beat freezes movement (the cheer plays out).
    const frozen = this.beatTimer > 0
    const tap = input.takeWalkTarget()
    if (tap && !frozen) {
      this.player.walkTarget = { x: tap.x + this.camera.x, y: tap.y }
    }

    const dir = frozen ? { x: 0, y: 0 } : input.direction()
    this.player.update(dt, dir)

    // Gate the player at the locked door until it opens.
    const gate = this.gateX()
    if (this.player.x > gate) this.player.x = gate

    this.cano.update(dt, this.player)
    this.camera.follow(this.player, WORLD_WIDTH, VIRTUAL_HEIGHT)
    this.camera.y = 0

    this.markVisit(roomIndexAt(this.player.x))
    this.checkPickups()
    this.tickIdleNudge(dt)
  }

  private tickIdleNudge(dt: number): void {
    const remaining = this.collectibles.some((c) => !c.picked)
    if (this.player.moving || this.beatTimer > 0 || !remaining) {
      this.idleTime = 0
      return
    }
    this.idleTime += dt
    if (this.idleTime >= IDLE_NUDGE && this.nudgeCooldown <= 0) {
      this.idleTime = 0
      this.nudgeCooldown = 8
      const nearest = this.nearestUnfound()
      if (nearest) {
        this.cano.pointDir = nearest.x < this.player.x ? -1 : 1
        this.cano.setMode("point", 2.5)
        this.emitCano(NUDGES[Math.floor(Math.random() * NUDGES.length)])
      }
    }
  }

  private nearestUnfound(): Collectible | null {
    let best: Collectible | null = null
    let bestD = Infinity
    for (const c of this.collectibles) {
      if (c.picked) continue
      const d = Math.abs(c.x - this.player.x)
      if (d < bestD) {
        bestD = d
        best = c
      }
    }
    return best
  }

  private checkPickups(): void {
    if (this.beatTimer > 0) return
    for (const c of this.collectibles) {
      if (c.picked) continue
      if (!c.overlaps(this.player.cx, this.player.cy, this.player.width, this.player.height)) {
        continue
      }
      this.collect(c)
      break
    }
  }

  private collect(c: Collectible): void {
    c.picked = true
    this.shards += 1
    this.player.startCheer()
    this.anims.pickup.reset()
    this.cano.setMode("react", 1.2)
    audio.play("coin")
    this.shake(2, 0.12)

    // Sparkle at the shard + arc a copy to the HUD pip that will fill.
    this.spawnFx("fx-sparkle", c.x, c.y)
    this.spawnFlyer(c)
    this.floats.push({ text: "+1", x: c.x - this.camera.x, y: c.y - 8, t: 0 })

    // Fire the room's lights-up reward.
    const room = rooms.find((r) => r.shard?.id === c.id)
    if (room) this.lightUp(room.index, room.reward)
    if (c.id === "shard-canon") this.player.tired = false // studio main light

    // Queue the section panel after the beat.
    this.beatTimer = PICKUP_BEAT
    this.beatId = c.id
  }

  private lightUp(index: number, reward: RewardKind | null): void {
    if (this.lit[index]) return
    this.lit[index] = true
    this.litTime[index] = 0
    if (reward === "forge") {
      // Forge keeps a looping spark once lit.
      this.anims.anvil.reset()
    }
  }

  private updateCutscene(dt: number, input: Input): void {
    // Any tap skips to the end; keyboard skip is forwarded from the shell.
    if (input.takeWalkTarget()) {
      this.skipCutscene()
      return
    }
    this.cano.update(dt, this.player)
    this.cutT += dt

    // Timeline (skippable): orbit → fuse/flash → key drop → door break → pan.
    if (!this.keyDropped && this.cutT >= 1.6) {
      this.keyDropped = true
      audio.play("clunk")
      this.shake(4, 0.18)
    }
    if (this.doorState === "locked" && this.cutT >= 2.0) {
      this.doorState = "breaking"
      audio.play("shatter")
      this.shake(6, 0.2)
    }
    if (this.doorState === "breaking" && this.cutT >= 2.5) {
      this.doorState = "open"
      this.panGoal = clampCam(CHEST_X - VIRTUAL_WIDTH / 2)
    }
    if (this.panGoal !== null) {
      this.camera.x += (this.panGoal - this.camera.x) * Math.min(1, dt * 2.2)
      if (Math.abs(this.panGoal - this.camera.x) < 1) {
        this.camera.x = this.panGoal
        this.panGoal = null
        this.phase = "cta"
        this.chestOpen = true
        this.markVisit(rooms.length - 1)
        audio.play("fanfare")
        this.events.emit("phase", { phase: "cta" })
      }
    }
  }

  /** Right-most x the player may reach before the door opens. */
  private gateX(): number {
    return this.doorState === "open" ? WORLD_WIDTH - this.player.width / 2 : DOOR_X - 16
  }

  private markVisit(index: number): void {
    if (this.visited[index]) return
    this.visited[index] = true
    this.events.emit("visit", { index })
    const hint = ROOM_HINTS[rooms[index].id]
    if (hint && index !== 0) this.emitCano(hint)
  }

  private emitCano(text: string): void {
    this.events.emit("cano", { text })
  }

  // --- FX helpers ---

  private shake(mag: number, secs: number): void {
    if (this.reducedMotion) return
    this.shakeMag = mag
    this.shakeT = secs
  }

  private spawnFx(id: string, x: number, y: number, additive = false): void {
    const atlas = this.assets.atlas(id)
    this.fx.push({ atlas, anim: new Anim(atlas, false), x, y, additive })
  }

  private spawnFlyer(c: Collectible): void {
    const atlas = this.assets.atlas(c.atlas)
    const fromX = c.x - this.camera.x
    const fromY = c.y
    // Target the pip that will fill (HUD pips start at x≈8, ~12px apart).
    const toX = 8 + (this.shards - 1) * 12
    const toY = 7
    this.flyers.push({ atlas, x: fromX, y: fromY, fromX, fromY, toX, toY, t: 0 })
  }

  private updateFx(dt: number): void {
    for (const f of this.fx) f.anim.update(dt)
    this.fx = this.fx.filter((f) => !f.anim.done)

    for (const f of this.flyers) {
      f.t = Math.min(1, f.t + dt / 0.4)
      const e = easeInOut(f.t)
      f.x = f.fromX + (f.toX - f.fromX) * e
      // Arc: lift then settle into the HUD.
      f.y = f.fromY + (f.toY - f.fromY) * e - Math.sin(f.t * Math.PI) * 24
    }
    this.flyers = this.flyers.filter((f) => f.t < 1)

    for (const t of this.floats) t.t += dt
    this.floats = this.floats.filter((t) => t.t < 0.8)
  }

  // --- Render ---

  render(stage: Stage): void {
    const ctx = stage.ctx
    ctx.save()
    if (this.shakeT > 0) {
      const k = this.shakeMag * (this.shakeT > 0 ? 1 : 0)
      ctx.translate((Math.random() * 2 - 1) * k, (Math.random() * 2 - 1) * k)
    }
    const camX = Math.round(this.camera.x)

    this.renderBackdrops(ctx, camX)
    this.renderRooms(ctx, camX)
    this.renderCollectibles(ctx, camX)
    this.renderDoorAndChest(ctx, camX)
    this.renderCano(ctx, camX)
    this.renderPlayer(ctx, camX)
    this.renderCutsceneOverlay(ctx, camX)
    this.renderWorldFx(ctx, camX)
    this.renderMotes(ctx)

    ctx.restore()

    this.renderFlyers(ctx)
    this.renderFloats(ctx, camX)
    renderHud(stage, this.shards, TOTAL_SHARDS)
    this.renderCrt(ctx)
  }

  private renderBackdrops(ctx: CanvasRenderingContext2D, camX: number): void {
    const first = Math.max(0, Math.floor(camX / ROOM_WIDTH))
    const last = Math.min(rooms.length - 1, Math.floor((camX + VIRTUAL_WIDTH) / ROOM_WIDTH))
    for (let i = first; i <= last; i++) {
      const x = i * ROOM_WIDTH - camX
      const img = this.assets.tryImage(rooms[i].backdrop)
      if (img) {
        ctx.drawImage(img, x, 0, ROOM_WIDTH, VIRTUAL_HEIGHT)
      } else {
        // Lazy backdrop still streaming in: paint the room's dark base so there's
        // never a flash of blank canvas (the dim overlay layers on top of this).
        ctx.fillStyle = "#0a0c16"
        ctx.fillRect(x, 0, ROOM_WIDTH, VIRTUAL_HEIGHT)
      }
    }
  }

  /** Per-room dim overlay (cleared on lights-up) + that room's reward props. */
  private renderRooms(ctx: CanvasRenderingContext2D, camX: number): void {
    const first = Math.max(0, Math.floor(camX / ROOM_WIDTH))
    const last = Math.min(rooms.length - 1, Math.floor((camX + VIRTUAL_WIDTH) / ROOM_WIDTH))
    for (let i = first; i <= last; i++) {
      const base = i * ROOM_WIDTH - camX
      this.renderRoomProps(ctx, i, base)
      if (!this.lit[i] && rooms[i].reward) {
        ctx.fillStyle = "rgba(8, 10, 22, 0.55)"
        ctx.fillRect(base, 0, ROOM_WIDTH, VIRTUAL_HEIGHT)
      }
    }
  }

  private renderRoomProps(ctx: CanvasRenderingContext2D, index: number, base: number): void {
    const lit = this.lit[index]
    const lt = this.litTime[index]
    switch (rooms[index].reward) {
      case "lamp": {
        const a = this.assets.atlas("prop-lamp")
        const x = base + 240
        const y = 104
        drawFrame(ctx, a, lit ? this.anims.lamp.frame : 0, x, y, { alpha: lit ? 1 : 0.5 })
        if (lit) this.glow(ctx, x, y + 18, 70, "rgba(255,200,90,0.18)")
        break
      }
      case "pipeline": {
        const nodes = this.assets.atlas("prop-pipeline-nodes")
        const belt = this.assets.atlas("prop-conveyor-belt")
        // Conveyor strip along the back, scrolling when lit.
        for (let s = 0; s < 24; s++) {
          drawFrame(ctx, belt, lit ? this.anims.conveyor.frame : 0, base + 16 + s * 18, 150)
        }
        // Six labelled nodes; light up left→right.
        for (let n = 0; n < 6; n++) {
          const on = lit && lt > n * 0.18
          drawFrame(ctx, nodes, on ? n + 6 : n, base + 70 + n * 58, 118)
        }
        break
      }
      case "frames": {
        const empty = this.assets.atlas("prop-frame-empty")
        const litA = this.assets.atlas("prop-frame-lit")
        for (let n = 0; n < 5; n++) {
          const x = base + 70 + n * 80
          const on = lit && lt > n * 0.12
          if (on) drawFrame(ctx, litA, n, x, 132)
          else drawFrame(ctx, empty, 0, x, 132)
        }
        break
      }
      case "scrolls": {
        const a = this.assets.atlas("prop-scroll-shelf")
        const spots = [60, 150, 250, 340, 420]
        spots.forEach((sx, n) => {
          const on = lit && lt > n * 0.1
          drawFrame(ctx, a, on ? this.anims.scroll.frame : 0, base + sx, 120 + (n % 2) * 44)
        })
        break
      }
      case "forge": {
        const fur = this.assets.atlas("prop-furnace")
        const x = base + 200
        drawFrame(ctx, fur, lit ? this.anims.furnace.frame : 0, x, 176)
        if (lit) {
          this.glow(ctx, x, 150, 80, "rgba(255,120,40,0.22)")
          const sp = this.assets.atlas("prop-anvil-sparks")
          ctx.globalCompositeOperation = "lighter"
          drawFrame(ctx, sp, this.anims.anvil.frame, base + 300, 214)
          ctx.globalCompositeOperation = "source-over"
        }
        break
      }
      default:
        break
    }
  }

  private renderCollectibles(ctx: CanvasRenderingContext2D, camX: number): void {
    for (const c of this.collectibles) {
      if (c.picked) continue
      const a = this.collectibleAnims.get(c.id)
      if (!a) continue
      drawFrame(ctx, this.assets.atlas(c.atlas), a.frame, c.x - camX, c.y, {})
    }
  }

  private renderDoorAndChest(ctx: CanvasRenderingContext2D, camX: number): void {
    const dx = DOOR_X - camX
    if (this.doorState === "locked") {
      drawFrame(ctx, this.assets.atlas("door-locked"), 0, dx, FLOOR_Y)
    } else if (this.doorState === "breaking") {
      const a = this.assets.atlas("door-lockbreak")
      const f = Math.min(a.count - 1, Math.floor((this.cutT - 2.0) / 0.16))
      drawFrame(ctx, a, f, dx, FLOOR_Y)
    } else {
      const a = this.assets.atlas("door-open")
      drawFrame(ctx, a, Math.floor((performance.now() / 250) % a.count), dx, FLOOR_Y)
    }

    // Chest in the CTA room.
    const chest = this.assets.atlas("prop-chest")
    const cx = CHEST_X - camX
    if (cx > -64 && cx < VIRTUAL_WIDTH + 64) {
      const f = this.chestOpen ? chest.count - 1 : 0
      drawFrame(ctx, chest, f, cx, FLOOR_Y)
      if (this.chestOpen) {
        drawFrame(ctx, this.assets.atlas("canon-artifact"), this.anims.canonArtifact.frame, cx, FLOOR_Y - 30)
      }
    }
  }

  private renderCano(ctx: CanvasRenderingContext2D, camX: number): void {
    const id =
      this.cano.mode === "react"
        ? "canoReact"
        : this.cano.mode === "point"
          ? "canoPoint"
          : "canoFloat"
    const atlasId =
      this.cano.mode === "react"
        ? "cano-react"
        : this.cano.mode === "point"
          ? "cano-point"
          : "cano-float"
    drawFrame(ctx, this.assets.atlas(atlasId), this.anims[id].frame, this.cano.x - camX, this.cano.y, {
      flip: this.cano.mode === "point" && this.cano.pointDir < 0,
    })
  }

  private renderPlayer(ctx: CanvasRenderingContext2D, camX: number): void {
    const p = this.player
    let atlasId: string
    let anim: Anim
    if (p.cheer > 0) {
      atlasId = "pix-pickup"
      anim = this.anims.pickup
    } else if (p.moving) {
      atlasId = "pix-walk"
      anim = this.anims.walk
    } else if (p.tired) {
      atlasId = "pix-idle-tired"
      anim = this.anims.tired
    } else {
      atlasId = "pix-idle"
      anim = this.anims.idle
    }
    drawFrame(ctx, this.assets.atlas(atlasId), anim.frame, p.x - camX, p.y, {
      flip: p.facing < 0,
    })
  }

  private renderCutsceneOverlay(ctx: CanvasRenderingContext2D, camX: number): void {
    if (this.phase !== "cutscene") return
    const p = this.player
    const px = p.x - camX
    const py = p.cy

    // Orbiting shards converging, then a glow flash + the assembled artifact.
    const conv = Math.min(1, this.cutT / 1.2)
    if (this.cutT < 1.2) {
      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 + this.cutT * 6
        const r = 40 * (1 - conv) + 6
        const a = this.collectibleAnims.get(this.collectibles[i].id)
        if (a) {
          drawFrame(ctx, this.assets.atlas(this.collectibles[i].atlas), a.frame, px + Math.cos(ang) * r, py + Math.sin(ang) * r * 0.6)
        }
      }
    }
    if (this.cutT >= 1.0) {
      const glow = this.assets.atlas("fx-assemble-glow")
      const gf = Math.min(glow.count - 1, Math.floor((this.cutT - 1.0) / 0.06))
      ctx.globalCompositeOperation = "lighter"
      drawFrame(ctx, glow, gf, px, py + 20)
      ctx.globalCompositeOperation = "source-over"
      drawFrame(ctx, this.assets.atlas("canon-artifact"), this.anims.canonArtifact.frame, px, py)
    }
    if (this.cutT >= 1.0 && this.cutT < 1.25) {
      ctx.fillStyle = `rgba(255,255,255,${0.9 - (this.cutT - 1.0) * 3.6})`
      ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)
    }
    // Key drop near the door.
    if (this.keyDropped) {
      drawFrame(ctx, this.assets.atlas("key-canon"), this.anims.keyCanon.frame, DOOR_X - camX, FLOOR_Y - 6)
    }
  }

  private renderWorldFx(ctx: CanvasRenderingContext2D, camX: number): void {
    for (const f of this.fx) {
      if (f.additive) ctx.globalCompositeOperation = "lighter"
      drawFrame(ctx, f.atlas, f.anim.frame, f.x - camX, f.y)
      if (f.additive) ctx.globalCompositeOperation = "source-over"
    }
  }

  private renderMotes(ctx: CanvasRenderingContext2D): void {
    if (this.reducedMotion) return
    const a = this.assets.atlas("fx-dust-motes")
    ctx.globalAlpha = 0.5
    for (let x = -64; x < VIRTUAL_WIDTH + 64; x += 96) {
      drawFrame(ctx, a, this.anims.motes.frame, x + this.moteOffset, 80)
    }
    ctx.globalAlpha = 1
  }

  private renderFlyers(ctx: CanvasRenderingContext2D): void {
    for (const f of this.flyers) drawFrame(ctx, f.atlas, 0, f.x, f.y)
  }

  private renderFloats(ctx: CanvasRenderingContext2D, _camX: number): void {
    ctx.font = "8px monospace"
    ctx.textAlign = "center"
    for (const t of this.floats) {
      ctx.globalAlpha = Math.max(0, 1 - t.t / 0.8)
      ctx.fillStyle = "#ffc83c"
      ctx.fillText(t.text, t.x, t.y - t.t * 18)
    }
    ctx.globalAlpha = 1
    ctx.textAlign = "left"
  }

  private renderCrt(ctx: CanvasRenderingContext2D): void {
    if (this.reducedMotion) return
    // Scanlines.
    ctx.fillStyle = "rgba(0,0,0,0.08)"
    for (let y = 0; y < VIRTUAL_HEIGHT; y += 2) ctx.fillRect(0, y, VIRTUAL_WIDTH, 1)
    // Vignette.
    const g = ctx.createRadialGradient(
      VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_HEIGHT / 3,
      VIRTUAL_WIDTH / 2, VIRTUAL_HEIGHT / 2, VIRTUAL_WIDTH / 1.4,
    )
    g.addColorStop(0, "rgba(0,0,0,0)")
    g.addColorStop(1, "rgba(0,0,0,0.35)")
    ctx.fillStyle = g
    ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)
  }

  private glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(1, "rgba(0,0,0,0)")
    ctx.globalCompositeOperation = "lighter"
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
    ctx.globalCompositeOperation = "source-over"
  }
}

function clampCam(x: number): number {
  return Math.max(0, Math.min(x, WORLD_WIDTH - VIRTUAL_WIDTH))
}

function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}
