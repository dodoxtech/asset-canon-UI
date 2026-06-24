// Minimal typed pub/sub. Systems stay decoupled: the scene emits gameplay
// events, and overlays (HUD, dialogue) subscribe without referencing each other.

export type Listener<T> = (payload: T) => void

export class EventBus<Events extends Record<string, unknown>> {
  private readonly listeners: {
    [K in keyof Events]?: Set<Listener<Events[K]>>
  } = {}

  /** Subscribe; returns an unsubscribe fn. */
  on<K extends keyof Events>(type: K, fn: Listener<Events[K]>): () => void {
    const set = (this.listeners[type] ??= new Set())
    set.add(fn)
    return () => set.delete(fn)
  }

  emit<K extends keyof Events>(type: K, payload: Events[K]): void {
    this.listeners[type]?.forEach((fn) => fn(payload))
  }
}

/** Gameplay events the React shell turns into UI. */
export type GameEvents = {
  /** A Shard's pickup beat finished — open its section panel. */
  pickup: { id: string }
  /** Cano says a transient one-liner (reaction / nudge / room hint). */
  cano: { text: string }
  /** The player entered a room for the first time (drives the minimap). */
  visit: { index: number }
  /** Scene phase changed (play → cutscene → cta). */
  phase: { phase: "play" | "cutscene" | "cta" }
}
