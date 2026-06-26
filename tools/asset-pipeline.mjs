import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const today = "2026-06-24";

export const palette = [
  "#0B0E1A",
  "#141A30",
  "#1E2A44",
  "#324063",
  "#5B6B96",
  "#8A9AC8",
  "#E8ECF8",
  "#00B140",
  "#3CE07A",
  "#157A3A",
  "#FF2CC0",
  "#FFC83C",
  "#C8821E",
  "#3CA0FF",
  "#FF5C5C",
];

function abs(file) {
  return path.join(root, file);
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(abs(file)), { recursive: true });
}

export async function cropResize(source, rect, out, width, height, options = {}) {
  ensureDir(out);
  if (options.alphaKey && options.keyBeforeResize) {
    const buf = await keyedFrame(source, rect, { w: width, h: height }, options);
    await sharp(buf).png({ compressionLevel: 9 }).toFile(abs(out));
    return;
  }
  let img = sharp(source).extract(rect).resize(width, height, {
    kernel: sharp.kernel.nearest,
    fit: options.fit ?? "fill",
    position: options.position ?? "center",
  });
  if (options.alphaKey) {
    const { data, info } = await img.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    cleanKey(data, info, options.alphaKey, options);
    await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(abs(out));
    return;
  }
  await img.png({ compressionLevel: 9 }).toFile(abs(out));
}

export async function webpFromPng(png, webp) {
  ensureDir(webp);
  await sharp(abs(png)).webp({ lossless: true, quality: 100 }).toFile(abs(webp));
}

