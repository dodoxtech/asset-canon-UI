import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const outDir = "public/assets/generated/sprites"
const docsDir = "docs/assets"
const name = "demo-navigator"
const cell = { w: 64, h: 64 }
const columns = 4
const rows = 8
const width = cell.w * columns
const height = cell.h * rows
const chroma = [0x00, 0xb1, 0x40, 0xff]

const colors = {
  ink: [0x0b, 0x0e, 0x1a, 0xff],
  shadow: [0x14, 0x1a, 0x30, 0xff],
  navy: [0x1e, 0x2a, 0x44, 0xff],
  coat: [0x3c, 0xa0, 0xff, 0xff],
  coatDark: [0x24, 0x68, 0xb4, 0xff],
  light: [0xe8, 0xec, 0xf8, 0xff],
  gold: [0xff, 0xc8, 0x3c, 0xff],
  goldDark: [0xc8, 0x82, 0x1e, 0xff],
  red: [0xff, 0x5c, 0x5c, 0xff],
  magenta: [0xff, 0x2c, 0xc0, 0xff],
}

await fs.mkdir(outDir, { recursive: true })
await fs.mkdir(docsDir, { recursive: true })

const source = Buffer.alloc(width * height * 4)
const alpha = Buffer.alloc(width * height * 4)

for (let i = 0; i < width * height; i += 1) {
  source.set(chroma, i * 4)
}

function px(buffer, x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) return
  buffer.set(color, (y * width + x) * 4)
}

function rect(buffer, x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) px(buffer, xx, yy, color)
  }
}

function drawBoth(draw) {
  draw(source)
  draw(alpha)
}

function shadow(buffer, ox, oy) {
  rect(buffer, ox + 18, oy + 53, 28, 3, [0x0b, 0x0e, 0x1a, 0x66])
}

function outlineRect(buffer, x, y, w, h, fill) {
  rect(buffer, x - 1, y - 1, w + 2, h + 2, colors.ink)
  rect(buffer, x, y, w, h, fill)
}

function drawHeadDown(buffer, ox, oy, bob) {
  outlineRect(buffer, ox + 22, oy + 11 + bob, 20, 18, colors.light)
  rect(buffer, ox + 21, oy + 9 + bob, 22, 6, colors.goldDark)
  rect(buffer, ox + 25, oy + 17 + bob, 3, 3, colors.ink)
  rect(buffer, ox + 36, oy + 17 + bob, 3, 3, colors.ink)
  rect(buffer, ox + 30, oy + 23 + bob, 5, 2, colors.red)
  rect(buffer, ox + 42, oy + 16 + bob, 3, 7, colors.light)
  rect(buffer, ox + 19, oy + 16 + bob, 3, 7, colors.light)
}

function drawHeadUp(buffer, ox, oy, bob) {
  outlineRect(buffer, ox + 22, oy + 11 + bob, 20, 18, colors.goldDark)
  rect(buffer, ox + 24, oy + 13 + bob, 16, 10, colors.gold)
  rect(buffer, ox + 27, oy + 23 + bob, 10, 3, colors.shadow)
}

function drawHeadRight(buffer, ox, oy, bob) {
  outlineRect(buffer, ox + 22, oy + 12 + bob, 18, 17, colors.light)
  rect(buffer, ox + 23, oy + 10 + bob, 18, 5, colors.goldDark)
  rect(buffer, ox + 36, oy + 17 + bob, 3, 3, colors.ink)
  rect(buffer, ox + 39, oy + 21 + bob, 4, 2, colors.red)
  rect(buffer, ox + 40, oy + 18 + bob, 4, 5, colors.light)
}

function drawHeadLeft(buffer, ox, oy, bob) {
  outlineRect(buffer, ox + 24, oy + 12 + bob, 18, 17, colors.light)
  rect(buffer, ox + 23, oy + 10 + bob, 18, 5, colors.goldDark)
  rect(buffer, ox + 25, oy + 17 + bob, 3, 3, colors.ink)
  rect(buffer, ox + 21, oy + 21 + bob, 4, 2, colors.red)
  rect(buffer, ox + 20, oy + 18 + bob, 4, 5, colors.light)
}

