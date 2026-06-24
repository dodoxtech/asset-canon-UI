"use client"

import { useEffect, useRef, useState } from "react"
import { SHEETS, STATICS, dom } from "./assets"
import { sectionForId, spawnIntro, type Section } from "./data/sections"
import { rooms } from "./data/rooms"
import { AssetStore } from "./engine/Assets"
import { audio } from "./engine/Audio"
import { GameLoop } from "./engine/GameLoop"
import { Input } from "./engine/Input"
import { Stage } from "./engine/Stage"
import { UPDATES_PER_SECOND } from "./engine/constants"
import { WorldScene } from "./scenes/WorldScene"
import BootScreen from "./ui/BootScreen"
import CanoBubble from "./ui/CanoBubble"
import CtaPanel from "./ui/CtaPanel"
import DialogueWindow from "./ui/DialogueWindow"
import Minimap from "./ui/Minimap"
import TouchControls from "./ui/TouchControls"

// The game shell: owns the <canvas>, Stage/Input/loop, and the WorldScene, and
// bridges scene events to the React overlay layer (boot, dialogue, Cano bubbles,
// minimap, CTA). A pickup runs its beat in the scene, then opens the dialogue
// window and freezes the world; closing it resumes — and, on the fifth Shard,
// kicks off the assemble cutscene.

export default function GameStage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sceneRef = useRef<WorldScene | null>(null)
  const pausedRef = useRef(false)

  const [ready, setReady] = useState(false)
  const [started, setStarted] = useState(false)
  const [dialogue, setDialogue] = useState<Section | null>(null)
  const [cano, setCano] = useState<{ id: number; text: string }>({ id: 0, text: "" })
  const [mapOpen, setMapOpen] = useState(false)
  const [visited, setVisited] = useState<boolean[]>(rooms.map(() => false))
  const [showCta, setShowCta] = useState(false)
  const [muted, setMuted] = useState(false)

  // Boot: build the world, preload all art, wire events, run the loop.
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const stage = new Stage(canvas)
    const input = new Input(stage)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

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

    const offs: Array<() => void> = []
    let loop: GameLoop | null = null
    let cancelled = false

    const assets = new AssetStore()
    void assets.load(SHEETS, STATICS).then(() => {
      if (cancelled) return
      const scene = new WorldScene(assets)
      scene.reducedMotion = reduced
      sceneRef.current = scene

      offs.push(scene.events.on("pickup", ({ id }) => {
        const section = sectionForId(id)
        if (!section) return
        showCanoLine(section.cano)
        pausedRef.current = true
        setDialogue(section)
      }))
      offs.push(scene.events.on("cano", ({ text }) => showCanoLine(text)))
      offs.push(scene.events.on("visit", ({ index }) => {
        setVisited((v) => (v[index] ? v : v.map((seen, i) => (i === index ? true : seen))))
      }))
      offs.push(scene.events.on("phase", ({ phase }) => {
        if (phase === "cta") setShowCta(true)
      }))

      loop = new GameLoop(
        {
          update: (dt) => {
            if (!pausedRef.current) scene.update(dt, input)
          },
          render: () => scene.render(stage),
        },
        UPDATES_PER_SECOND,
      )

      const onVisibility = () => {
        if (document.hidden) loop?.pause()
        else loop?.resume()
      }
      document.addEventListener("visibilitychange", onVisibility)
      offs.push(() => document.removeEventListener("visibilitychange", onVisibility))

      // Render one frame behind the boot screen, but don't simulate until start.
      pausedRef.current = true
      loop.start()
      setReady(true)
    })

    return () => {
      cancelled = true
      window.removeEventListener("orientationchange", scheduleFit)
      ro.disconnect()
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      offs.forEach((off) => off())
      input.detach()
      loop?.stop()
      sceneRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const showCanoLine = (text: string) => {
    setCano((c) => ({ id: c.id + 1, text }))
  }

  const handleStart = () => {
    audio.unlock()
    setStarted(true)
    // Spawn intro: Cano's framing line + the controls dialogue (world frozen).
    showCanoLine(spawnIntro.cano)
    pausedRef.current = true
    setDialogue(spawnIntro)
  }

  const closeDialogue = () => {
    const wasSpawn = dialogue?.id === spawnIntro.id
    setDialogue(null)
    audio.play("chime")
    const scene = sceneRef.current
    // Fifth Shard: closing its panel triggers the assemble cutscene.
    if (!wasSpawn && scene && scene.allShardsFound && !scene.assembleInProgress) {
      pausedRef.current = false
      scene.startAssemble()
      return
    }
    pausedRef.current = false
  }

  const toggleSound = () => {
    audio.unlock()
    setMuted(audio.toggleMute())
  }

  const toggleMap = () => {
    audio.unlock()
    setMapOpen((o) => !o)
  }

  return (
    <div ref={containerRef} className="stage-container">
      <canvas ref={canvasRef} className="stage-canvas" />

      {started && (
        <div className="hud-buttons">
          <button type="button" className="hud-btn" aria-label={muted ? "Unmute" : "Mute"} onPointerDown={toggleSound}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={muted ? dom.soundOff : dom.soundOn} alt="" width={16} height={16} />
          </button>
          <button type="button" className="hud-btn" aria-label="Map" onPointerDown={toggleMap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dom.iconMap} alt="" width={16} height={16} />
          </button>
          <button
            type="button"
            className="hud-btn"
            aria-label="Skip quest"
            onPointerDown={() => sceneRef.current?.skipQuest()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dom.iconSkip} alt="" width={16} height={16} />
          </button>
        </div>
      )}

      {started && <TouchControls />}
      {started && <CanoBubble msgId={cano.id} text={cano.text} />}

      {dialogue && <DialogueWindow section={dialogue} onClose={closeDialogue} />}

      <Minimap
        open={mapOpen}
        visited={visited}
        onTravel={(i) => sceneRef.current?.fastTravel(i)}
        onClose={() => setMapOpen(false)}
      />

      {showCta && <CtaPanel />}

      {!started && <BootScreen ready={ready} onStart={handleStart} />}
    </div>
  )
}
