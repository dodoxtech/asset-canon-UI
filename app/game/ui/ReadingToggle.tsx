"use client"

import { setReading } from "../engine/reading"

// The "back to the game" control rendered inside the fallback page. Clicking it
// drops reading mode, which un-hides the game stage. It's a progressive
// enhancement: with JS disabled the game can't run anyway, so a `<noscript>`
// rule hides this button entirely (see globals.css).

export default function ReadingToggle({ label = "▶ Play the quest" }: { label?: string }) {
  return (
    <button type="button" className="reading-toggle" onClick={() => setReading(false)}>
      {label}
    </button>
  )
}
