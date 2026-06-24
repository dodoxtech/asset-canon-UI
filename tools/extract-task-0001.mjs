import { contactCrop, cropResize, descriptor, makeAtlas, webpFromPng } from "./asset-pipeline.mjs";

const source = "/Users/taio/.codex/generated_images/019ef76d-46c9-7ff2-b5f0-d7c3db36d887/ig_080d646d68c04c32016a3b3f96228c8191944f059114022a22.png";
const prompt = "CANON QUEST style anchors: Pix idle, cozy workshop backdrop, base structural tiles; GBA pixel art, shared palette, magenta chroma plate.";

await contactCrop(
  source,
  [
    { left: 136, top: 143, width: 127, height: 264 },
    { left: 315, top: 143, width: 127, height: 264 },
  ],
  "assets/generated/sprites/pix-idle-sheet-32x24.png",
  { w: 16, h: 24 },
  2,
);
await webpFromPng("assets/generated/sprites/pix-idle-sheet-32x24.png", "assets/generated/sprites/pix-idle-sheet-32x24.webp");
await makeAtlas({
  slug: "pix-idle",
  image: "assets/generated/sprites/pix-idle-sheet-32x24.png",
  cell: { w: 16, h: 24 },
  columns: 2,
  count: 2,
  fps: 3,
  clips: { idle: [0, 1] },
});

await cropResize(
  source,
  { left: 547, top: 38, width: 985, height: 405 },
  "assets/generated/backdrops/bg-workshop-480x270.png",
  480,
  270,
  { fit: "cover" },
);
await webpFromPng("assets/generated/backdrops/bg-workshop-480x270.png", "assets/generated/backdrops/bg-workshop-480x270.webp");

const tileRects = [];
for (const y of [521, 641, 760, 856]) {
  for (const x of [547, 678, 809, 940]) {
    tileRects.push({ left: x, top: y, width: 106, height: 100 });
  }
}
await contactCrop(
  source,
  tileRects,
  "assets/generated/tilesets/tiles-base-sheet-64x64.png",
  { w: 16, h: 16 },
  4,
);
await webpFromPng("assets/generated/tilesets/tiles-base-sheet-64x64.png", "assets/generated/tilesets/tiles-base-sheet-64x64.webp");
await makeAtlas({
  slug: "tiles-base",
  image: "assets/generated/tilesets/tiles-base-sheet-64x64.png",
  cell: { w: 16, h: 16 },
  columns: 4,
  count: 16,
  fps: 1,
  loop: false,
  anchor: [0, 0],
  clips: { tiles: [0, 15] },
});

await descriptor({
  id: "pix-idle",
  type: "sprite",
  subject: "Pix hero idle animation",
  description: "Two-frame idle sprite of Pix, the small artist hero, facing right with beret, apron, and brush. Upright and confident for the lit workshop state.",
  keywords: ["pix", "hero", "idle", "artist", "sprite"],
  placement: {
    intended_use: "default player idle after the first shard lights the studio",
    context: "CANON QUEST side-scrolling stage",
    do: ["render at native 16x24 then integer-scale", "flip in code for facing left"],
    dont: ["anti-alias", "stretch frames", "recolor outside the shared palette"],
  },
  style: { art_style: "GBA pixel sprite", stroke: "1px selective ink outline", shading: "flat cel with ordered dithering" },
  background: "transparent",
  dimensions: { master: "32x24", aspect: "4:3" },
  alt_text: "Pix idle sprite",
  files: [
    { path: "assets/generated/sprites/pix-idle-sheet-32x24.png", size: "32x24", format: "png" },
    { path: "assets/generated/sprites/pix-idle-sheet-32x24.webp", size: "32x24", format: "webp" },
    { path: "assets/generated/sprites/pix-idle-sheet-32x24.json", size: "32x24", format: "json" },
  ],
  animation: {
    sheet: "assets/generated/sprites/pix-idle-sheet-32x24.png",
    cell: { w: 16, h: 24 },
    columns: 2,
    count: 2,
    fps: 3,
    loop: true,
    anchor: [0.5, 1.0],
    clips: { idle: [0, 1] },
  },
  source: { model: "built-in image_gen", prompt },
});

await descriptor({
  id: "bg-workshop",
  type: "illustration",
  subject: "cozy artist workshop backdrop",
  description: "Lit workshop far-wall backdrop with easels, paint shelves, hanging lamp, dusk window, and wood floor horizon for the home room.",
  keywords: ["workshop", "backdrop", "studio", "room", "gba"],
  placement: {
    intended_use: "home room far-wall background",
    context: "layered behind walkable tiles and props",
    do: ["place behind tilemap", "use CSS tint for dim opening state"],
    dont: ["use as foreground collision layer", "crop away the floor horizon"],
  },
  style: { art_style: "GBA pixel illustration", stroke: "1px selective ink details", shading: "warm cel lighting with dithered depth" },
  background: "full-bleed",
  dimensions: { master: "480x270", aspect: "16:9" },
  alt_text: "Cozy pixel-art workshop backdrop",
  files: [
    { path: "assets/generated/backdrops/bg-workshop-480x270.png", size: "480x270", format: "png" },
    { path: "assets/generated/backdrops/bg-workshop-480x270.webp", size: "480x270", format: "webp" },
  ],
  composition: "Consistent floor line across the lower band; visual interest on far wall while leaving foreground clear for sprites.",
  source: { model: "built-in image_gen", prompt },
});

await descriptor({
  id: "tiles-base",
  type: "sprite",
  subject: "shared structural tile kit",
  description: "A 4x4 sheet of structural room tiles: wood floor, blue wall, wall top, side edges, corners, baseboards, and repeatable trim pieces.",
  keywords: ["tiles", "base", "floor", "wall", "corners"],
  placement: {
    intended_use: "shared tilemap skeleton for every room",
    context: "foreground walkable and collision-aligned tile layer",
    do: ["snap to 16x16 grid", "reuse edges and corners across rooms"],
    dont: ["scale non-integer", "mix with off-palette tiles"],
  },
  style: { art_style: "GBA pixel tileset", stroke: "1px selective ink outline", shading: "flat cel with dithered texture" },
  background: "transparent",
  dimensions: { master: "64x64", aspect: "1:1" },
  alt_text: "Base room tileset",
  files: [
    { path: "assets/generated/tilesets/tiles-base-sheet-64x64.png", size: "64x64", format: "png" },
    { path: "assets/generated/tilesets/tiles-base-sheet-64x64.webp", size: "64x64", format: "webp" },
    { path: "assets/generated/tilesets/tiles-base-sheet-64x64.json", size: "64x64", format: "json" },
  ],
  animation: {
    sheet: "assets/generated/tilesets/tiles-base-sheet-64x64.png",
    cell: { w: 16, h: 16 },
    columns: 4,
    count: 16,
    fps: 1,
    loop: false,
    anchor: [0, 0],
    clips: { tiles: [0, 15] },
  },
  source: { model: "built-in image_gen", prompt },
});
