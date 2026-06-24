"use client"

import { useEffect, useRef } from "react"
import { GameLoop } from "./engine/GameLoop"
import {
  UPDATES_PER_SECOND,
  VIRTUAL_HEIGHT,
  VIRTUAL_WIDTH,
} from "./engine/constants"

// The game shell: owns the <canvas> and the loop lifecycle. For 0008b it just
// proves the loop runs — clears the stage and prints an FPS/tick readout.
// Scaling (0008c), input/camera (0008d), gameplay (0008e/f) build on top.

export default function GameStage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fixed backing-store size for now; integer scaling lands in 0008c.
    canvas.width = VIRTUAL_WIDTH
    canvas.height = VIRTUAL_HEIGHT
    ctx.imageSmoothingEnabled = false

    let elapsed = 0
    const loop = new GameLoop(
      {
        update: (dt) => {
          elapsed += dt
        },
        render: () => {
          ctx.fillStyle = "#0b0e1a"
          ctx.fillRect(0, 0, VIRTUAL_WIDTH, VIRTUAL_HEIGHT)

          ctx.fillStyle = "#3ce07a"
          ctx.font = "10px monospace"
          ctx.textBaseline = "top"
          ctx.fillText(`fps ${loop.currentFps}`, 6, 6)
          ctx.fillText(`tick ${loop.tickCount}`, 6, 18)
          ctx.fillText(`t ${elapsed.toFixed(1)}s`, 6, 30)
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
      loop.stop()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        imageRendering: "pixelated",
        width: `${VIRTUAL_WIDTH}px`,
        height: `${VIRTUAL_HEIGHT}px`,
      }}
    />
  )
}
