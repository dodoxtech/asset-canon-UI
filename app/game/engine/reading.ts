// Reading mode = the semantic HTML fallback is showing instead of the game.
// It's a single source of truth shared between the (server-rendered) fallback
// page and the (client) game shell, kept deliberately framework-free: a class on
// <html> drives the CSS reveal, and a window event lets the game pause its loop
// and flip aria-hidden without React state crossing the component boundary.

export const READING_CLASS = "reading"
export const READING_EVENT = "canonquest:reading"

export function isReading(): boolean {
  return (
    typeof document !== "undefined" &&
    document.documentElement.classList.contains(READING_CLASS)
  )
}

/** Show the fallback page (true) or return to the game (false). */
export function setReading(on: boolean): void {
  if (typeof document === "undefined") return
  const root = document.documentElement
  if (on === root.classList.contains(READING_CLASS)) return
  root.classList.toggle(READING_CLASS, on)
  if (on) window.scrollTo(0, 0)
  window.dispatchEvent(new CustomEvent(READING_EVENT, { detail: { reading: on } }))
}
