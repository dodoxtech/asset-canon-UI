// Static layout for the one horizontal map: six rooms laid left-to-right, each a
// single 480-wide screen. Backdrops are the painted far walls (loaded as static
// images keyed `bg-<id>`); each non-CTA room holds one Shard and a "reward kind"
// that names the lights-up transformation the scene plays when that Shard is
// found (see docs/landing-page/concept.md). Geometry the engine needs lives
// here so placements are data, not magic numbers buried in the scene.

import { VIRTUAL_WIDTH } from "../engine/constants"

/** Each room is exactly one screen wide. */
export const ROOM_WIDTH = VIRTUAL_WIDTH // 480

/** Feet line the floor props and the player rest on. */
export const FLOOR_Y = 236
/** Walkable vertical band for the player's feet. */
export const FEET_MIN = 214
export const FEET_MAX = 256

/** The lights-up transformation a room plays when its Shard is collected. */
export type RewardKind = "lamp" | "pipeline" | "frames" | "scrolls" | "forge"

export interface ShardSpec {
  /** Collectible id — also the sections.ts key. */
  id: string
  /** Sprite atlas id for the floating pickup. */
  atlas: string
  /** World-space center of the pickup. */
  x: number
  y: number
}

export interface RoomDef {
  index: number
  id: string
  name: string
  /** Static image id (`bg-<id>`). */
  backdrop: string
  /** Glyph index into the minimap-rooms sheet. */
  glyph: number
  reward: RewardKind | null
  shard: ShardSpec | null
}

const order = ["workshop", "hallway", "gallery", "archive", "forge", "cta"]
const names = ["Workshop", "Hallway", "Gallery", "Archive", "Forge", "Vault"]
const rewards: (RewardKind | null)[] = [
  "lamp",
  "pipeline",
  "frames",
  "scrolls",
  "forge",
  null,
]
const shardIds = [
  "shard-canon",
  "shard-pipeline",
  "shard-keyring",
  "shard-rune",
  "shard-cog",
  null,
]

/** Pickup centre height (floats just above the floor, reachable on a walk-by). */
const SHARD_Y = 214

export const rooms: RoomDef[] = order.map((id, i) => {
  const sid = shardIds[i]
  return {
    index: i,
    id,
    name: names[i],
    backdrop: `bg-${id}`,
    glyph: i,
    reward: rewards[i],
    shard: sid
      ? { id: sid, atlas: sid, x: i * ROOM_WIDTH + ROOM_WIDTH / 2, y: SHARD_Y }
      : null,
  }
})

export const WORLD_WIDTH = rooms.length * ROOM_WIDTH

/** Final door sits on the Forge→Vault threshold; chest centres the Vault. */
export const DOOR_X = 5 * ROOM_WIDTH - 16
export const CHEST_X = 5 * ROOM_WIDTH + ROOM_WIDTH / 2
/** Player spawns in the Workshop. */
export const SPAWN_X = ROOM_WIDTH / 2 - 80

/** Which room a world-x sits in. */
export function roomIndexAt(worldX: number): number {
  return Math.max(0, Math.min(rooms.length - 1, Math.floor(worldX / ROOM_WIDTH)))
}
