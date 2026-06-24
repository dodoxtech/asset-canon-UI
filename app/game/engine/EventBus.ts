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

/** Gameplay events other systems can react to. */
export type GameEvents = {
  /** A collectible was picked up. `index` is its 0-based slot in the run. */
  pickup: { id: string; index: number }
}
