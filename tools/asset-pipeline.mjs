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
  let img = sharp(source).extract(rect).resize(width, height, {
    kernel: sharp.kernel.nearest,
    fit: options.fit ?? "fill",
    position: options.position ?? "center",
  });
  if (options.alphaKey) {
    img = img.ensureAlpha().raw();
    const { data, info } = await img.toBuffer({ resolveWithObject: true });
    const [kr, kg, kb] = hexToRgb(options.alphaKey);
    const tolerance = options.tolerance ?? 36;
    for (let i = 0; i < data.length; i += 4) {
      const d = Math.abs(data[i] - kr) + Math.abs(data[i + 1] - kg) + Math.abs(data[i + 2] - kb);
      if (d <= tolerance) data[i + 3] = 0;
    }
    await sharp(data, { raw: info }).png({ compressionLevel: 9 }).toFile(abs(out));
    return;
  }
  await img.png({ compressionLevel: 9 }).toFile(abs(out));
}

export async function webpFromPng(png, webp) {
  ensureDir(webp);
  await sharp(abs(png)).webp({ lossless: true, quality: 100 }).toFile(abs(webp));
}

export async function makeAtlas({ slug, image, cell, columns, count, fps = 8, loop = true, anchor = [0.5, 1.0], clips }) {
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
  const composites = [];
  for (let i = 0; i < rects.length; i += 1) {
    const buf = await sharp(source)
      .extract(rects[i])
      .resize(cell.w, cell.h, { kernel: sharp.kernel.nearest, fit: "fill" })
      .png()
      .toBuffer();
    composites.push({
      input: buf,
      left: (i % columns) * cell.w,
      top: Math.floor(i / columns) * cell.h,
    });
  }
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
