import { descriptor, packSheet } from "./asset-pipeline.mjs";

const source = "public/assets/tmp/generated-image-03-collectibles.png";
const prompt = "CANON QUEST collectible sheet: shards, key, coin, sticker, fused canon artifact; GBA pixel pickups on magenta chroma plate.";
const xs4 = [330, 515, 700, 885];
const xs2 = [325, 515];

const jobs = [
  ["shard-canon", "Canon Shard faceted green crystal pickup with four-frame sparkle spin.", "Canon Shard pickup", 16, 4, 30, xs4],
  ["shard-pipeline", "Pipeline Scroll pickup, a parchment scroll with sky-blue arrow-chain motif and sparkle loop.", "Pipeline Scroll pickup", 16, 4, 135, xs4],
  ["shard-keyring", "Specialist Keyring pickup, a ring carrying five small colored keys with a jingle sparkle loop.", "Specialist Keyring pickup", 16, 4, 245, xs4],
  ["shard-rune", "Descriptor Rune pickup, a magenta runestone with abstract YAML-like engraving and pulsing sparkle.", "Descriptor Rune pickup", 16, 4, 350, xs4],
  ["shard-cog", "Install Cog pickup, a gold and stone gear with a four-frame rotating sparkle loop.", "Install Cog pickup", 16, 4, 460, xs4],
  ["key-canon", "Canon Key pickup, an ornate gold key with a green gem bow and prestige sparkle.", "Canon Key pickup", 16, 4, 555, xs4],
  ["coin", "Classic gold coin pickup with a four-frame spin and star glint.", "Gold coin pickup", 16, 4, 650, xs4],
  ["sticker-easteregg", "Hidden holographic sticker pickup, abstract shimmer badge with two-frame glint.", "Holographic easter egg sticker pickup", 16, 2, 740, xs2],
  ["canon-artifact", "Assembled Canon artifact, the five shard motifs fused into one radiant emblem with two-frame glow pulse.", "Assembled Canon artifact", 32, 2, 835, xs2],
];

for (const [id, desc, subject, cellSize, frames, y, xs] of jobs) {
  const rectSize = id === "canon-artifact" ? { w: 170, h: 165 } : { w: 120, h: 100 };
  const rects = xs.slice(0, frames).map((x) => ({ left: x, top: y, width: rectSize.w, height: rectSize.h }));
  const r = await packSheet({
    source,
    rects,
    dir: "sprites",
    id,
    nativeCell: { w: cellSize, h: cellSize },
    columns: frames,
    anchor: [0.5, 0.5],
    fps: frames === 2 ? 4 : 8,
    clips: { loop: [0, frames - 1] },
  });
  await descriptor({
    id,
    type: "sprite",
    subject,
    description: desc,
    keywords: id.split("-").concat(["collectible", "pickup"]),
    placement: {
      intended_use: `${subject} collectible in CANON QUEST`,
      context: "pickup sprites, HUD arcs, and reward cutscenes",
      do: ["play as short looping sparkle while uncollected", "render at native size then integer-scale"],
      dont: ["use on a non-integer scale", "place on very bright backgrounds without outline"],
    },
    style: { art_style: "GBA pixel pickup", stroke: "1px selective ink outline", shading: "flat cel with dithered glow" },
    background: "transparent",
    dimensions: { master: `${r.w}x${r.h}`, aspect: `${r.w}:${r.h}` },
    alt_text: subject,
    files: [
      { path: r.png, size: `${r.w}x${r.h}`, format: "png" },
      { path: r.webp, size: `${r.w}x${r.h}`, format: "webp" },
      { path: r.json, size: `${r.w}x${r.h}`, format: "json" },
    ],
    animation: {
      sheet: r.png,
      cell: r.cell,
      columns: frames,
      count: frames,
      fps: frames === 2 ? 4 : 8,
      loop: true,
      anchor: [0.5, 0.5],
      clips: { loop: [0, frames - 1] },
    },
    source: { model: "built-in image_gen", prompt },
  });
}
