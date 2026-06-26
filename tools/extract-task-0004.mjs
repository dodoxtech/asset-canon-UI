import { cropResize, descriptor, webpFromPng } from "./asset-pipeline.mjs";

const source = "public/assets/tmp/generated-image-04-backdrops.png";
const prompt = "ASSET CANON seven-room backdrop sheet: boot, workshop, hallway, gallery, archive, forge, CTA; opaque GBA pixel-art panels.";

const rooms = [
  ["bg-boot", "dark cartridge-slot and CRT glow boot backdrop", "Boot/title screen CRT chamber", { left: 20, top: 20, width: 765, height: 282 }],
  ["bg-workshop", "cozy artist workshop with easels, paint cans, lamp, dusk window", "Workshop home room backdrop", { left: 802, top: 20, width: 838, height: 282 }],
  ["bg-hallway", "pipeline hallway with conveyor rig and node mounts", "Pipeline hallway backdrop", { left: 20, top: 329, width: 800, height: 254 }],
  ["bg-gallery", "gallery wall with five empty frames, banners, spotlights, and rope", "Gallery room backdrop", { left: 838, top: 329, width: 802, height: 254 }],
  ["bg-archive", "archive shelves, scrolls, card catalog, and dusty light shaft", "Archive room backdrop", { left: 20, top: 610, width: 524, height: 310 }],
  ["bg-forge", "lit forge with furnace, anvil, chimney, and tools", "Forge room backdrop", { left: 560, top: 610, width: 520, height: 310 }],
  ["bg-cta", "bright vault chamber with pedestal chest, banners, and final door", "CTA vault room backdrop", { left: 1098, top: 610, width: 540, height: 310 }],
];

for (const [id, desc, subject, rect] of rooms) {
  const png = `public/assets/generated/backdrops/${id}-480x270.png`;
  const webp = `public/assets/generated/backdrops/${id}-480x270.webp`;
  await cropResize(source, rect, png, 480, 270, { fit: "cover" });
  await webpFromPng(png, webp);
  await descriptor({
    id,
    type: "illustration",
    subject,
    description: `${desc}. Opaque 480x270 far-wall room painting for the fixed ASSET CANON virtual stage.`,
    keywords: id.split("-").concat(["room", "backdrop", "gba"]),
    placement: {
      intended_use: `${subject} far-wall background`,
      context: "stage backdrop behind walkable tile and prop layers",
      do: ["draw behind sprites and tilemaps", "keep foreground path clear"],
      dont: ["treat as collision geometry", "scale non-integer in-game"],
    },
    style: { art_style: "GBA pixel room illustration", stroke: "1px selective ink details", shading: "flat cel lighting with ordered dithering" },
    background: "full-bleed",
    dimensions: { master: "480x270", aspect: "16:9" },
    alt_text: subject,
    files: [
      { path: png, size: "480x270", format: "png" },
      { path: webp, size: "480x270", format: "webp" },
    ],
    composition: "Far-wall illustration with lower foreground kept usable for player, collectibles, and prop overlays.",
    source: { model: "built-in image_gen", prompt },
  });
}
