// Central asset registry: stable ids → on-disk paths under
// `public/assets/generated`. Canvas-drawn art (spritesheets, backdrops,
// texture washes) is preloaded through the AssetStore using SHEETS/STATICS;
// DOM chrome (HUD icons, logo, CTA buttons) is referenced by URL via `url()`.
// A moved or renamed file is a one-line fix here.

const ROOT = "/assets/generated"

/** Spritesheet id → atlas JSON path (the PNG is derived from the JSON). */
export const SHEETS: Record<string, string> = {
  // Hero (Pix)
  "pix-idle-tired": "sprites/pix-idle-tired-sheet-32x24.json",
  "pix-idle": "sprites/pix-idle-sheet-32x24.json",
  "pix-walk": "sprites/pix-walk-sheet-64x24.json",
  "pix-pickup": "sprites/pix-pickup-sheet-48x24.json",
  // Companion (Cano)
  "cano-float": "sprites/cano-float-sheet-48x12.json",
  "cano-react": "sprites/cano-react-sheet-24x12.json",
  "cano-point": "sprites/cano-point-sheet-24x12.json",
  // Collectibles
  "shard-canon": "sprites/shard-canon-sheet-64x16.json",
  "shard-pipeline": "sprites/shard-pipeline-sheet-64x16.json",
  "shard-keyring": "sprites/shard-keyring-sheet-64x16.json",
  "shard-rune": "sprites/shard-rune-sheet-64x16.json",
  "shard-cog": "sprites/shard-cog-sheet-64x16.json",
  "key-canon": "sprites/key-canon-sheet-64x16.json",
  coin: "sprites/coin-sheet-64x16.json",
  "sticker-easteregg": "sprites/sticker-easteregg-sheet-32x16.json",
  "canon-artifact": "sprites/canon-artifact-sheet-64x32.json",
  // Animated props & doors
  "prop-lamp": "sprites/prop-lamp-sheet-32x24.json",
  "prop-conveyor-belt": "sprites/prop-conveyor-belt-sheet-64x16.json",
  "prop-pipeline-nodes": "sprites/prop-pipeline-nodes-sheet-96x32.json",
  "prop-frame-empty": "sprites/prop-frame-empty-sheet-24x24.json",
  "prop-frame-lit": "sprites/prop-frame-lit-sheet-120x24.json",
  "prop-scroll-shelf": "sprites/prop-scroll-shelf-sheet-64x16.json",
  "prop-furnace": "sprites/prop-furnace-sheet-160x32.json",
  "prop-anvil-sparks": "sprites/prop-anvil-sparks-sheet-48x16.json",
  "door-locked": "sprites/door-locked-sheet-24x32.json",
  "door-lockbreak": "sprites/door-lockbreak-sheet-72x32.json",
  "door-open": "sprites/door-open-sheet-48x32.json",
  "prop-chest": "sprites/prop-chest-sheet-128x24.json",
  // Cutscene / FX
  "fx-sparkle": "sprites/fx-sparkle-sheet-64x16.json",
  "fx-dust-puff": "sprites/fx-dust-puff-sheet-48x16.json",
  "fx-dust-motes": "sprites/fx-dust-motes-sheet-128x32.json",
  "fx-assemble-glow": "sprites/fx-assemble-glow-sheet-512x64.json",
}

// Static (single-image) ids → webp path (smaller than png, decoded on canvas).
// Split for the perf budget: only the first room + texture wash load before the
// player can start; the later-room backdrops stream in via LAZY_STATICS right
// after boot, so first load stays light and rooms are ready by walk-time.

/** Loaded up front (gates "PRESS START"). */
export const STATICS: Record<string, string> = {
  "bg-workshop": "backdrops/bg-workshop-480x270.webp",
  "tex-glow": "textures/tex-dither-glow-repeat-64x64.png",
}

/** Streamed in after boot (rooms the player reaches later). */
export const LAZY_STATICS: Record<string, string> = {
  "bg-hallway": "backdrops/bg-hallway-480x270.webp",
  "bg-gallery": "backdrops/bg-gallery-480x270.webp",
  "bg-archive": "backdrops/bg-archive-480x270.webp",
  "bg-forge": "backdrops/bg-forge-480x270.webp",
  "bg-cta": "backdrops/bg-cta-480x270.webp",
}

/** Resolve a public URL for DOM chrome (HUD icons, logo, buttons). */
export function url(path: string): string {
  return `${ROOT}/${path}`
}

/** Named URLs for DOM overlays (webp — smaller than the png siblings). */
export const dom = {
  bgBoot: url("backdrops/bg-boot-480x270.webp"),
  logo: url("sprites/logo-canonquest-240x72.webp"),
  cartridge: url("sprites/fx-cartridge-sheet-192x48.webp"),
  hudBar: url("icons/hud-bar-480x16.webp"),
  soundOn: url("icons/icon-sound-on-16x16.webp"),
  soundOff: url("icons/icon-sound-off-16x16.webp"),
  iconMap: url("icons/icon-map-16x16.webp"),
  iconSkip: url("icons/icon-skip-16x16.webp"),
  minimapSheet: url("icons/minimap-rooms-96x16.webp"),
  dpad: url("icons/ui-dpad-48x48.webp"),
  btnA: url("icons/ui-btn-a-24x24.webp"),
  ctaPrimary: url("icons/btn-cta-primary-96x24.webp"),
  ctaSecondary: url("icons/btn-cta-secondary-96x24.webp"),
} as const
