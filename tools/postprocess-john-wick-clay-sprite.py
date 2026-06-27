#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from collections import deque
from pathlib import Path

from PIL import Image, ImageOps


SLUG = "john-wick-clay"
OUT_DIR = Path("public/assets/generated/sprites")
DOCS_DIR = Path("docs/assets")
CELL = 128
COLUMNS = 8
ROWS = 8
SHEET_W = CELL * COLUMNS
SHEET_H = CELL * ROWS


def is_green_key(r: int, g: int, b: int) -> bool:
    return g > 70 and g > r * 1.12 and g > b * 1.12


def key_green_to_alpha(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pixels[x, y]
            if is_green_key(r, g, b):
                pixels[x, y] = (r, g, b, 0)
    return rgba


def find_components(img: Image.Image) -> list[tuple[int, int, int, int]]:
    rgba = img.convert("RGBA")
    width, height = rgba.size
    pixels = rgba.load()
    mask = bytearray(width * height)
    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            if not is_green_key(r, g, b):
                mask[y * width + x] = 1

    visited = bytearray(width * height)
    components: list[tuple[int, int, int, int]] = []
    for y in range(height):
        for x in range(width):
            idx = y * width + x
            if not mask[idx] or visited[idx]:
                continue

            q: deque[tuple[int, int]] = deque([(x, y)])
            visited[idx] = 1
            min_x = max_x = x
            min_y = max_y = y
            count = 0

            while q:
                cx, cy = q.popleft()
                count += 1
                min_x = min(min_x, cx)
                max_x = max(max_x, cx)
                min_y = min(min_y, cy)
                max_y = max(max_y, cy)
                for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                    if nx < 0 or ny < 0 or nx >= width or ny >= height:
                        continue
                    nidx = ny * width + nx
                    if mask[nidx] and not visited[nidx]:
                        visited[nidx] = 1
                        q.append((nx, ny))

            box = (min_x, min_y, max_x + 1, max_y + 1)
            box_w = box[2] - box[0]
            box_h = box[3] - box[1]
            if count > 500 and box_w > 20 and box_h > 35:
                components.append(box)

    return components


def group_rows(boxes: list[tuple[int, int, int, int]]) -> list[list[tuple[int, int, int, int]]]:
    boxes = sorted(boxes, key=lambda b: ((b[1] + b[3]) / 2, (b[0] + b[2]) / 2))
    rows: list[list[tuple[int, int, int, int]]] = []
    for box in boxes:
        cy = (box[1] + box[3]) / 2
        placed = False
        for row in rows:
            row_cy = sum((b[1] + b[3]) / 2 for b in row) / len(row)
            avg_h = sum(b[3] - b[1] for b in row) / len(row)
            if abs(cy - row_cy) < avg_h * 0.58:
                row.append(box)
                placed = True
                break
        if not placed:
            rows.append([box])

    rows = [sorted(row, key=lambda b: (b[0] + b[2]) / 2) for row in rows]
    return sorted(rows, key=lambda row: sum((b[1] + b[3]) / 2 for b in row) / len(row))


def fit_sprite(sprite: Image.Image, transparent: bool) -> Image.Image:
    keyed = key_green_to_alpha(sprite)
    bbox = keyed.getchannel("A").getbbox()
    if not bbox:
        return Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0) if transparent else (0, 177, 64, 255))

    content = keyed.crop(bbox)
    scale = min(104 / content.width, 120 / content.height)
    size = (max(1, round(content.width * scale)), max(1, round(content.height * scale)))
    content = content.resize(size, Image.Resampling.LANCZOS)

    bg = (0, 0, 0, 0) if transparent else (0, 177, 64, 255)
    out = Image.new("RGBA", (CELL, CELL), bg)
    x = (CELL - content.width) // 2
    y = CELL - content.height - 4
    out.alpha_composite(content, (x, y))
    return out


def pick(row: list[Image.Image], count: int) -> list[Image.Image]:
    if len(row) >= count:
        return row[:count]
    if not row:
        return [Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0)) for _ in range(count)]
    out = list(row)
    while len(out) < count:
        out.append(row[len(out) % len(row)])
    return out


