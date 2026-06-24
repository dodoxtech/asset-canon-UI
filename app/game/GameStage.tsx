"use client"

import { useEffect, useRef, useState } from "react"
import { sectionForIndex, type Section } from "./data/sections"
import { GameLoop } from "./engine/GameLoop"
import { Input } from "./engine/Input"
import { Stage } from "./engine/Stage"
import { UPDATES_PER_SECOND } from "./engine/constants"
import { RoomScene } from "./scenes/RoomScene"
import DialogueWindow from "./ui/DialogueWindow"

// The game shell: owns the <canvas>, Stage presenter, Input layer, and loop, and
// drives the active scene. A pickup opens the dialogue overlay and freezes the
// world (the loop keeps rendering, but skips scene.update) until it closes.

export default function GameStage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const pausedRef = useRef(false)
  const [dialogue, setDialogue] = useState<Section | null>(null)

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

    // Pickup → open the dialogue window with the matching section, freeze world.
    const offPickup = scene.events.on("pickup", ({ index }) => {
      pausedRef.current = true
      setDialogue(sectionForIndex(index))
    })

    const loop = new GameLoop(
      {
        update: (dt) => {
          if (!pausedRef.current) scene.update(dt, input)
        },
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
      offPickup()
      input.detach()
      loop.stop()
    }
  }, [])

  const closeDialogue = () => {
    // Returning control to play: resume the world on the next update tick.
    pausedRef.current = false
    setDialogue(null)
  }

  return (
    <div ref={containerRef} className="stage-container">
      <canvas ref={canvasRef} className="stage-canvas" />
      {dialogue && (
        <DialogueWindow section={dialogue} onClose={closeDialogue} />
      )}
    </div>
  )
}
