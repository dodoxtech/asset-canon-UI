"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Section } from "../data/sections"

// GBA-style dialogue window: dims the world, slides up from the bottom, and
// typewriters the section body. Any input (click / tap / ▶ / Esc) reveals the
// full text while still typing, then closes on the next input. Responsive and
// safe-area aware so it stays legible and tappable on phone in either
// orientation.

/** Characters revealed per second. */
const TYPE_SPEED = 45
/** Slide transition duration (ms); kept in sync with the CSS transition. */
const SLIDE_MS = 220

interface DialogueWindowProps {
  section: Section
  onClose: () => void
}

export default function DialogueWindow({ section, onClose }: DialogueWindowProps) {
  const { title, body } = section
  const [revealed, setRevealed] = useState(0)
  const [open, setOpen] = useState(false)
  const closingRef = useRef(false)

  const done = revealed >= body.length

  // Trigger the slide-up on mount (next frame so the transition runs).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setOpen(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // Typewriter reveal.
  useEffect(() => {
    if (done) return
    const id = window.setInterval(() => {
      setRevealed((n) => Math.min(body.length, n + 1))
    }, 1000 / TYPE_SPEED)
    return () => window.clearInterval(id)
  }, [body.length, done])

  // Advance: reveal everything while typing, else slide down and close.
  const advance = useCallback(() => {
    if (closingRef.current) return
    if (!done) {
      setRevealed(body.length)
      return
    }
    closingRef.current = true
    setOpen(false)
    window.setTimeout(onClose, SLIDE_MS)
  }, [body.length, done, onClose])

  // Esc closes/advances from the keyboard.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        e.preventDefault()
        advance()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [advance])

  return (
    <div
      className="dialogue-scrim"
      data-open={open}
      onPointerDown={(e) => {
        e.preventDefault()
        advance()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="dialogue-window" data-open={open}>
        <p className="dialogue-title">{title}</p>
        <p className="dialogue-body">
          {body.slice(0, revealed)}
          {!done && <span className="dialogue-caret">▌</span>}
        </p>
        <button
          type="button"
          className="dialogue-advance"
          aria-label={done ? "Close" : "Reveal full text"}
          // onPointerDown on the scrim already handles this; keep the button
          // focusable/clickable and stop it from double-firing.
          onPointerDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
            advance()
          }}
        >
          ▶
        </button>
      </div>
    </div>
  )
}
