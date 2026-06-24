// Async asset loader for spritesheets (PNG + atlas JSON) and static images.
//
// Multi-frame art ships as packed sheets with a sibling atlas JSON (the
// `asset-optimize` output): geometry, fps and anchor live in the JSON, so the
// loader reads it and derives the PNG path from `meta.image`. Static art
// (backdrops, single icons) loads as a plain image. Everything is fetched once
// up front so the loop never blocks on a decode.

const ROOT = "/assets/generated"

/** A single frame rectangle inside a packed sheet. */
export interface FrameRect {
  x: number
  y: number
  w: number
  h: number
}

/** A decoded spritesheet: image + ordered frame rects + playback metadata. */
export interface Atlas {
  readonly image: HTMLImageElement
  readonly frames: FrameRect[]
  readonly fps: number
  /** Anchor as fractions of the frame box: [0.5,1] = bottom-center. */
  readonly anchor: readonly [number, number]
  readonly cellW: number
  readonly cellH: number
  readonly count: number
}

/** Raw shape of the atlas JSON we author. */
interface AtlasJson {
  meta: {
    image: string
    cell: { w: number; h: number }
    fps: number
    anchor: [number, number]
    count: number
  }
  frames: Record<string, FrameRect>
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
    img.src = url
  })
}

/** Frames are keyed `slug_00`, `slug_01`…; sort by that trailing index. */
function orderFrames(frames: Record<string, FrameRect>): FrameRect[] {
  return Object.entries(frames)
    .sort(([a], [b]) => {
      const na = Number(a.slice(a.lastIndexOf("_") + 1))
      const nb = Number(b.slice(b.lastIndexOf("_") + 1))
      return na - nb
    })
    .map(([, rect]) => rect)
}

export class AssetStore {
  private readonly atlases = new Map<string, Atlas>()
  private readonly images = new Map<string, HTMLImageElement>()

  /** Load all registered sheets + static images. Resolves when every decode is done. */
  async load(
    sheets: Record<string, string>,
    statics: Record<string, string>,
  ): Promise<void> {
    const sheetJobs = Object.entries(sheets).map(async ([id, path]) => {
      const res = await fetch(`${ROOT}/${path}`)
      if (!res.ok) throw new Error(`Atlas fetch failed: ${path}`)
      const json = (await res.json()) as AtlasJson
      const dir = path.slice(0, path.lastIndexOf("/"))
      const image = await loadImage(`${ROOT}/${dir}/${json.meta.image}`)
      this.atlases.set(id, {
        image,
        frames: orderFrames(json.frames),
        fps: json.meta.fps || 1,
        anchor: json.meta.anchor ?? [0.5, 1],
        cellW: json.meta.cell.w,
        cellH: json.meta.cell.h,
        count: json.meta.count,
      })
    })

    const imageJobs = Object.entries(statics).map(async ([id, path]) => {
      this.images.set(id, await loadImage(`${ROOT}/${path}`))
    })

    await Promise.all([...sheetJobs, ...imageJobs])
  }

  atlas(id: string): Atlas {
    const a = this.atlases.get(id)
    if (!a) throw new Error(`Atlas not loaded: ${id}`)
    return a
  }

  hasAtlas(id: string): boolean {
    return this.atlases.has(id)
  }

  image(id: string): HTMLImageElement {
    const img = this.images.get(id)
    if (!img) throw new Error(`Image not loaded: ${id}`)
    return img
  }
}
