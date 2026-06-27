#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
from pathlib import Path

from PIL import Image


NAME = "demo-navigator"
OUT_DIR = Path("public/assets/generated/sprites")
DOCS_DIR = Path("docs/assets")
CELL = 64
COLUMNS = 4
ROWS = 8
SHEET_W = CELL * COLUMNS
SHEET_H = CELL * ROWS


def is_green_key(r: int, g: int, b: int) -> bool:
    return g > 75 and g > r * 1.18 and g > b * 1.18


def key_green_to_alpha(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    pixels = rgba.load()
    for y in range(rgba.height):
        for x in range(rgba.width):
            r, g, b, a = pixels[x, y]
            if is_green_key(r, g, b):
                pixels[x, y] = (r, g, b, 0)
    return rgba


def alpha_bbox(img: Image.Image) -> tuple[int, int, int, int] | None:
    alpha = img.getchannel("A")
    return alpha.getbbox()


def fit_cell(cell_img: Image.Image, keyed: bool) -> Image.Image:
    src = key_green_to_alpha(cell_img) if keyed else cell_img.convert("RGBA")
    bbox = alpha_bbox(src) if keyed else None

    if bbox:
        content = src.crop(bbox)
        max_w = 54
        max_h = 60
        scale = min(max_w / content.width, max_h / content.height)
        size = (max(1, round(content.width * scale)), max(1, round(content.height * scale)))
        content = content.resize(size, Image.Resampling.LANCZOS)
        out = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0) if keyed else (0, 177, 64, 255))
        x = (CELL - content.width) // 2
        y = CELL - content.height - 2
        out.alpha_composite(content, (x, y))
        return out

    content = src.resize((CELL, CELL), Image.Resampling.LANCZOS)
    out = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0) if keyed else (0, 177, 64, 255))
    out.alpha_composite(content)
    return out


def build_sheet(source: Image.Image, keyed: bool) -> Image.Image:
    sheet = Image.new("RGBA", (SHEET_W, SHEET_H), (0, 0, 0, 0) if keyed else (0, 177, 64, 255))
    src_w, src_h = source.size
    frame_w = src_w / COLUMNS
    frame_h = src_h / ROWS

    for row in range(ROWS):
        for col in range(COLUMNS):
            box = (
                round(col * frame_w),
                round(row * frame_h),
                round((col + 1) * frame_w),
                round((row + 1) * frame_h),
            )
            frame = fit_cell(source.crop(box), keyed)
            sheet.alpha_composite(frame, (col * CELL, row * CELL))
    return sheet


def write_atlas(path: Path) -> None:
    clips = {
        "idle-down": [0, 3],
        "idle-up": [4, 7],
        "idle-right": [8, 11],
        "idle-left": [12, 15],
        "walk-down": [16, 19],
        "walk-up": [20, 23],
        "walk-right": [24, 27],
        "walk-left": [28, 31],
    }
    frames = {}
    for i in range(COLUMNS * ROWS):
        frames[f"{NAME}_{i:02d}"] = {
            "x": (i % COLUMNS) * CELL,
            "y": (i // COLUMNS) * CELL,
            "w": CELL,
            "h": CELL,
        }

    atlas = {
        "meta": {
            "image": f"{NAME}-alpha-sheet-256x512.png",
            "sheet": {"w": SHEET_W, "h": SHEET_H},
            "cell": {"w": CELL, "h": CELL},
            "gutter": 0,
            "columns": COLUMNS,
            "count": COLUMNS * ROWS,
            "fps": 8,
            "loop": True,
            "anchor": [0.5, 1],
            "clips": clips,
        },
        "frames": frames,
    }
    path.write_text(json.dumps(atlas, indent=2) + "\n", encoding="utf-8")


def write_yaml(path: Path, sizes: dict[str, int], source_prompt: str) -> None:
    path.write_text(
        f"""id: {NAME}
type: sprite
subject: Side-view handmade clay adventurer demo character
description: >
  Handmade polymer-clay adventurer sprite sheet generated for the asset-sprite
  demo. The source render uses a chroma-green plate, the output sheet is
  alpha-keyed, and the atlas keeps the existing 64x64 cell contract for the
  interactive demo.
keywords: ["sprite", "character", "claymation", "wasd", "animation", "asset-sprite"]
placement:
  intended_use: "Interactive WASD demo on the ASSET CANON landing page"
  context: "asset-sprite generation workflow demonstration"
  do: ["render with atlas metadata", "preserve square 64x64 cells", "use alpha PNG/WebP output"]
  dont: ["stretch cells", "reintroduce chroma-key pixels", "ignore anchor metadata"]
style:
  art_style: "handmade polymer clay"
  material: "soft matte clay with visible fingerprints"
  camera: "orthographic side view"
  lighting: "consistent studio lighting with soft self-shadows"
palette: ["blue hoodie", "brown backpack", "white sneakers", "warm skin", "brown clay hair"]
background:
  source: "#00B140 chroma plate"
  output: transparent
dimensions:
  master: 256x512
  cell: 64x64
  aspect: "1:2"
safe_area: full
accessibility:
  alt_text: "Side-view handmade clay adventurer sprite sheet with idle and walk states"
animation:
  sheet: public/assets/generated/sprites/{NAME}-alpha-sheet-256x512.png
  cell: {{ w: 64, h: 64 }}
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
  - path: public/assets/generated/sprites/{NAME}-source-256x512.png
    size: 256x512
    format: png
    bytes: {sizes["source"]}
  - path: public/assets/generated/sprites/{NAME}-alpha-sheet-256x512.png
    size: 256x512
    format: png
    bytes: {sizes["png"]}
  - path: public/assets/generated/sprites/{NAME}-alpha-sheet-256x512.webp
    size: 256x512
    format: webp
    bytes: {sizes["webp"]}
  - path: public/assets/generated/sprites/{NAME}-alpha-sheet-256x512.json
    size: 256x512
    format: json
    bytes: {sizes["json"]}
source:
  model: "built-in image_gen"
  postprocess: "tools/postprocess-clay-demo-sprite.py"
  prompt: "{source_prompt}"
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

    source = Image.open(args.input).convert("RGBA")
    source_sheet = build_sheet(source, keyed=False)
    alpha_sheet = build_sheet(source, keyed=True)

    source_path = OUT_DIR / f"{NAME}-source-256x512.png"
    alpha_path = OUT_DIR / f"{NAME}-alpha-sheet-256x512.png"
    webp_path = OUT_DIR / f"{NAME}-alpha-sheet-256x512.webp"
    atlas_path = OUT_DIR / f"{NAME}-alpha-sheet-256x512.json"
    yaml_path = DOCS_DIR / f"{NAME}.yaml"

    source_sheet.convert("RGB").save(source_path, optimize=True)
    alpha_sheet.save(alpha_path, optimize=True)
    alpha_sheet.save(webp_path, lossless=True, quality=100)
    write_atlas(atlas_path)

    sizes = {
        "source": source_path.stat().st_size,
        "png": alpha_path.stat().st_size,
        "webp": webp_path.stat().st_size,
        "json": atlas_path.stat().st_size,
    }
    write_yaml(yaml_path, sizes, args.prompt.replace('"', '\\"'))

    for path in (source_path, alpha_path, webp_path, atlas_path, yaml_path):
        print(path)


if __name__ == "__main__":
    main()
