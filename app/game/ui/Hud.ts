// Top status bar HUD, drawn in fixed stage space (not through the camera) so it
// stays pinned. Rendered on the canvas (vector text in the pre-scaled context)
// so it's crisp and legible at every integer scale and DPR, on desktop or phone.

import type { Stage } from "../engine/Stage"
import { VIRTUAL_WIDTH } from "../engine/constants"

const BAR_HEIGHT = 14
const FILLED = "◆"
const EMPTY = "◇"

/** Draw `◆ ◆ ◇ ◇ ◇   n/5` across a thin translucent top bar. */
export function renderHud(stage: Stage, shards: number, total: number): void {
  const ctx = stage.ctx

  ctx.fillStyle = "rgba(11, 14, 26, 0.78)"
  ctx.fillRect(0, 0, VIRTUAL_WIDTH, BAR_HEIGHT)
  ctx.fillStyle = "#324063"
  ctx.fillRect(0, BAR_HEIGHT, VIRTUAL_WIDTH, 1)

  ctx.font = "10px monospace"
  ctx.textBaseline = "middle"
  const midY = BAR_HEIGHT / 2

  let pips = ""
  for (let i = 0; i < total; i++) pips += (i < shards ? FILLED : EMPTY) + " "
  ctx.textAlign = "left"
  ctx.fillStyle = "#3ce07a"
  ctx.fillText(pips.trimEnd(), 6, midY + 0.5)

  ctx.textAlign = "right"
  ctx.fillStyle = "#e8ecf8"
  ctx.fillText(`${shards}/${total}`, VIRTUAL_WIDTH - 6, midY + 0.5)

  // Reset to defaults other draws assume.
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
}
