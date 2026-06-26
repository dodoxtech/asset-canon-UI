import sharp from "sharp";
import { contactCrop, cropResize, descriptor, makeAtlas, webpFromPng } from "./asset-pipeline.mjs";

const source = "public/assets/tmp/generated-image-05-tilesets-textures.png";
const prompt = "CANON QUEST tileset and seamless texture sheet: room prop tiles and four surface swatches, GBA pixel art on magenta chroma plate.";

const tilePanels = [
  ["tiles-workshop", "Workshop prop tiles: workbench, stool, easel, paint cans, rug, brush cup, crate, shelf.", 84, 93],
  ["tiles-hallway", "Hallway prop tiles: sconces, doorway trims, conveyor brackets, pipe joints, panel lights.", 564, 93],
  ["tiles-gallery", "Gallery prop tiles: frame mounts, velvet rope, bench, spotlight housing, plaques, banners.", 1068, 93],
  ["tiles-archive", "Archive prop tiles: shelves, ladder, card catalog, scroll bins, green desk lamp.", 84, 388],
  ["tiles-forge", "Forge prop tiles: anvil base, water trough, tool rack, coal pile, chimney, furnace trim.", 564, 388],
  ["tiles-cta", "CTA prop tiles: pedestal, banner poles, confetti, vault trim, gold trim, chest base.", 1068, 388],
];

for (const [id, desc, x0, y0] of tilePanels) {
  const rects = [];
  for (const y of [y0, y0 + 117]) {
    for (const x of [x0, x0 + 105, x0 + 211, x0 + 317]) {
      rects.push({ left: x, top: y, width: 95, height: 95 });
    }
  }
  const png = `public/assets/generated/tilesets/${id}-sheet-64x32.png`;
  const webp = png.replace(/\.png$/, ".webp");
  await contactCrop(source, rects, png, { w: 16, h: 16 }, 4, { alphaKey: "#FF00FF", anchor: [0, 0] });
  await webpFromPng(png, webp);
  await makeAtlas({
    slug: id,
    image: png,
    cell: { w: 16, h: 16 },
    columns: 4,
    count: 8,
    fps: 1,
    loop: false,
    anchor: [0, 0],
    clips: { tiles: [0, 7] },
  });
  await descriptor({
    id,
    type: "sprite",
    subject: `${id.replace("tiles-", "")} prop tileset`,
    description: desc,
    keywords: id.split("-").concat(["tileset", "props"]),
    placement: {
      intended_use: "room-specific foreground prop tiles",
      context: "16x16 tilemap foreground and decorative collision layer",
      do: ["snap to 16x16 grid", "mix with tiles-base"],
      dont: ["scale non-integer", "use as far-wall backdrop"],
    },
    style: { art_style: "GBA pixel tileset", stroke: "1px selective ink outline", shading: "flat cel with dithered texture" },
    background: "transparent",
    dimensions: { master: "64x32", aspect: "2:1" },
    alt_text: `${id} tileset`,
    files: [
      { path: png, size: "64x32", format: "png" },
      { path: webp, size: "64x32", format: "webp" },
      { path: png.replace(/\.png$/, ".json"), size: "64x32", format: "json" },
    ],
    animation: {
      sheet: png,
      cell: { w: 16, h: 16 },
      columns: 4,
      count: 8,
      fps: 1,
      loop: false,
      anchor: [0, 0],
      clips: { tiles: [0, 7] },
    },
    source: { model: "built-in image_gen", prompt },
  });
}

const textures = [
  ["tex-floor-wood", "seamless plank wood floor texture", "warm low-contrast wood plank floor", { left: 84, top: 680, width: 272, height: 260 }],
  ["tex-floor-stone", "seamless flagstone floor texture", "cool gray flagstone floor", { left: 443, top: 680, width: 270, height: 260 }],
  ["tex-wall-plaster", "seamless blue plaster wall texture", "blue interior plaster wall fill", { left: 796, top: 680, width: 270, height: 260 }],
  ["tex-dither-glow", "tileable dithered warm glow swatch", "dithered lamp and magic glow swatch", { left: 1154, top: 680, width: 285, height: 260 }],
];

for (const [id, desc, subject, rect] of textures) {
  const png = `public/assets/generated/textures/${id}-32x32.png`;
  const webp = png.replace(/\.png$/, ".webp");
  const repeat = `public/assets/generated/textures/${id}-repeat-64x64.png`;
  await cropResize(source, rect, png, 32, 32, { fit: "cover" });
  await webpFromPng(png, webp);
  const tile = await sharp(png).png().toBuffer();
  await sharp({
    create: { width: 64, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: tile, left: 0, top: 0 },
      { input: tile, left: 32, top: 0 },
      { input: tile, left: 0, top: 32 },
      { input: tile, left: 32, top: 32 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(repeat);
  await descriptor({
    id,
    type: "texture",
    subject,
    description: desc,
    keywords: id.split("-").concat(["texture", "tileable"]),
    placement: {
      intended_use: "repeatable surface fill for room floors, walls, or glow overlays",
      context: "CSS/canvas pattern fills behind or beneath tiles",
      do: ["repeat at 32x32 native size", "use low opacity for glow swatch when needed"],
      dont: ["stretch unevenly", "use under body text at high contrast"],
    },
    style: { art_style: "GBA pixel texture", stroke: "none", shading: "low-contrast dithered surface" },
    background: "full-bleed",
    dimensions: { master: "32x32", aspect: "1:1" },
    alt_text: subject,
    files: [
      { path: png, size: "32x32", format: "png" },
      { path: webp, size: "32x32", format: "webp" },
      { path: repeat, size: "64x64", format: "png" },
    ],
    tileable: true,
    tile_size: "32x32",
    tonality: "low-contrast",
    source: { model: "built-in image_gen", prompt },
  });
}