def idle_row(row: list[Image.Image]) -> list[Image.Image]:
    four = pick(row, 4)
    return four + four


def build_sheets(source: Image.Image) -> tuple[Image.Image, Image.Image]:
    boxes = find_components(source)
    rows = group_rows(boxes)
    if len(rows) < 6:
        raise RuntimeError(f"Expected at least 6 detected rows, found {len(rows)}")

    transparent_rows: list[list[Image.Image]] = []
    source_rows: list[list[Image.Image]] = []
    for row in rows:
        transparent_frames = [fit_sprite(source.crop(box), True) for box in row]
        source_frames = [fit_sprite(source.crop(box), False) for box in row]
        transparent_rows.append(transparent_frames)
        source_rows.append(source_frames)

    down_idle_t = idle_row(transparent_rows[0])
    down_walk_t = pick(transparent_rows[1], 8)
    left_idle_t = idle_row(transparent_rows[2])
    left_walk_t = pick(transparent_rows[3], 8)
    right_idle_t = [ImageOps.mirror(frame) for frame in left_idle_t]
    right_walk_t = [ImageOps.mirror(frame) for frame in left_walk_t]
    up_idle_t = idle_row(transparent_rows[-2])
    up_walk_t = pick(transparent_rows[-1], 8)

    down_idle_s = idle_row(source_rows[0])
    down_walk_s = pick(source_rows[1], 8)
    left_idle_s = idle_row(source_rows[2])
    left_walk_s = pick(source_rows[3], 8)
    right_idle_s = [ImageOps.mirror(frame) for frame in left_idle_s]
    right_walk_s = [ImageOps.mirror(frame) for frame in left_walk_s]
    up_idle_s = idle_row(source_rows[-2])
    up_walk_s = pick(source_rows[-1], 8)

    ordered_t = [down_idle_t, down_walk_t, left_idle_t, left_walk_t, right_idle_t, right_walk_t, up_idle_t, up_walk_t]
    ordered_s = [down_idle_s, down_walk_s, left_idle_s, left_walk_s, right_idle_s, right_walk_s, up_idle_s, up_walk_s]

    alpha_sheet = Image.new("RGBA", (SHEET_W, SHEET_H), (0, 0, 0, 0))
    source_sheet = Image.new("RGBA", (SHEET_W, SHEET_H), (0, 177, 64, 255))
    for row_i, row in enumerate(ordered_t):
        for col_i, frame in enumerate(row):
            alpha_sheet.alpha_composite(frame, (col_i * CELL, row_i * CELL))
    for row_i, row in enumerate(ordered_s):
        for col_i, frame in enumerate(row):
            source_sheet.alpha_composite(frame, (col_i * CELL, row_i * CELL))

    return source_sheet, alpha_sheet


