"use client"

import { useEffect } from "react"
import { dom } from "../assets"

// Boot / title overlay shown over the dark cartridge backdrop until the player
// presses start. Doubles as the loading gate: while assets stream in, the prompt
// reads "LOADING…" and is inert; once ready it blinks "▶ PRESS START" and any
// click / tap / key begins the quest (and unlocks audio via the gesture).

interface BootScreenProps {
  ready: boolean
  /** A returning visitor with saved progress — offer "continue" framing. */
  returning?: boolean
  onStart: () => void
  /** Reveal the readable fallback instead of playing. */
  onSkip: () => void
}

export default function BootScreen({ ready, returning, onStart, onSkip }: BootScreenProps) {
  useEffect(() => {
    if (!ready) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault()
        onStart()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [ready, onStart])

  return (
    <div
      className="boot-screen"
      style={{ backgroundImage: `url(${dom.bgBoot})` }}
      onPointerDown={(e) => {
        // Let the skip control handle its own taps without starting the game.
        if ((e.target as HTMLElement).closest(".boot-skip")) return
        e.preventDefault()
        if (ready) onStart()
      }}
      role="button"
      aria-label="Press start"
      tabIndex={0}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="boot-logo" src={dom.logo} alt="CANON QUEST" />
      <p className="boot-tagline">Turn a brief into shippable art.</p>
      <p className="boot-prompt" data-ready={ready}>
        {ready ? (returning ? "▶ CONTINUE" : "▶ PRESS START") : "LOADING…"}
      </p>
      <button type="button" className="boot-skip" onClick={onSkip}>
        Skip the quest — just read it
      </button>
    </div>
  )
}