function drawBody(buffer, ox, oy, bob, stance, facing) {
  const legA = stance === 1 ? -2 : stance === 2 ? 2 : 0
  const legB = -legA
  const armA = stance === 1 ? 2 : stance === 2 ? -2 : 0
  const armB = -armA

  outlineRect(buffer, ox + 23, oy + 30 + bob, 18, 17, colors.coat)
  rect(buffer, ox + 30, oy + 31 + bob, 4, 16, colors.coatDark)
  rect(buffer, ox + 27, oy + 35 + bob, 10, 3, colors.gold)

  if (facing === "up") {
    rect(buffer, ox + 25, oy + 31 + bob, 14, 9, colors.navy)
    rect(buffer, ox + 28, oy + 33 + bob, 8, 6, colors.magenta)
  }

  outlineRect(buffer, ox + 17 + armA, oy + 32 + bob, 5, 13, colors.coatDark)
  outlineRect(buffer, ox + 42 + armB, oy + 32 + bob, 5, 13, colors.coatDark)
  outlineRect(buffer, ox + 24 + legA, oy + 47 + bob, 6, 9, colors.navy)
  outlineRect(buffer, ox + 34 + legB, oy + 47 + bob, 6, 9, colors.navy)
  rect(buffer, ox + 23 + legA, oy + 56 + bob, 8, 2, colors.ink)
  rect(buffer, ox + 33 + legB, oy + 56 + bob, 8, 2, colors.ink)
}

function drawFrame(row, col, direction, moving, step) {
  const ox = col * cell.w
  const oy = row * cell.h
  const bob = moving ? (step === 1 || step === 3 ? 1 : 0) : (step === 2 ? 1 : 0)
  const stance = moving ? step % 3 : 0

  drawBoth((buffer) => {
    shadow(buffer, ox, oy)
    drawBody(buffer, ox, oy, bob, stance, direction)
    if (direction === "down") drawHeadDown(buffer, ox, oy, bob)
    if (direction === "up") drawHeadUp(buffer, ox, oy, bob)
    if (direction === "right") drawHeadRight(buffer, ox, oy, bob)
    if (direction === "left") drawHeadLeft(buffer, ox, oy, bob)
  })
}

const idleRows = ["down", "up", "right", "left"]
const walkRows = ["down", "up", "right", "left"]

idleRows.forEach((direction, row) => {
  for (let col = 0; col < columns; col += 1) drawFrame(row, col, direction, false, col)
})

walkRows.forEach((direction, i) => {
  const row = i + 4
  for (let col = 0; col < columns; col += 1) drawFrame(row, col, direction, true, col)
})

const raw = { raw: { width, height, channels: 4 } }
const sourcePath = path.join(outDir, `${name}-source-256x512.png`)
const alphaPath = path.join(outDir, `${name}-alpha-sheet-256x512.png`)
const webpPath = path.join(outDir, `${name}-alpha-sheet-256x512.webp`)
const atlasPath = path.join(outDir, `${name}-alpha-sheet-256x512.json`)

await sharp(source, raw).png({ compressionLevel: 9 }).toFile(sourcePath)
await sharp(alpha, raw).png({ compressionLevel: 9 }).toFile(alphaPath)
await sharp(alpha, raw).webp({ lossless: true }).toFile(webpPath)

const clips = {
  "idle-down": [0, 3],
  "idle-up": [4, 7],
  "idle-right": [8, 11],
  "idle-left": [12, 15],
  "walk-down": [16, 19],
  "walk-up": [20, 23],
  "walk-right": [24, 27],
  "walk-left": [28, 31],
}

