// A collectible Shard/Key floating at a fixed spot. Center-anchored box; overlap
// is a symmetric AABB against the player's body box. `picked` guards against
// counting the same pickup twice within a frame. The floating spin + the
// pop-and-arc-to-HUD animation are drawn by the scene; this is just state.

export class Collectible {
  readonly width = 14
  readonly height = 14
  picked = false

  constructor(
    /** Matches the sections.ts key. */
    public readonly id: string,
    /** Sprite atlas id. */
    public readonly atlas: string,
    public x: number,
    public y: number,
  ) {}

  /** AABB overlap against a center-anchored box (the player body). */
  overlaps(px: number, py: number, pw: number, ph: number): boolean {
    return (
      Math.abs(this.x - px) < (this.width + pw) / 2 &&
      Math.abs(this.y - py) < (this.height + ph) / 2
    )
  }
}
