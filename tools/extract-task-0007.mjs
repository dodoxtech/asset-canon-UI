import sharp from "sharp";
import { contactCrop, cropResize, descriptor, makeAtlas, webpFromPng } from "./asset-pipeline.mjs";

const uiSource = "/Users/taio/.codex/generated_images/019ef76d-46c9-7ff2-b5f0-d7c3db36d887/ig_080d646d68c04c32016a3b51dae57881919e5cd59af05288cf.png";
const socialSource = "/Users/taio/.codex/generated_images/019ef76d-46c9-7ff2-b5f0-d7c3db36d887/ig_080d646d68c04c32016a3b525cea5881919f6f4469ecb55598.png";
const prompt = "CANON QUEST FX/HUD/favicon/social batch: game UI and marketing cards in the locked GBA pixel-art style.";

const spriteJobs = [
  ["fx-cartridge", "Boot cartridge click-in shudder frames.", "Boot cartridge FX", { w: 64, h: 48 }, 3, 3, 8, [[35, 80, 145, 130], [210, 80, 145, 130], [382, 80, 170, 135]]],
  ["fx-sparkle", "Shared four-frame gold pickup sparkle.", "Gold pickup sparkle FX", { w: 16, h: 16 }, 4, 4, 10, [[40, 305, 80, 80], [165, 305, 80, 80], [285, 295, 100, 95], [395, 285, 120, 110]]],
  ["fx-dust-puff", "Three-frame ground dust puff.", "Dust puff FX", { w: 16, h: 16 }, 3, 3, 10, [[35, 455, 90, 80], [165, 445, 105, 90], [300, 435, 125, 110]]],
  ["fx-dust-motes", "Subtle four-frame drifting dust motes loop.", "Dust motes FX", { w: 32, h: 32 }, 4, 4, 4, [[535, 455, 90, 80], [650, 455, 90, 80], [790, 455, 90, 80], [900, 455, 90, 80]]],
  ["fx-assemble-glow", "Eight-frame shard assembly charge and radial dithered flare.", "Assemble glow FX", { w: 64, h: 64 }, 8, 8, 12, [[35, 565, 85, 85], [155, 565, 90, 90], [285, 545, 120, 120], [430, 545, 125, 125], [560, 540, 130, 130], [690, 535, 135, 135], [815, 530, 150, 150], [690, 535, 135, 135]]],
  ["ui-cursor", "Two-frame blinking advance/menu cursor.", "Blinking UI cursor", { w: 8, h: 8 }, 2, 2, 2, [[780, 835, 70, 70], [885, 835, 80, 80]]],
];

for (const [id, desc, subject, cell, columns, count, fps, rectList] of spriteJobs) {
  const rects = rectList.map(([left, top, width, height]) => ({ left, top, width, height }));
  const w = cell.w * columns;
  const h = cell.h * Math.ceil(count / columns);
  const dir = id.startsWith("ui-") ? "icons" : "sprites";
  const png = `public/assets/generated/${dir}/${id}-sheet-${w}x${h}.png`;
  const webp = png.replace(/\.png$/, ".webp");
  await contactCrop(uiSource, rects, png, cell, columns, { alphaKey: "#FF00FF", tolerance: 130 });
  await webpFromPng(png, webp);
  await makeAtlas({ slug: id, image: png, cell, columns, count, fps, loop: count > 1, clips: { [id]: [0, count - 1] } });
  await descriptor({
    id,
    type: id.startsWith("ui-") ? "icon" : "sprite",
    subject,
    description: desc,
    keywords: id.split("-").concat(["canon-quest"]),
    placement: {
      intended_use: subject,
      context: "boot, pickup, HUD, and cutscene animation",
      do: ["render at native size then integer-scale", "use atlas metadata for timing"],
      dont: ["anti-alias", "stretch cells", "recolor off palette"],
    },
    style: { art_style: "GBA pixel FX", stroke: "1px selective ink where applicable", shading: "ordered dithered glow" },
    background: "transparent",
    dimensions: { master: `${w}x${h}`, aspect: `${w}:${h}` },
    alt_text: subject,
    files: [
      { path: png, size: `${w}x${h}`, format: "png" },
      { path: webp, size: `${w}x${h}`, format: "webp" },
      { path: png.replace(/\.png$/, ".json"), size: `${w}x${h}`, format: "json" },
    ],
    animation: { sheet: png, cell, columns, count, fps, loop: count > 1, anchor: [0.5, 0.5], clips: { [id]: [0, count - 1] } },
    source: { model: "built-in image_gen", prompt },
  });
}

