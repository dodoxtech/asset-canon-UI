// A collectible shard sitting at a fixed spot in the room. Center-anchored box
// (same convention as Player) so overlap is a symmetric AABB test. `picked`
// guards against counting the same pickup twice within a frame.

export class Collectible {
  width = 12
  height = 12
  picked = false

  constructor(
    public readonly id: string,
    public x: number,
    public y: number,
  ) {}

  /** AABB overlap against another center-anchored box. */
  overlaps(other: { x: number; y: number; width: number; height: number }): boolean {
    return (
      Math.abs(this.x - other.x) < (this.width + other.width) / 2 &&
      Math.abs(this.y - other.y) < (this.height + other.height) / 2
    )
  }
}
