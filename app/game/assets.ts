// Typed asset manifest + URL helper.
//
// Source of truth for *what each asset is* lives in `docs/assets/<slug>.yaml`.
// This file maps stable ids → the public URL Next.js serves them from. The
// generated art was moved under `public/assets/generated/**` in task 0008a, so
// the on-disk `public/` prefix is stripped to form the URL (`/assets/...`).
//
// Engine/UI code should import `asset(id)` / the typed maps below instead of
// hand-writing path strings, so a moved or renamed file is a one-line fix here.

const ROOT = "/assets/generated"

/** One exported file for an asset, plus its intrinsic pixel size. */
export interface AssetFile {
  /** Public URL (already `/public`-stripped), e.g. `/assets/generated/...`. */
  readonly url: string
  readonly width: number
  readonly height: number
}

/** A spritesheet: a strip of frames laid out left-to-right. */
export interface SpriteSheet extends AssetFile {
  /** Pixel size of a single frame (sheets here are single-row strips). */
  readonly frameWidth: number
  readonly frameHeight: number
  readonly frames: number
}

function file(path: string, width: number, height: number): AssetFile {
  return { url: `${ROOT}/${path}`, width, height }
}

function sheet(
  path: string,
  width: number,
  height: number,
  frameWidth: number,
): SpriteSheet {
  return {
    url: `${ROOT}/${path}`,
    width,
    height,
    frameWidth,
    frameHeight: height,
    frames: Math.max(1, Math.round(width / frameWidth)),
  }
}

/** Room far-wall backdrops (opaque 480×270 panels for the virtual stage). */
export const backdrops = {
  boot: file("backdrops/bg-boot-480x270.png", 480, 270),
  workshop: file("backdrops/bg-workshop-480x270.png", 480, 270),
  hallway: file("backdrops/bg-hallway-480x270.png", 480, 270),
  gallery: file("backdrops/bg-gallery-480x270.png", 480, 270),
  archive: file("backdrops/bg-archive-480x270.png", 480, 270),
  forge: file("backdrops/bg-forge-480x270.png", 480, 270),
  cta: file("backdrops/bg-cta-480x270.png", 480, 270),
} as const

/** Animated spritesheets (single-row frame strips). */
export const sprites = {
  pixIdle: sheet("sprites/pix-idle-sheet-32x24.png", 32, 24, 16),
  pixWalk: sheet("sprites/pix-walk-sheet-64x24.png", 64, 24, 16),
  pixPickup: sheet("sprites/pix-pickup-sheet-48x24.png", 48, 24, 16),
  canoFloat: sheet("sprites/cano-float-sheet-48x12.png", 48, 12, 12),
  shardCanon: sheet("sprites/shard-canon-sheet-64x16.png", 64, 16, 16),
  canonArtifact: sheet("sprites/canon-artifact-sheet-64x32.png", 64, 32, 32),
} as const

/** Static UI / HUD chrome. */
export const ui = {
  hudBar: file("icons/hud-bar-480x16.png", 480, 16),
  hudPipFilled: file("icons/hud-pip-filled-8x8.png", 8, 8),
  hudPipEmpty: file("icons/hud-pip-empty-8x8.png", 8, 8),
  window: file("icons/ui-window-48x48.png", 48, 48),
  logo: file("sprites/logo-canonquest-240x72.png", 240, 72),
} as const

export type BackdropId = keyof typeof backdrops
export type SpriteId = keyof typeof sprites
export type UiId = keyof typeof ui

/** Resolve any manifested asset's public URL by its typed id. */
export function asset(
  id:
    | { kind: "backdrop"; id: BackdropId }
    | { kind: "sprite"; id: SpriteId }
    | { kind: "ui"; id: UiId },
): string {
  switch (id.kind) {
    case "backdrop":
      return backdrops[id.id].url
    case "sprite":
      return sprites[id.id].url
    case "ui":
      return ui[id.id].url
  }
}
