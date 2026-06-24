"use client"

import { useEffect, useRef } from "react"
import { GameLoop } from "./engine/GameLoop"
import { Stage } from "./engine/Stage"
import {
  UPDATES_PER_SECOND,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from "./engine/constants"

// The game shell: owns the <canvas>, the Stage presenter (integer scaling +
// letterbox + DPR), and the loop lifecycle. For 0008c it draws a calibration
// frame so scaling/centering/crispness are visible; gameplay lands in 0008d+.

export default function GameStage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const stage = new Stage(canvas)
    const ctx = stage.ctx

    // Fit to the container's content box (already inside the safe-area padding).
    const fit = () => stage.resize(container.clientWidth, container.clientHeight)

    // Coalesce bursts of resize/orientation events into one rAF.
    let resizeRaf = 0
    const scheduleFit = () => {
      if (resizeRaf) return
      resizeRaf = requestAnimationFrame(() => {
        resizeRaf = 0
        fit()
      })
    }

    fit()

    const ro = new ResizeObserver(scheduleFit)
    ro.observe(container)
    window.addEventListener("orientationchange", scheduleFit)

    let elapsed = 0
    const loop = new GameLoop(
      {
        update: (dt) => {
          elapsed += dt
        },
        render: () => {
          ctx.fillStyle = "#0b0e1a"
          ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)

          // 1px border to confirm the stage edges (and pixel crispness).
          ctx.strokeStyle = "#324063"
          ctx.lineWidth = 1
          ctx.strokeRect(0.5, 0.5, VIRTUAL_WIDTH - 1, VIRTUAL_HEIGHT - 1)

          // Corner crosshairs + center marker as a scaling/centering check.
          ctx.fillStyle = "#3ce07a"
          for (let i = 0; i < 8; i++) {
            ctx.fillRect(2 + i, 2, 1, 1)
            ctx.fillRect(2, 2 + i, 1, 1)
            ctx.fillRect(VIRTUAL_WIDTH - 3 - i, VIRTUAL_HEIGHT - 3, 1, 1)
            ctx.fillRect(VIRTUAL_WIDTH - 3, VIRTUAL_HEIGHT - 3 - i, 1, 1)
          }
          ctx.fillRect(VIRTUAL_WIDTH / 2 - 1, VIRTUAL_HEIGHT / 2 - 1, 2, 2)

          ctx.fillStyle = "#e8ecf8"
          ctx.font = "10px monospace"
          ctx.textBaseline = "top"
          ctx.fillText(`fps ${loop.currentFps}`, 6, 6)
          ctx.fillText(`scale ${stage.scale}x  dpr ${stage.dpr}`, 6, 18)
          ctx.fillText(`${VIRTUAL_WIDTH}x${VIRTUAL_HEIGHT}`, 6, 30)
        },
      },
      UPDATES_PER_SECOND,
    )

    const onVisibility = () => {
      if (document.hidden) loop.pause()
      else loop.resume()
    }
    document.addEventListener("visibilitychange", onVisibility)

    loop.start()

    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      window.removeEventListener("orientationchange", scheduleFit)
      ro.disconnect()
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      loop.stop()
    }
  }, [])

  return (
    <div ref={containerRef} className="stage-container">
      <canvas ref={canvasRef} className="stage-canvas" />
    </div>
  )
}
