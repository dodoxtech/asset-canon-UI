// Verify every captured rect against the real source pixels.
// For each rect: key it, find the content box, and report:
//   - EMPTY  : no sprite content (rect misplaced)
//   - CLIP<edges> : content touches a region edge (rect too tight there)
//   - tight margin on any side (< MARGIN px)
// Also renders an overlay per source image with rect boxes colour-coded.
import fs from "node:fs";
import sharp from "sharp";
import { cleanKey, contentBox } from "./asset-pipeline.mjs";

const REC = process.env.REC_OUT;
const OUTDIR = process.env.OUTDIR;
const MARGIN = 3; // px of breathing room expected on each side

const jobs = fs.readFileSync(REC, "utf8").trim().split("\n").map((l) => JSON.parse(l));

// Group rects by source, tagging each with its job id + frame index.
const bySource = new Map();
for (const j of jobs) {
  if (!j.source || !j.source.includes("/tmp/")) continue; // skip non-tmp (derived) sources
  const list = bySource.get(j.source) ?? [];
  j.rects.forEach((r, i) => list.push({ ...r, id: j.id ?? j.out?.split("/").pop(), frame: i, alphaKey: j.alphaKey }));
  bySource.set(j.source, list);
}

const report = [];
for (const [source, rects] of bySource) {
  const meta = await sharp(source).metadata();
  const sName = source.split("/").pop();
  const overlay = [];
  for (const r of rects) {
    // Clamp rect to image to avoid extract errors, note if it overflows the sheet.
    const overflow =
      r.left < 0 || r.top < 0 || r.left + r.width > meta.width || r.top + r.height > meta.height;
    const ex = {
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      width: Math.min(r.width, meta.width - Math.max(0, r.left)),
      height: Math.min(r.height, meta.height - Math.max(0, r.top)),
    };
    const { data, info } = await sharp(source).extract(ex).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    cleanKey(data, info, r.alphaKey ?? "#FF00FF", {});
    const box = contentBox(data, info);
    let status = "ok";
    const flags = [];
    if (!box) {
      status = "EMPTY";
    } else {
      const mL = box.x;
      const mT = box.y;
      const mR = info.width - (box.x + box.w);
      const mB = info.height - (box.y + box.h);
      const clipped = [];
      if (mL <= 0) clipped.push("L");
      if (mT <= 0) clipped.push("T");
      if (mR <= 0) clipped.push("R");
      if (mB <= 0) clipped.push("B");
      if (clipped.length) {
        status = "CLIP";
        flags.push(clipped.join(""));
      } else if (Math.min(mL, mT, mR, mB) < MARGIN) {
        status = "TIGHT";
        flags.push(`mL${mL} mT${mT} mR${mR} mB${mB}`);
      }
      // fill ratio: how much of the region the content occupies (very low => maybe noise/partial)
      const fill = ((box.w * box.h) / (info.width * info.height)).toFixed(2);
      r._fill = fill;
    }
    if (overflow) {
      status = status === "ok" ? "OVERFLOW" : `${status}+OVERFLOW`;
    }
    report.push({ source: sName, id: r.id, frame: r.frame, rect: `${r.left},${r.top} ${r.width}x${r.height}`, status, flags: flags.join(" "), fill: r._fill });

    const color = status === "ok" ? "#00ff00" : status === "TIGHT" ? "#ffd000" : "#ff2020";
    overlay.push(
      `<rect x="${r.left}" y="${r.top}" width="${r.width}" height="${r.height}" fill="none" stroke="${color}" stroke-width="3"/>`,
      `<text x="${r.left + 3}" y="${r.top + 16}" font-size="14" fill="${color}" font-family="monospace">${r.id ?? ""}:${r.frame}${status === "ok" ? "" : " " + status}</text>`,
    );
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}">${overlay.join("")}</svg>`;
  const out = `${OUTDIR}/overlay-${sName}`;
  await sharp(source).composite([{ input: Buffer.from(svg), top: 0, left: 0 }]).png().toFile(out);
}

// Print a compact table, problems first.
const order = { EMPTY: 0, OVERFLOW: 1, "CLIP+OVERFLOW": 1, CLIP: 2, TIGHT: 3, ok: 9 };
report.sort((a, b) => (order[a.status] ?? 5) - (order[b.status] ?? 5));
const bad = report.filter((r) => r.status !== "ok");
console.log(`\nRECTS: ${report.length} total, ${bad.length} flagged\n`);
console.log("STATUS    SOURCE                                  ID:FRAME            RECT                 DETAIL");
for (const r of report) {
  if (r.status === "ok") continue;
  console.log(
    `${r.status.padEnd(9)} ${r.source.padEnd(39)} ${(`${r.id}:${r.frame}`).padEnd(19)} ${r.rect.padEnd(20)} ${r.flags}`,
  );
}
console.log(`\nOK rects: ${report.length - bad.length}. Overlays written to ${OUTDIR}/overlay-*.png`);
