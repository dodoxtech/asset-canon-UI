"use client"

import { useEffect, useState } from "react"

// A small companion speech bubble for Cano's transient one-liners (pickup
// reactions, idle nudges, room hints). Auto-dismisses after a few seconds; a new
// line resets the timer. Pinned bottom-left, clear of the bottom dialogue window.

const SHOW_MS = 3200

interface CanoBubbleProps {
  /** Monotonic id so repeated identical lines still re-trigger. */
  msgId: number
  text: string
}

export default function CanoBubble({ msgId, text }: CanoBubbleProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!text) return
    setVisible(true)
    const id = window.setTimeout(() => setVisible(false), SHOW_MS)
    return () => window.clearTimeout(id)
  }, [msgId, text])

  if (!text) return null
  return (
    <div className="cano-bubble" data-open={visible} aria-live="polite">
      <span className="cano-bubble-tag">CANO</span>
      {text}
    </div>
  )
}
