// Returning-visitor progress, persisted in localStorage so a maker who already
// lit the studio isn't forced to replay. We store only what's needed to rebuild
// scene state: which Shard ids were collected and whether the quest completed.
// Everything is defensive — a malformed or absent value reads as "first visit",
// and all access is guarded for SSR (no `window` on the server).

const KEY = "canonquest:progress:v1"

export interface Progress {
  /** Collectible ids already picked up. */
  shards: string[]
  /** True once the assemble cutscene / CTA was reached. */
  complete: boolean
}

export function loadProgress(): Progress | null {
  if (typeof window === "undefined") return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<Progress>
    if (!Array.isArray(data.shards)) return null
    return {
      shards: data.shards.filter((s): s is string => typeof s === "string"),
      complete: Boolean(data.complete),
    }
  } catch {
    return null
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* private mode / quota — progress just won't persist. */
  }
}

export function clearProgress(): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