export async function keyPng(png, key = "#FF00FF", tolerance = 58) {
  const { data, info } = await sharp(abs(png)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  cleanKey(data, info, key, { tolerance });
  await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(abs(png));
}

export async function makeAtlas({ slug, image, cell, columns, count, fps = 8, loop = true, anchor = [0.5, 1.0], clips, density = 1 }) {
  const rows = Math.ceil(count / columns);
  const frames = {};
  for (let i = 0; i < count; i += 1) {
    frames[`${slug}_${String(i).padStart(2, "0")}`] = {
      x: (i % columns) * cell.w,
      y: Math.floor(i / columns) * cell.h,
      w: cell.w,
      h: cell.h,
    };
  }
  const atlas = {
    meta: {
      image: path.basename(image),
      sheet: { w: columns * cell.w, h: rows * cell.h },
      cell,
      gutter: 0,
      columns,
      count,
      fps,
      loop,
      anchor,
      // Source pixels per logical (world) pixel. The renderer divides frame
      // dimensions by this, so a >1 density is sharper art at the same in-game size.
      density,
      clips: clips ?? { [slug]: [0, count - 1] },
    },
    frames,
  };
  const out = image.replace(/\.png$/, ".json");
  ensureDir(out);
  fs.writeFileSync(abs(out), `${JSON.stringify(atlas, null, 2)}\n`);
}

export async function descriptor(spec) {
  const files = [];
  for (const file of spec.files) {
    const stats = fs.statSync(abs(file.path));
    files.push({ ...file, bytes: stats.size });
  }
  const yaml = [
    `id: ${spec.id}`,
    `type: ${spec.type}`,
    `subject: ${spec.subject}`,
    "description: >",
    indent(spec.description),
    `keywords: [${spec.keywords.map((k) => JSON.stringify(k)).join(", ")}]`,
    "placement:",
    `  intended_use: ${JSON.stringify(spec.placement.intended_use)}`,
    `  context: ${JSON.stringify(spec.placement.context)}`,
    `  do: [${spec.placement.do.map((k) => JSON.stringify(k)).join(", ")}]`,
    `  dont: [${spec.placement.dont.map((k) => JSON.stringify(k)).join(", ")}]`,
    "style:",
    `  art_style: ${JSON.stringify(spec.style.art_style)}`,
    `  stroke: ${JSON.stringify(spec.style.stroke)}`,
    `  shading: ${JSON.stringify(spec.style.shading)}`,
    `palette: [${(spec.palette ?? palette).map((k) => JSON.stringify(k)).join(", ")}]`,
    `background: ${spec.background}`,
    "dimensions:",
    `  master: ${spec.dimensions.master}`,
    `  aspect: ${JSON.stringify(spec.dimensions.aspect)}`,
    `safe_area: ${spec.safe_area ?? "full"}`,
    "accessibility:",
    `  alt_text: ${JSON.stringify(spec.alt_text)}`,
  ];
  if (spec.animation) {
    yaml.push("animation:");
    yaml.push(`  sheet: ${spec.animation.sheet}`);
    yaml.push(`  cell: { w: ${spec.animation.cell.w}, h: ${spec.animation.cell.h} }`);
    yaml.push(`  columns: ${spec.animation.columns}`);
    yaml.push(`  count: ${spec.animation.count}`);
    yaml.push(`  fps: ${spec.animation.fps}`);
    yaml.push(`  loop: ${spec.animation.loop}`);
    yaml.push(`  anchor: [${spec.animation.anchor.join(", ")}]`);
    yaml.push(`  clips: { ${Object.entries(spec.animation.clips).map(([k, v]) => `${k}: [${v.join(", ")}]`).join(", ")} }`);
  }
  if (spec.tileable) {
    yaml.push(`tileable: ${spec.tileable}`);
    yaml.push(`tile_size: ${spec.tile_size}`);
    yaml.push(`tonality: ${spec.tonality}`);
  }
  if (spec.composition) {
    yaml.push(`composition: ${JSON.stringify(spec.composition)}`);
  }
  yaml.push("files:");
  for (const file of files) {
    yaml.push(`  - path: ${file.path}`);
    yaml.push(`    size: ${file.size}`);
    yaml.push(`    format: ${file.format}`);
    yaml.push(`    bytes: ${file.bytes}`);
  }
  yaml.push("source:");
  yaml.push(`  model: ${JSON.stringify(spec.source.model)}`);
  yaml.push(`  prompt: ${JSON.stringify(spec.source.prompt)}`);
  yaml.push(`  generated: ${today}`);
  const out = `docs/assets/${spec.id}.yaml`;
  ensureDir(out);
  fs.writeFileSync(abs(out), `${yaml.join("\n")}\n`);
}

export async function contactCrop(source, rects, out, cell, columns, options = {}) {
  const rows = Math.ceil(rects.length / columns);
  const anchor = options.anchor ?? [0.5, 1.0];
  // Recenter (shared registration) is the default for alpha-keyed cutouts, but
  // never for tile sheets (anchor [0,0] = fill the cell, keep position).
  const recenter =
    options.recenter ?? (Boolean(options.alphaKey) && !(anchor[0] === 0 && anchor[1] === 0));

  const composites = recenter
    ? await registerFrames(source, rects, cell, columns, anchor, options)
    : await fillFrames(source, rects, cell, columns, options);

  ensureDir(out);
  await sharp({
    create: {
      width: columns * cell.w,
      height: rows * cell.h,
      channels: 4,
      background: options.background ?? { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(abs(out));
}

// Full-resolution sprite-sheet builder. Keeps every sprite at its native
// resolution from the source contact sheet (no downscaling) and only chooses how
// many of those source pixels map to one in-game pixel:
//   density D = smallest integer with nativeCell * D >= content bounding box.
// The cell is nativeCell * D, so the in-game logical size stays exactly
// `nativeCell` (the renderer divides frame size by D), while the PNG carries the
// full source detail. Writes png + webp + atlas and returns the geometry.
export async function packSheet({
  source,
  rects,
  dir,
  id,
  nativeCell,
  columns,
  anchor = [0.5, 1.0],
  fps = 8,
  loop = true,
  clips,
  alphaKey = "#FF00FF",
}) {
  // Pass 1: key each frame and find its content box. The hand-authored rects are
  // often a little tight (clipping glow/rays) or catch a sliver of the neighbour
  // frame, so we EXTRACT WITH PADDING, then isolate this frame's sprite with
  // connected-component analysis (drop blobs that reach the padded border — those
  // belong to a neighbour). This makes the result robust to imperfect rects.
  const meta = await sharp(source).metadata();
  const PAD = 44;
  const frames = [];
  for (const rect of rects) {
    const px = Math.max(0, rect.left - PAD);
    const py = Math.max(0, rect.top - PAD);
    const pw = Math.min(meta.width, rect.left + rect.width + PAD) - px;
    const ph = Math.min(meta.height, rect.top + rect.height + PAD) - py;
    const { data, info } = await sharp(source)
      .extract({ left: px, top: py, width: pw, height: ph })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    cleanKey(data, info, alphaKey, {});
    const orig = { x: rect.left - px, y: rect.top - py, w: rect.width, h: rect.height };
    const padSides = {
      L: rect.left - px > 0,
      T: rect.top - py > 0,
      R: px + pw > rect.left + rect.width,
      B: py + ph > rect.top + rect.height,
    };
    selectMainSprite(data, info, orig, padSides);
    const box = contentBox(data, info);
    frames.push({ data, info, box, orig });
  }

  // Registration pivot per axis. An EDGE anchor (0 or 1) pins to the content
  // extreme so feet/top truly line up; a CENTER anchor (0.5) pins to the rect
  // center — the author framed each sprite centered in its rect, so this keeps
  // the body still even when an arm/brush makes the bbox lopsided (no jitter).
  const pivotAxis = (frac, regionStart, regionSize, boxStart, boxSize) => {
    if (frac <= 0) return boxStart;
    if (frac >= 1) return boxStart + boxSize;
    return regionStart + regionSize * frac;
  };

  // How far content reaches on each side of the pivot, across all frames.
  let leftReach = 0;
  let rightReach = 0;
  let upReach = 0;
  let downReach = 0;
  for (const f of frames) {
    if (!f.box) continue;
    const px = pivotAxis(anchor[0], f.orig.x, f.orig.w, f.box.x, f.box.w);
    const py = pivotAxis(anchor[1], f.orig.y, f.orig.h, f.box.y, f.box.h);
    leftReach = Math.max(leftReach, px - f.box.x);
    rightReach = Math.max(rightReach, f.box.x + f.box.w - px);
    upReach = Math.max(upReach, py - f.box.y);
    downReach = Math.max(downReach, f.box.y + f.box.h - py);
    f.px = px;
    f.py = py;
  }

  // Cell must hold the pivot at (anchor·cell) with room for the reach on both
  // sides. Add a small margin so nothing sits flush against the frame edge.
  const margin = 1.06;
  const needW = Math.max(anchor[0] > 0 ? leftReach / anchor[0] : 0, anchor[0] < 1 ? rightReach / (1 - anchor[0]) : 0);
  const needH = Math.max(anchor[1] > 0 ? upReach / anchor[1] : 0, anchor[1] < 1 ? downReach / (1 - anchor[1]) : 0);
  const density = Math.max(
    1,
    Math.ceil(Math.max((needW * margin) / nativeCell.w, (needH * margin) / nativeCell.h)),
  );
  const cell = { w: nativeCell.w * density, h: nativeCell.h * density };
  const rows = Math.ceil(rects.length / columns);
  const anchorPxX = anchor[0] * cell.w;
  const anchorPxY = anchor[1] * cell.h;

  // Pass 2: place each frame at full resolution so its pivot lands on the cell's
  // anchor point — consistent registration => no clipping, no jitter.
  const composites = [];
  for (let i = 0; i < frames.length; i += 1) {
    const f = frames[i];
    if (!f.box) continue;
    const cellLeft = (i % columns) * cell.w;
    const cellTop = Math.floor(i / columns) * cell.h;
    const buf = await sharp(f.data, { raw: f.info })
      .extract({ left: f.box.x, top: f.box.y, width: f.box.w, height: f.box.h })
      .png()
      .toBuffer();
    let left = cellLeft + Math.round(anchorPxX + (f.box.x - f.px));
    let top = cellTop + Math.round(anchorPxY + (f.box.y - f.py));
    left = Math.max(cellLeft, Math.min(left, cellLeft + cell.w - f.box.w));
    top = Math.max(cellTop, Math.min(top, cellTop + cell.h - f.box.h));
    composites.push({ input: buf, left, top });
  }

  const w = cell.w * columns;
  const h = cell.h * rows;
  const png = `public/assets/generated/${dir}/${id}-sheet-${w}x${h}.png`;
  const webp = png.replace(/\.png$/, ".webp");
  const json = png.replace(/\.png$/, ".json");
  ensureDir(png);
  await sharp({
    create: { width: w, height: h, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(abs(png));
  await webpFromPng(png, webp);
  await makeAtlas({ slug: id, image: png, cell, columns, count: rects.length, fps, loop, anchor, clips, density });
  return { png, webp, json, w, h, cell, density, count: rects.length };
}

// Legacy fixed-rect path: extract each rect and stretch it to fill the cell.
// Used for tiles (seamless surfaces that must occupy the whole cell).
async function fillFrames(source, rects, cell, columns, options) {
  const composites = [];
  for (let i = 0; i < rects.length; i += 1) {
    let buf;
    if (options.alphaKey) {
      const { data, info } = await sharp(source)
        .extract(rects[i])
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      cleanKey(data, info, options.alphaKey, options);
      buf = await sharp(data, { raw: info })
        .resize(cell.w, cell.h, { kernel: sharp.kernel.nearest, fit: "fill" })
        .png()
        .toBuffer();
    } else {
      buf = await sharp(source)
        .extract(rects[i])
        .resize(cell.w, cell.h, { kernel: sharp.kernel.nearest, fit: "fill" })
        .png()
        .toBuffer();
    }
    composites.push({ input: buf, left: (i % columns) * cell.w, top: Math.floor(i / columns) * cell.h });
  }
  return composites;
}

// Content-aware registration: key each frame, find its real content box, then
// scale every frame by ONE shared factor and place them against a shared anchor
// inside the cell. This removes the magenta fringe AND the frame-to-frame jitter
// caused by hand-tuned rects — the animation reads centered and stable.
async function registerFrames(source, rects, cell, columns, anchor, options) {
  const key = options.alphaKey ?? "#FF00FF";
  const pad = options.pad ?? 0; // empty pixels to keep inside each cell edge
  const innerW = cell.w - pad * 2;
  const innerH = cell.h - pad * 2;

  // Pass 1: key every frame and record its content box in SOURCE coordinates.
  const frames = [];
  let minL = Infinity;
  let minT = Infinity;
  let maxR = -Infinity;
  let maxB = -Infinity;
  for (const rect of rects) {
    const { data, info } = await sharp(source)
      .extract(rect)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    cleanKey(data, info, key, options);
    const box = contentBox(data, info);
    const f = { data, info, box, rect };
    frames.push(f);
    if (box) {
      minL = Math.min(minL, rect.left + box.x);
      minT = Math.min(minT, rect.top + box.y);
      maxR = Math.max(maxR, rect.left + box.x + box.w);
      maxB = Math.max(maxB, rect.top + box.y + box.h);
    }
  }

  const superW = Math.max(1, maxR - minL);
  const superH = Math.max(1, maxB - minT);
  // Fit the whole animation into the cell, but never upscale past the source
  // resolution (upscaling AI pixels just blurs them).
  const scale = Math.min(innerW / superW, innerH / superH, 1);
  const placedW = superW * scale;
  const placedH = superH * scale;
  const baseX = pad + anchor[0] * (innerW - placedW);
  const baseY = pad + anchor[1] * (innerH - placedH);

  // Pass 2: crop each frame to its content, scale by the shared factor, and
  // place it at its true offset within the shared bounding box.
  const composites = [];
  for (let i = 0; i < frames.length; i += 1) {
    const f = frames[i];
    const cellLeft = (i % columns) * cell.w;
    const cellTop = Math.floor(i / columns) * cell.h;
    if (!f.box) continue; // empty frame -> transparent cell
    const tw = Math.max(1, Math.round(f.box.w * scale));
    const th = Math.max(1, Math.round(f.box.h * scale));
    const buf = await sharp(f.data, { raw: f.info })
      .extract({ left: f.box.x, top: f.box.y, width: f.box.w, height: f.box.h })
      .resize(tw, th, { kernel: sharp.kernel.lanczos3, fit: "fill" })
      .png()
      .toBuffer();
    const srcL = f.rect.left + f.box.x;
    const srcT = f.rect.top + f.box.y;
    let left = cellLeft + Math.round(baseX + (srcL - minL) * scale);
    let top = cellTop + Math.round(baseY + (srcT - minT) * scale);
    // Clamp inside the cell so rounding never bleeds into a neighbour.
    left = Math.max(cellLeft, Math.min(left, cellLeft + cell.w - tw));
    top = Math.max(cellTop, Math.min(top, cellTop + cell.h - th));
    composites.push({ input: buf, left, top });
  }
  return composites;
}

// Isolate this frame's sprite from a PADDED region (raw RGBA, in place). Labels
// connected opaque blobs and clears any that don't belong:
//   - a blob touching a padded border is bleeding in from a neighbour frame;
//   - a blob with no pixels inside the original rect isn't this sprite;
//   - tiny specks (< 4% of the main blob) are keying noise.
// The main body and its CONNECTED glow/rays (which extend into the padding but
// don't reach the border) are kept whole.
function selectMainSprite(data, info, orig, padSides) {
  const { width, height } = info;
  const label = new Int32Array(width * height).fill(-1);
  const blobs = [];
  const stack = [];
  for (let s = 0; s < width * height; s += 1) {
    if (label[s] !== -1 || data[s * 4 + 3] <= 16) continue;
    const id = blobs.length;
    let count = 0;
    let inOrig = false;
    let border = false;
    label[s] = id;
    stack.push(s);
    while (stack.length) {
      const p = stack.pop();
      const x = p % width;
      const y = (p - x) / width;
      count += 1;
      if (x >= orig.x && x < orig.x + orig.w && y >= orig.y && y < orig.y + orig.h) inOrig = true;
      if ((x === 0 && padSides.L) || (x === width - 1 && padSides.R) || (y === 0 && padSides.T) || (y === height - 1 && padSides.B)) border = true;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if (!dx && !dy) continue;
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const np = ny * width + nx;
          if (label[np] === -1 && data[np * 4 + 3] > 16) {
            label[np] = id;
            stack.push(np);
          }
        }
      }
    }
    blobs.push({ id, count, inOrig, border });
  }
  // Main blob: the largest that belongs to this frame (inside the rect, not bled).
  let mainCount = 0;
  for (const b of blobs) if (b.inOrig && !b.border) mainCount = Math.max(mainCount, b.count);
  const keep = new Uint8Array(blobs.length);
  for (const b of blobs) {
    keep[b.id] = b.inOrig && !b.border && b.count >= Math.max(2, mainCount * 0.04) ? 1 : 0;
  }
  if (mainCount === 0) return; // sprite fills the region (clamped at image edge) — keep all
  for (let p = 0; p < width * height; p += 1) {
    const l = label[p];
    if (l >= 0 && !keep[l]) data[p * 4 + 3] = 0;
  }
}

// Tightest box of opaque content. A column/row needs >=2 opaque pixels to count,
// so a stray keyed-edge speck can't balloon the box and shrink the sprite.
export function contentBox(data, info) {
  const { width, height } = info;
  const colCount = new Uint32Array(width);
  const rowCount = new Uint32Array(height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (data[(y * width + x) * 4 + 3] > 16) {
        colCount[x] += 1;
        rowCount[y] += 1;
      }
    }
  }
  let minX = -1;
  let maxX = -1;
  let minY = -1;
  let maxY = -1;
  for (let x = 0; x < width; x += 1) if (colCount[x] >= 2) { if (minX < 0) minX = x; maxX = x; }
  for (let y = 0; y < height; y += 1) if (rowCount[y] >= 2) { if (minY < 0) minY = y; maxY = y; }
  if (minX < 0 || minY < 0) return null;
  return { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

async function keyedFrame(source, rect, cell, options) {
  const key = options.alphaKey ?? "#FF00FF";
  const { data, info } = await sharp(source).extract(rect).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  cleanKey(data, info, key, options);
  return sharp(data, { raw: info })
    .resize(cell.w, cell.h, { kernel: sharp.kernel.nearest, fit: "fill" })
    .png()
    .toBuffer();
}

// Clean chroma key (operates on raw RGBA in place):
//   1. Border flood-fill removes only background-connected plate pixels (no
//      interior holes punched in the sprite).
//   2. Edge pass eats the heavy magenta fringe ring left by anti-aliasing.
//   3. Despill neutralises the residual magenta cast so no pink halo remains.
// Tuned for the magenta plate (#FF00FF); falls back to plain distance keying for
// any other key colour.
export function cleanKey(data, info, key = "#FF00FF", options = {}) {
  const { width, height } = info;
  const [kr, kg, kb] = hexToRgb(key);
  const magenta = kr > 200 && kg < 80 && kb > 200;
  const tol = options.tolerance ?? 220;

  const isPlate = (i) => {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (magenta) {
      // Strong magenta cast: both red and blue clearly above green.
      return r > 110 && b > 110 && Math.min(r, b) - g >= 45;
    }
    return Math.abs(r - kr) + Math.abs(g - kg) + Math.abs(b - kb) <= tol;
  };

  // 1. Flood from the borders.
  const visited = new Uint8Array(width * height);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    if (isPlate(p * 4)) {
      data[p * 4 + 3] = 0;
      stack.push(p);
    }
  };
  for (let x = 0; x < width; x += 1) {
    push(x, 0);
    push(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    push(0, y);
    push(width - 1, y);
  }
  while (stack.length) {
    const p = stack.pop();
    const x = p % width;
    const y = (p - x) / width;
    push(x + 1, y);
    push(x - 1, y);
    push(x, y + 1);
    push(x, y - 1);
  }

  if (magenta) {
    // 2. Eat the heavy fringe ring: surviving pixels touching transparency that
    //    still read strongly magenta are anti-aliasing, not sprite.
    const edgeM = options.edgeFringe ?? 25;
    const toClear = [];
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const p = y * width + x;
        const i = p * 4;
        if (data[i + 3] === 0) continue;
        const m = Math.min(data[i], data[i + 2]) - data[i + 1];
        if (m <= edgeM) continue;
        const hasClearNeighbour =
          (x > 0 && data[(p - 1) * 4 + 3] === 0) ||
          (x < width - 1 && data[(p + 1) * 4 + 3] === 0) ||
          (y > 0 && data[(p - width) * 4 + 3] === 0) ||
          (y < height - 1 && data[(p + width) * 4 + 3] === 0);
        if (hasClearNeighbour) toClear.push(i);
      }
    }
    for (const i of toClear) data[i + 3] = 0;

    // 3. Despill remaining pixels (pull red/blue down to green where magenta-cast).
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const m = Math.min(data[i], data[i + 2]) - data[i + 1];
      if (m > 0) {
        data[i] -= m;
        data[i + 2] -= m;
      }
    }
  }
}

function indent(text) {
  return String(text)
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");
}

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  return [
    Number.parseInt(clean.slice(0, 2), 16),
    Number.parseInt(clean.slice(2, 4), 16),
    Number.parseInt(clean.slice(4, 6), 16),
  ];
}