const singles = [
  ["logo-canonquest", "sprites", "CANON QUEST pixel title lockup", "CANON QUEST title logo", { left: 610, top: 80, width: 350, height: 300 }, 240, 72],
  ["hud-pip-filled", "icons", "Filled shard pip for HUD counter.", "Filled shard pip", { left: 42, top: 690, width: 60, height: 80 }, 8, 8],
  ["hud-pip-empty", "icons", "Empty shard pip for HUD counter.", "Empty shard pip", { left: 160, top: 690, width: 60, height: 80 }, 8, 8],
  ["hud-bar", "icons", "Top status bar frame/background for HUD items.", "HUD bar", { left: 275, top: 690, width: 520, height: 80 }, 480, 16],
  ["ui-window", "icons", "GBA dialogue/menu 9-slice source window.", "UI window skin", { left: 300, top: 820, width: 420, height: 180 }, 48, 48],
  ["icon-sound-on", "icons", "Speaker-on toggle icon.", "Sound on icon", { left: 35, top: 1025, width: 70, height: 70 }, 16, 16],
  ["icon-sound-off", "icons", "Speaker-muted toggle icon.", "Sound off icon", { left: 140, top: 1025, width: 70, height: 70 }, 16, 16],
  ["icon-map", "icons", "Folded map button icon.", "Map icon", { left: 245, top: 1025, width: 70, height: 70 }, 16, 16],
  ["icon-skip", "icons", "Skip quest / read fallback icon.", "Skip icon", { left: 350, top: 1025, width: 70, height: 70 }, 16, 16],
  ["minimap-rooms", "icons", "Six room glyphs for minimap fast travel.", "Minimap room glyph sheet", { left: 475, top: 1025, width: 510, height: 70 }, 96, 16],
  ["ui-dpad", "icons", "Mobile on-screen D-pad.", "Mobile D-pad", { left: 70, top: 1140, width: 160, height: 160 }, 48, 48],
  ["ui-btn-a", "icons", "Mobile A/interact button.", "Mobile A button", { left: 245, top: 1160, width: 100, height: 100 }, 24, 24],
  ["btn-cta-primary", "icons", "Primary green CTA 9-slice button skin.", "Primary CTA button skin", { left: 420, top: 1165, width: 280, height: 80 }, 96, 24],
  ["btn-cta-secondary", "icons", "Secondary blue/stone CTA 9-slice button skin.", "Secondary CTA button skin", { left: 715, top: 1165, width: 280, height: 80 }, 96, 24],
];

for (const [id, dir, desc, subject, rect, w, h] of singles) {
  const png = `public/assets/generated/${dir}/${id}-${w}x${h}.png`;
  const webp = png.replace(/\.png$/, ".webp");
  await cropResize(uiSource, rect, png, w, h, { fit: "cover", alphaKey: "#FF00FF", tolerance: 130, keyBeforeResize: true });
  await webpFromPng(png, webp);
  await descriptor({
    id,
    type: "icon",
    subject,
    description: desc,
    keywords: id.split("-").concat(["ui"]),
    placement: {
      intended_use: subject,
      context: "HUD, controls, title, or call-to-action UI",
      do: ["render at native size then integer-scale", "use as a 9-slice where named"],
      dont: ["anti-alias", "stretch icons without 9-slice rules"],
    },
    style: { art_style: "GBA pixel UI", stroke: "1px selective ink outline", shading: "flat cel with dithered highlights" },
    background: "transparent",
    dimensions: { master: `${w}x${h}`, aspect: `${w}:${h}` },
    alt_text: subject,
    files: [
      { path: png, size: `${w}x${h}`, format: "png" },
      { path: webp, size: `${w}x${h}`, format: "webp" },
    ],
    source: { model: "built-in image_gen", prompt },
  });
}

