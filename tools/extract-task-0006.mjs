import { descriptor, packSheet } from "./asset-pipeline.mjs";

const source = "public/assets/tmp/generated-image-06-props-doors.png";
const prompt = "CANON QUEST animated props and doors sheet: lamps, conveyor, pipeline nodes, frames, scroll shelf, furnace, anvil sparks, doors, chest on magenta chroma plate.";

const jobs = [
  ["prop-lamp", "Workshop hanging lamp with off and warm on/flicker frames.", "Workshop lamp prop", { w: 16, h: 24 }, 2, 2, 4, [[70, 35, 120, 145], [245, 35, 120, 145]]],
  ["prop-conveyor-belt", "Four-frame hallway conveyor segment scroll loop.", "Conveyor belt prop", { w: 16, h: 16 }, 4, 4, 8, [[50, 215, 190, 75], [300, 215, 190, 75], [540, 215, 190, 75], [775, 215, 190, 75]]],
  ["prop-pipeline-nodes", "Six pipeline nodes with unlit and lit states for BRIEF, PLAN, GEN, OPT, WRITE, REPORT.", "Pipeline node pair sheet", { w: 16, h: 16 }, 6, 12, 1, [
    [55, 325, 105, 85], [175, 325, 105, 85], [375, 325, 105, 85], [495, 325, 105, 85], [695, 325, 105, 85], [815, 325, 105, 85],
    [55, 440, 105, 85], [175, 440, 105, 85], [375, 440, 105, 85], [495, 440, 105, 85], [695, 440, 105, 85], [815, 440, 105, 85],
  ]],
  ["prop-frame-empty", "Dark empty gallery picture frame for unrevealed skill samples.", "Empty gallery frame prop", { w: 24, h: 24 }, 1, 1, 1, [[55, 555, 125, 150]]],
  ["prop-frame-lit", "Five lit gallery frames showing icon, illustration, sprite, texture, and social-card samples.", "Lit gallery sample frames", { w: 24, h: 24 }, 5, 5, 1, [[225, 555, 125, 150], [390, 555, 125, 150], [550, 555, 125, 150], [710, 555, 125, 150], [855, 555, 125, 150]]],
  ["prop-scroll-shelf", "Archive YAML-scroll shelf, dark to glowing four-frame ramp.", "Glowing scroll shelf prop", { w: 16, h: 16 }, 4, 4, 6, [[50, 750, 190, 85], [250, 750, 190, 85], [445, 750, 190, 85], [635, 750, 190, 85]]],
  ["prop-furnace", "Forge furnace with cold frame plus four-frame ignited fire loop.", "Forge furnace prop", { w: 32, h: 32 }, 5, 5, 8, [[45, 885, 165, 125], [235, 885, 165, 125], [430, 885, 165, 125], [625, 885, 165, 125], [815, 885, 165, 125]]],
  ["prop-anvil-sparks", "Three-frame additive anvil spark burst.", "Anvil spark burst prop", { w: 16, h: 16 }, 3, 3, 10, [[55, 1035, 160, 95], [245, 1035, 160, 95], [435, 1035, 160, 95]]],
  ["door-locked", "Closed final door with glowing lock.", "Locked final door", { w: 24, h: 32 }, 1, 1, 1, [[55, 1170, 140, 180]]],
  ["door-lockbreak", "Three-frame final door lock-shatter reveal.", "Door lock break animation", { w: 24, h: 32 }, 3, 3, 8, [[245, 1170, 140, 180], [430, 1170, 140, 180], [615, 1170, 140, 180]]],
  ["door-open", "Two-frame open final door with warm light spill.", "Open final door", { w: 24, h: 32 }, 2, 2, 4, [[710, 1170, 140, 180], [850, 1170, 140, 180]]],
  ["prop-chest", "Treasure chest closed then three-frame lid bounce-open with golden burst.", "CTA treasure chest prop", { w: 32, h: 24 }, 4, 4, 8, [[55, 1360, 170, 125], [255, 1360, 170, 125], [490, 1360, 170, 125], [730, 1360, 170, 125]]],
];

for (const [id, desc, subject, cell0, columns, count, fps, rectList] of jobs) {
  const rects = rectList.map(([left, top, width, height]) => ({ left, top, width, height }));
  const r = await packSheet({
    source,
    rects,
    dir: "sprites",
    id,
    nativeCell: cell0,
    columns,
    anchor: [0.5, 1.0],
    fps,
    loop: count > 1,
    clips: { [id.replace("prop-", "").replace("door-", "")]: [0, count - 1] },
  });
  await descriptor({
    id,
    type: "sprite",
    subject,
    description: desc,
    keywords: id.split("-").concat(["prop", "animation"]),
    placement: {
      intended_use: `${subject} in the CANON QUEST room reward flow`,
      context: "interactive props, reveal states, and room activation animations",
      do: ["use atlas metadata for state frames", "render at native size then integer-scale"],
      dont: ["anti-alias", "stretch cells", "detach lit/on frames from pickup state"],
    },
    style: { art_style: "GBA pixel prop sprite", stroke: "1px selective ink outline", shading: "flat cel with dithered glow" },
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
      columns,
      count,
      fps,
      loop: count > 1,
      anchor: [0.5, 1.0],
      clips: { [id.replace("prop-", "").replace("door-", "")]: [0, count - 1] },
    },
    source: { model: "built-in image_gen", prompt },
  });
}
