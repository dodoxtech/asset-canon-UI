// Non-destructive recorder: drop-in replacement for asset-pipeline.mjs used only
// to CAPTURE every rect each extract script passes, without touching pixels.
// Run a task script with its import rewritten to this file and REC_OUT set.
import fs from "node:fs";

const OUT = process.env.REC_OUT;
function rec(o) {
  fs.appendFileSync(OUT, `${JSON.stringify(o)}\n`);
}

export const palette = [];

export async function packSheet(a) {
  rec({ fn: "packSheet", source: a.source, dir: a.dir, id: a.id, nativeCell: a.nativeCell, columns: a.columns, anchor: a.anchor, rects: a.rects });
  return { png: `public/assets/generated/${a.dir}/${a.id}-x.png`, webp: "x.webp", json: "x.json", w: 0, h: 0, cell: a.nativeCell, density: 1, count: a.rects.length };
}

export async function contactCrop(source, rects, out, cell, columns, options = {}) {
  rec({ fn: "contactCrop", source, out, cell, columns, anchor: options.anchor, alphaKey: options.alphaKey, rects });
}

export async function cropResize(source, rect, out, width, height, options = {}) {
  rec({ fn: "cropResize", source, out, width, height, alphaKey: options.alphaKey, rects: [rect] });
}

export async function makeAtlas() {}
export async function webpFromPng() {}
export async function keyPng() {}
export async function descriptor() {}
