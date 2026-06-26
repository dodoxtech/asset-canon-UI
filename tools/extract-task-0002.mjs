import { descriptor, packSheet } from "./asset-pipeline.mjs";

const source = "public/assets/tmp/generated-image-02-characters.png";
const prompt = "CANON QUEST character production sheet: Pix idle/tired/walk/pickup and Cano float/react/point, GBA pixel art, magenta chroma plate.";

const jobs = [
  {
    id: "pix-idle-tired",
    dir: "sprites",
    cell: { w: 16, h: 24 },
    columns: 2,
    fps: 2,
    rects: [
      { left: 205, top: 50, width: 120, height: 235 },
      { left: 372, top: 50, width: 120, height: 235 },
    ],
    desc: "Two-frame tired idle of Pix with slumped, sleepy posture for the dim opening workshop state.",
    subject: "Pix tired idle animation",
    clips: { idle_tired: [0, 1] },
  },
  {
    id: "pix-idle",
    dir: "sprites",
    cell: { w: 16, h: 24 },
    columns: 2,
    fps: 3,
    rects: [
      { left: 205, top: 300, width: 120, height: 235 },
      { left: 372, top: 300, width: 120, height: 235 },
    ],
    desc: "Two-frame default Pix idle, upright and alert after the studio lights up.",
    subject: "Pix default idle animation",
    clips: { idle: [0, 1] },
  },
  {
    id: "pix-walk",
    dir: "sprites",
    cell: { w: 16, h: 24 },
    columns: 4,
    fps: 8,
    rects: [
      { left: 205, top: 548, width: 120, height: 235 },
      { left: 372, top: 548, width: 120, height: 235 },
      { left: 575, top: 548, width: 120, height: 235 },
      { left: 742, top: 548, width: 120, height: 235 },
    ],
    desc: "Four-frame right-facing Pix walk cycle with frame 1 as the grounded contact pose and a small brush sway.",
    subject: "Pix walk animation",
    clips: { walk: [0, 3] },
  },
  {
    id: "pix-pickup",
    dir: "sprites",
    cell: { w: 16, h: 24 },
    columns: 3,
    fps: 8,
    rects: [
      { left: 190, top: 807, width: 135, height: 240 },
      { left: 370, top: 790, width: 150, height: 260 },
      { left: 575, top: 807, width: 120, height: 235 },
    ],
    desc: "Three-frame Pix pickup animation: crouch, arms-up shard cheer, and settle.",
    subject: "Pix pickup animation",
    clips: { pickup: [0, 2] },
  },
  {
    id: "cano-float",
    dir: "sprites",
    cell: { w: 12, h: 12 },
    columns: 4,
    fps: 6,
    rects: [
      { left: 250, top: 1048, width: 95, height: 95 },
      { left: 420, top: 1048, width: 95, height: 95 },
      { left: 590, top: 1048, width: 95, height: 95 },
      { left: 760, top: 1048, width: 95, height: 95 },
    ],
    desc: "Four-frame Cano hover loop, a tiny canon-green cursor spirit with eyes and a contained dithered glow halo.",
    subject: "Cano floating companion animation",
    clips: { float: [0, 3] },
  },
  {
    id: "cano-react",
    dir: "sprites",
    cell: { w: 12, h: 12 },
    columns: 2,
    fps: 8,
    rects: [
      { left: 250, top: 1228, width: 95, height: 95 },
      { left: 420, top: 1228, width: 95, height: 95 },
    ],
    desc: "Two-frame Cano happy reaction, squash-and-stretch with scrunched smiling eyes.",
    subject: "Cano happy reaction animation",
    clips: { react: [0, 1] },
  },
  {
    id: "cano-point",
    dir: "sprites",
    cell: { w: 12, h: 12 },
    columns: 2,
    fps: 4,
    rects: [
      { left: 235, top: 1390, width: 130, height: 95 },
      { left: 405, top: 1390, width: 130, height: 95 },
    ],
    desc: "Two-frame Cano pointing nudge, stretching into an arrow-tail toward the next uncollected shard.",
    subject: "Cano pointing companion animation",
    clips: { point: [0, 1] },
  },
];

for (const job of jobs) {
  const r = await packSheet({
    source,
    rects: job.rects,
    dir: job.dir,
    id: job.id,
    nativeCell: job.cell,
    columns: job.columns,
    anchor: [0.5, 1.0],
    fps: job.fps,
    clips: job.clips,
  });
  await descriptor({
    id: job.id,
    type: "sprite",
    subject: job.subject,
    description: job.desc,
    keywords: job.id.split("-").concat(["sprite", "animation"]),
    placement: {
      intended_use: `${job.subject} in the CANON QUEST stage`,
      context: "player and companion animation sheets",
      do: ["render at native size then integer-scale", "use atlas metadata for frame timing"],
      dont: ["anti-alias", "stretch cells", "recolor outside the shared palette"],
    },
    style: { art_style: "GBA pixel sprite", stroke: "1px selective ink outline", shading: "flat cel with ordered dithering" },
    background: "transparent",
    dimensions: { master: `${r.w}x${r.h}`, aspect: `${r.w}:${r.h}` },
    alt_text: job.subject,
    files: [
      { path: r.png, size: `${r.w}x${r.h}`, format: "png" },
      { path: r.webp, size: `${r.w}x${r.h}`, format: "webp" },
      { path: r.json, size: `${r.w}x${r.h}`, format: "json" },
    ],
    animation: {
      sheet: r.png,
      cell: r.cell,
      columns: job.columns,
      count: job.rects.length,
      fps: job.fps,
      loop: true,
      anchor: [0.5, 1.0],
      clips: job.clips,
    },
    source: { model: "built-in image_gen", prompt },
  });
}
