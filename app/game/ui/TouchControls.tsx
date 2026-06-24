"use client"

import { useRef } from "react"
import { dom } from "../assets"

// On-screen D-pad + A button for touch devices, overlaid outside the letterbox.
// Rather than thread a second input path through the engine, each direction
// synthesizes the same window keydown/keyup the Input layer already listens for,
// so touch and keyboard share one code path. Hidden on fine-pointer (desktop)
// devices via CSS. The A button sends Enter to advance dialogue.

const DIRS: { key: string; cls: string; label: string }[] = [
  { key: "ArrowUp", cls: "dpad-up", label: "Up" },
  { key: "ArrowDown", cls: "dpad-down", label: "Down" },
  { key: "ArrowLeft", cls: "dpad-left", label: "Left" },
  { key: "ArrowRight", cls: "dpad-right", label: "Right" },
]

function fire(type: "keydown" | "keyup", key: string): void {
  window.dispatchEvent(new KeyboardEvent(type, { key }))
}

export default function TouchControls() {
  const held = useRef<string | null>(null)

  const press = (key: string) => {
    if (held.current && held.current !== key) fire("keyup", held.current)
    held.current = key
    fire("keydown", key)
  }
  const release = () => {
    if (held.current) fire("keyup", held.current)
    held.current = null
  }

  return (
    <div className="touch-controls" aria-hidden>
      <div className="dpad" style={{ backgroundImage: `url(${dom.dpad})` }}>
        {DIRS.map((d) => (
          <button
            key={d.key}
            type="button"
            className={`dpad-btn ${d.cls}`}
            aria-label={d.label}
            onPointerDown={(e) => {
              e.preventDefault()
              press(d.key)
            }}
            onPointerUp={release}
            onPointerLeave={release}
            onPointerCancel={release}
          />
        ))}
      </div>
      <button
        type="button"
        className="btn-a"
        style={{ backgroundImage: `url(${dom.btnA})` }}
        aria-label="Action"
        onPointerDown={(e) => {
          e.preventDefault()
          fire("keydown", "Enter")
        }}
        onPointerUp={() => fire("keyup", "Enter")}
      />
    </div>
  )
}
