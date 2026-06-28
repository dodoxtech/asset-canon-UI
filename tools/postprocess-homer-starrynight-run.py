from __future__ import annotations

import json
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/assets/generated/sprites/homer-starrynight-run-front-source-2172x724.png"
OUT_PNG = ROOT / "public/assets/generated/sprites/homer-starrynight-run-front-sheet-2048x256.png"
OUT_WEBP = ROOT / "public/assets/generated/sprites/homer-starrynight-run-front-sheet-2048x256.webp"
OUT_JSON = ROOT / "public/assets/generated/sprites/homer-starrynight-run-front-sheet-2048x256.json"

FRAME_COUNT = 8
CELL = 256
TARGET_W = 226
TARGET_H = 238


def keyed_rgba(img: Image.Image) -> Image.Image:
    rgba = img.convert("RGBA")
    px = rgba.load()
    w, h = rgba.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            # Chroma plate is a slightly shaded green. The sprite itself uses
            # yellow, blue, cream, and black, so green-dominance keying is safe.
            green_dom = g - max(r, b)
            if g > 80 and green_dom > 36:
                alpha = 0
            elif g > 70 and green_dom > 18:
                alpha = int(255 * (1 - (green_dom - 18) / 18))
            else:
                alpha = a

            if alpha < 255:
                # Despill edge pixels toward the non-green channels.
                g = min(g, int((r + b) * 0.52))
            px[x, y] = (r, g, b, max(0, min(255, alpha)))

    return rgba


def alpha_bbox(img: Image.Image) -> tuple[int, int, int, int]:
    alpha = img.getchannel("A")
    bbox = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
    if bbox is None:
        return (0, 0, img.width, img.height)
    return bbox


def main() -> None:
    src = Image.open(SRC)
    rgba = keyed_rgba(src)

    src_w, src_h = rgba.size
    slice_w = src_w / FRAME_COUNT
    frames: list[Image.Image] = []
    boxes: list[tuple[int, int, int, int]] = []

    for i in range(FRAME_COUNT):
        left = round(i * slice_w)
        right = round((i + 1) * slice_w)
        frame = rgba.crop((left, 0, right, src_h))
        bbox = alpha_bbox(frame)
        frames.append(frame)
        boxes.append(bbox)

    max_w = max(x2 - x1 for x1, _, x2, _ in boxes)
    max_h = max(y2 - y1 for _, y1, _, y2 in boxes)
    scale = min(TARGET_W / max_w, TARGET_H / max_h)

    sheet = Image.new("RGBA", (CELL * FRAME_COUNT, CELL), (0, 0, 0, 0))
    frame_meta: dict[str, dict[str, int]] = {}

    for i, (frame, bbox) in enumerate(zip(frames, boxes)):
        x1, y1, x2, y2 = bbox
        crop = frame.crop(bbox)
        new_w = max(1, round(crop.width * scale))
        new_h = max(1, round(crop.height * scale))
        crop = crop.resize((new_w, new_h), Image.Resampling.LANCZOS)

        cell = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
        paste_x = (CELL - new_w) // 2
        paste_y = CELL - new_h - 4
        cell.alpha_composite(crop, (paste_x, paste_y))
        sheet.alpha_composite(cell, (i * CELL, 0))

        frame_meta[f"homer_starrynight_run_front_{i:02d}"] = {
            "x": i * CELL,
            "y": 0,
            "w": CELL,
            "h": CELL,
        }

    OUT_PNG.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUT_PNG)
    sheet.save(OUT_WEBP, quality=92, method=6)

    atlas = {
        "meta": {
            "image": OUT_PNG.name,
            "sheet": {"w": CELL * FRAME_COUNT, "h": CELL},
            "cell": {"w": CELL, "h": CELL},
            "gutter": 0,
            "columns": FRAME_COUNT,
            "count": FRAME_COUNT,
            "fps": 12,
            "loop": True,
            "anchor": [0.5, 1.0],
            "clips": {"run_front": [0, 7]},
        },
        "frames": frame_meta,
    }
    OUT_JSON.write_text(json.dumps(atlas, indent=2) + "\n", encoding="utf-8")

    corners = [
        sheet.getpixel((0, 0))[3],
        sheet.getpixel((sheet.width - 1, 0))[3],
        sheet.getpixel((0, sheet.height - 1))[3],
        sheet.getpixel((sheet.width - 1, sheet.height - 1))[3],
    ]
    opaque = sum(1 for v in sheet.getchannel("A").getdata() if v > 240)
    partial = sum(1 for v in sheet.getchannel("A").getdata() if 0 < v <= 240)
    print(
        json.dumps(
            {
                "source": [src_w, src_h],
                "sheet": [sheet.width, sheet.height],
                "corners": corners,
                "opaque": opaque,
                "partial": partial,
                "scale": scale,
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