const frames = {}
for (let i = 0; i < rows * columns; i += 1) {
  frames[`${name}_${String(i).padStart(2, "0")}`] = {
    x: (i % columns) * cell.w,
    y: Math.floor(i / columns) * cell.h,
    w: cell.w,
    h: cell.h,
  }
}

const atlas = {
  meta: {
    image: `${name}-alpha-sheet-256x512.png`,
    sheet: { w: width, h: height },
    cell,
    gutter: 0,
    columns,
    count: rows * columns,
    fps: 8,
    loop: true,
    anchor: [0.5, 1],
    clips,
  },
  frames,
}

await fs.writeFile(atlasPath, `${JSON.stringify(atlas, null, 2)}\n`)

const pngStats = await fs.stat(alphaPath)
const webpStats = await fs.stat(webpPath)
const sourceStats = await fs.stat(sourcePath)
const jsonStats = await fs.stat(atlasPath)

await fs.writeFile(
  path.join(docsDir, `${name}.yaml`),
  `id: ${name}
type: sprite
subject: Four-direction controllable demo character
description: >
  Pixel-art navigator character generated for the asset-sprite demo. The source
  render uses a chroma-green plate, the output sheet is alpha-keyed, and the
  atlas exposes idle and walk clips for down, up, right, and left movement.
keywords: ["sprite", "character", "wasd", "animation", "asset-sprite"]
placement:
  intended_use: "Interactive WASD demo on the ASSET CANON landing page"
  context: "asset-sprite generation workflow demonstration"
  do: ["render at native size then integer-scale", "use atlas clips for direction state"]
  dont: ["stretch cells", "use chroma plate color inside the sprite", "ignore anchor metadata"]
style:
  art_style: "GBA-style pixel sprite"
  stroke: "1px selective ink outline"
  shading: "flat cel shading"
palette: ["#0B0E1A", "#141A30", "#1E2A44", "#3CA0FF", "#2468B4", "#E8ECF8", "#FFC83C", "#C8821E", "#FF5C5C", "#FF2CC0"]
background:
  source: "#00B140 chroma plate"
  output: transparent
dimensions:
  master: 256x512
  cell: 64x64
  aspect: "1:2"
safe_area: full
accessibility:
  alt_text: "Four-direction pixel character sprite sheet with idle and walk states"
animation:
  sheet: public/assets/generated/sprites/${name}-alpha-sheet-256x512.png
  cell: { w: 64, h: 64 }
  columns: 4
  count: 32
  fps: 8
  loop: true
  anchor: [0.5, 1]
  clips:
    idle-down: [0, 3]
    idle-up: [4, 7]
    idle-right: [8, 11]
    idle-left: [12, 15]
    walk-down: [16, 19]
    walk-up: [20, 23]
    walk-right: [24, 27]
    walk-left: [28, 31]
files:
  - path: public/assets/generated/sprites/${name}-source-256x512.png
    size: 256x512
    format: png
    bytes: ${sourceStats.size}
  - path: public/assets/generated/sprites/${name}-alpha-sheet-256x512.png
    size: 256x512
    format: png
    bytes: ${pngStats.size}
  - path: public/assets/generated/sprites/${name}-alpha-sheet-256x512.webp
    size: 256x512
    format: webp
    bytes: ${webpStats.size}
  - path: public/assets/generated/sprites/${name}-alpha-sheet-256x512.json
    size: 256x512
    format: json
    bytes: ${jsonStats.size}
source:
  tool: "tools/generate-sprite-demo.mjs"
  prompt: "asset-sprite demo: four-direction pixel navigator on #00B140 chroma plate, keyed to transparent output, row-major atlas with idle and walk clips."
  generated: 2026-06-26
`,
)

console.log(`Wrote ${sourcePath}`)
console.log(`Wrote ${alphaPath}`)
console.log(`Wrote ${webpPath}`)
console.log(`Wrote ${atlasPath}`)
console.log(`Wrote ${path.join(docsDir, `${name}.yaml`)}`)