const favMaster = "public/assets/generated/icons/favicon-512x512.png";
await sharp("public/assets/generated/sprites/shard-canon-sheet-64x16.png")
  .extract({ left: 0, top: 0, width: 16, height: 16 })
  .resize(512, 512, { kernel: sharp.kernel.nearest })
  .png({ compressionLevel: 9 })
  .toFile(favMaster);
const favFiles = [{ path: favMaster, size: "512x512", format: "png" }];
for (const size of [16, 32, 48, 180, 192]) {
  const out = `public/assets/generated/icons/favicon-${size}x${size}.png`;
  await sharp(favMaster).resize(size, size, { kernel: sharp.kernel.nearest }).png({ compressionLevel: 9 }).toFile(out);
  favFiles.push({ path: out, size: `${size}x${size}`, format: "png" });
}
await descriptor({
  id: "favicon",
  type: "icon",
  subject: "Canon Shard favicon emblem",
  description: "Canon Shard crystal silhouette exported as a favicon/PWA/app icon ladder, readable down to 16x16.",
  keywords: ["favicon", "app-icon", "canon-shard", "emblem"],
  placement: {
    intended_use: "browser favicon, apple-touch icon, and PWA icons",
    context: "site metadata and manifest",
    do: ["use the size-specific PNG ladder", "prefer 512 for manifest source"],
    dont: ["recompress with smoothing", "crop away the shard silhouette"],
  },
  style: { art_style: "GBA pixel icon", stroke: "1px selective ink outline", shading: "flat cel with dithered highlights" },
  background: "transparent",
  dimensions: { master: "512x512", aspect: "1:1" },
  alt_text: "Canon Shard emblem",
  files: favFiles,
  source: { model: "built-in image_gen", prompt },
});

const socials = [
  ["og-card", { left: 0, top: 20, width: 1728, height: 455 }, 1200, 630],
  ["twitter-card", { left: 0, top: 520, width: 1728, height: 365 }, 1200, 600],
];
for (const [id, rect, w, h] of socials) {
  const png = `public/assets/generated/social/${id}-${w}x${h}.png`;
  const webp = png.replace(/\.png$/, ".webp");
  await cropResize(socialSource, rect, png, w, h, { fit: "fill" });
  await webpFromPng(png, webp);
  await descriptor({
    id,
    type: "social",
    subject: `${id} CANON QUEST share card`,
    description: "Opaque social share card showing Pix in the lit workshop with the CANON QUEST title, tagline, and PLAY cue.",
    keywords: ["social", "og", "twitter", "canon-quest", "share-card"],
    placement: {
      intended_use: `${id} link-preview image`,
      context: "Open Graph / Twitter summary-large-image metadata",
      do: ["use as opaque metadata image", "keep text inside platform safe area"],
      dont: ["crop again for metadata", "overlay extra text"],
    },
    style: { art_style: "GBA pixel social card", stroke: "pixel title and frame outlines", shading: "warm dithered workshop lighting" },
    background: "full-bleed",
    dimensions: { master: `${w}x${h}`, aspect: `${w}:${h}` },
    alt_text: "CANON QUEST social card",
    files: [
      { path: png, size: `${w}x${h}`, format: "png" },
      { path: webp, size: `${w}x${h}`, format: "webp" },
    ],
    safe_area: "inner 90%",
    source: { model: "built-in image_gen", prompt },
  });
}