def write_atlas(path: Path) -> None:
    clips = {
        "idle-down": [0, 3],
        "walk-down": [8, 15],
        "idle-left": [16, 19],
        "walk-left": [24, 31],
        "idle-right": [32, 35],
        "walk-right": [40, 47],
        "idle-up": [48, 51],
        "walk-up": [56, 63],
    }
    frames = {
        f"{SLUG}_{i:02d}": {
            "x": (i % COLUMNS) * CELL,
            "y": (i // COLUMNS) * CELL,
            "w": CELL,
            "h": CELL,
        }
        for i in range(COLUMNS * ROWS)
    }
    atlas = {
        "meta": {
            "image": f"{SLUG}-sheet-1024x1024.png",
            "sheet": {"w": SHEET_W, "h": SHEET_H},
            "cell": {"w": CELL, "h": CELL},
            "gutter": 0,
            "columns": COLUMNS,
            "count": COLUMNS * ROWS,
            "fps": 10,
            "loop": True,
            "anchor": [0.5, 1],
            "clips": clips,
            "note": "Idle rows contain four unique frames repeated once to keep a gapless 8-column sheet.",
        },
        "frames": frames,
    }
    path.write_text(json.dumps(atlas, indent=2) + "\n", encoding="utf-8")


def write_yaml(path: Path, sizes: dict[str, int], prompt: str) -> None:
    path.write_text(
        f"""id: {SLUG}
type: sprite
subject: John Wick-inspired realistic handmade clay assassin sprite sheet
description: >
  Complete 8-row handmade polymer-clay assassin sprite sheet. The sheet keeps a
  power-of-two 128x128 cell grid, alpha background, row-major frame math, and
  atlas clips for idle and walk animations in down, left, right, and up facings.
keywords: ["john wick", "assassin", "clay", "sprite", "character", "walk", "idle", "game asset"]
placement:
  intended_use: "2D game character animation sheet"
  context: "asset-sprite generated character workflow"
  do: ["use atlas clips", "render at native size then scale", "keep feet anchored at bottom center"]
  dont: ["stretch cells", "add external shadows", "treat repeated idle columns as walk frames"]
style:
  art_style: "handmade polymer clay"
  material: "matte clay with subtle fingerprints"
  camera: "orthographic"
  lighting: "consistent studio lighting"
palette: ["black suit", "white dress shirt", "black tie", "black dress shoes", "warm skin", "dark clay hair"]
background:
  source: "#00B140 chroma plate"
  output: transparent
dimensions:
  master: 1024x1024
  cell: 128x128
  aspect: "1:1"
safe_area: full
accessibility:
  alt_text: "Realistic handmade clay assassin sprite sheet with idle and walk animations facing down, left, right, and up"
animation:
  sheet: public/assets/generated/sprites/{SLUG}-sheet-1024x1024.png
  cell: {{ w: 128, h: 128 }}
  columns: 8
  count: 64
  fps: 10
  loop: true
  anchor: [0.5, 1]
  clips:
    idle-down: [0, 3]
    walk-down: [8, 15]
    idle-left: [16, 19]
    walk-left: [24, 31]
    idle-right: [32, 35]
    walk-right: [40, 47]
    idle-up: [48, 51]
    walk-up: [56, 63]
files:
  - path: public/assets/generated/sprites/{SLUG}-source-1024x1024.png
    size: 1024x1024
    format: png
    bytes: {sizes["source"]}
  - path: public/assets/generated/sprites/{SLUG}-sheet-1024x1024.png
    size: 1024x1024
    format: png
    bytes: {sizes["png"]}
  - path: public/assets/generated/sprites/{SLUG}-sheet-1024x1024.webp
    size: 1024x1024
    format: webp
    bytes: {sizes["webp"]}
  - path: public/assets/generated/sprites/{SLUG}-sheet-1024x1024.json
    size: 1024x1024
    format: json
    bytes: {sizes["json"]}
source:
  model: "built-in image_gen"
  postprocess: "tools/postprocess-john-wick-clay-sprite.py"
  prompt: "{prompt.replace('"', '\\"')}"
  generated: 2026-06-27
""",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--prompt", required=True)
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DOCS_DIR.mkdir(parents=True, exist_ok=True)

    img = Image.open(args.input).convert("RGBA")
    source_sheet, alpha_sheet = build_sheets(img)

    source_path = OUT_DIR / f"{SLUG}-source-1024x1024.png"
    png_path = OUT_DIR / f"{SLUG}-sheet-1024x1024.png"
    webp_path = OUT_DIR / f"{SLUG}-sheet-1024x1024.webp"
    atlas_path = OUT_DIR / f"{SLUG}-sheet-1024x1024.json"
    yaml_path = DOCS_DIR / f"{SLUG}.yaml"

    source_sheet.convert("RGB").save(source_path, optimize=True)
    alpha_sheet.save(png_path, optimize=True)
    alpha_sheet.save(webp_path, lossless=True, quality=100)
    write_atlas(atlas_path)
    sizes = {
        "source": source_path.stat().st_size,
        "png": png_path.stat().st_size,
        "webp": webp_path.stat().st_size,
        "json": atlas_path.stat().st_size,
    }
    write_yaml(yaml_path, sizes, args.prompt)

    for path in (source_path, png_path, webp_path, atlas_path, yaml_path):
        print(path)


if __name__ == "__main__":
    main()
