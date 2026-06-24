"use client"

import { useEffect, useRef } from "react"
import { GameLoop } from "./engine/GameLoop"
import { Input } from "./engine/Input"
import { Stage } from "./engine/Stage"
import { UPDATES_PER_SECOND } from "./engine/constants"
import { RoomScene } from "./scenes/RoomScene"

// The game shell: owns the <canvas>, the Stage presenter (scaling/letterbox/DPR),
// the Input layer, and the loop lifecycle, and drives the active scene.

export default function GameStage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const stage = new Stage(canvas)
    const input = new Input(stage)
    const scene = new RoomScene()

    const fit = () => stage.resize(container.clientWidth, container.clientHeight)
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
    input.attach()

    const loop = new GameLoop(
      {
        update: (dt) => scene.update(dt, input),
        render: () => scene.render(stage),
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
      input.detach()
      loop.stop()
    }
  }, [])

  return (
    <div ref={containerRef} className="stage-container">
      <canvas ref={canvasRef} className="stage-canvas" />
    </div>
  )
}
