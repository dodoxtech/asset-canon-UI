"use client"

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react"
import { motion } from "framer-motion"

// ── Custom Cursor ──────────────────────────────────────────────
export function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = -200, my = -200, rx = -200, ry = -200
    let raf: number

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY }

    const tick = () => {
      rx += (mx - rx) * 0.1
      ry += (my - ry) * 0.1
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`
        ringRef.current.style.top  = `${ry}px`
      }
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`
        dotRef.current.style.top  = `${my}px`
      }
      raf = requestAnimationFrame(tick)
    }

    const enter = () => ringRef.current?.classList.add("is-hover")
    const leave = () => ringRef.current?.classList.remove("is-hover")

    window.addEventListener("mousemove", onMove, { passive: true })
    raf = requestAnimationFrame(tick)

    document.querySelectorAll("a,button,[data-hover]").forEach(el => {
      el.addEventListener("mouseenter", enter)
      el.addEventListener("mouseleave", leave)
    })

    return () => { cancelAnimationFrame(raf); window.removeEventListener("mousemove", onMove) }
  }, [])

  return (
    <>
      <div ref={ringRef} className="c-ring" aria-hidden="true" />
      <div ref={dotRef}  className="c-dot"  aria-hidden="true" />
    </>
  )
}

// ── Word-clip reveal (staggered per word, clips from below) ────
export function RevealWords({
  text, className = "", delay = 0, as: Tag = "span",
}: {
  text: string; className?: string; delay?: number; as?: ElementType
}) {
  const words = text.split(" ")
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="clip-host">
          <motion.span
            className="clip-word"
            initial={{ y: "115%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1], delay: delay + i * 0.055 }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  )
}

// ── Fade + blur in on scroll ───────────────────────────────────
export function FadeUp({
  children, delay = 0, className = "",
}: {
  children: ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ y: 36, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Stagger wrapper ────────────────────────────────────────────
export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children, className = "", rotate = 0,
}: {
  children: ReactNode; className?: string; rotate?: number
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { y: 48, opacity: 0, rotate: rotate - 2.5, filter: "blur(8px)" },
        show: {
          y: 0, opacity: 1, rotate, filter: "blur(0px)",
          transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

// ── Marquee belt ───────────────────────────────────────────────
export function Marquee({ children }: { children: ReactNode }) {
  return (
    <div className="marquee-track" aria-hidden="true">
      <div className="marquee-inner">
        <span className="marquee-set">{children}</span>
        <span className="marquee-set">{children}</span>
        <span className="marquee-set">{children}</span>
      </div>
    </div>
  )
}

type SpriteDirection = "down" | "up" | "right" | "left"

const KEY_TO_DIRECTION: Record<string, SpriteDirection> = {
  s: "down",
  w: "up",
  d: "right",
  a: "left",
}

const IDLE_ROWS: Record<SpriteDirection, number> = {
  down: 0,
  up: 1,
  right: 2,
  left: 3,
}

const WALK_ROWS: Record<SpriteDirection, number> = {
  down: 4,
  up: 5,
  right: 6,
  left: 7,
}

const DIRECTION_LABELS: Record<SpriteDirection, string> = {
  down: "front",
  up: "back",
  right: "right",
  left: "left",
}

export function SpriteDirectionDemo() {
  const pressed = useRef<Set<string>>(new Set())
  const [direction, setDirection] = useState<SpriteDirection>("down")
  const [moving, setMoving] = useState(false)
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    const updateFromKeys = () => {
      const nextKey = ["w", "a", "s", "d"].find((key) => pressed.current.has(key))
      if (!nextKey) {
        setMoving(false)
        return
      }
      setDirection(KEY_TO_DIRECTION[nextKey])
      setMoving(true)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (!KEY_TO_DIRECTION[key]) return
      event.preventDefault()
      pressed.current.add(key)
      setDirection(KEY_TO_DIRECTION[key])
      setMoving(true)
    }

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (!KEY_TO_DIRECTION[key]) return
      event.preventDefault()
      pressed.current.delete(key)
      updateFromKeys()
    }

    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("keyup", onKeyUp)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("keyup", onKeyUp)
    }
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrame((current) => (current + 1) % 4)
    }, moving ? 125 : 360)
    return () => window.clearInterval(timer)
  }, [moving])

  const row = moving ? WALK_ROWS[direction] : IDLE_ROWS[direction]
  const scale = 3
  const cell = 64
  const spriteSize = cell * scale
  const backgroundSize = `${256 * scale}px ${512 * scale}px`
  const backgroundPosition = `-${frame * spriteSize}px -${row * spriteSize}px`

  const pressVirtualKey = (key: string) => {
    pressed.current.add(key)
    setDirection(KEY_TO_DIRECTION[key])
    setMoving(true)
  }

  const releaseVirtualKey = (key: string) => {
    pressed.current.delete(key)
    const nextKey = ["w", "a", "s", "d"].find((candidate) => pressed.current.has(candidate))
    if (nextKey) {
      setDirection(KEY_TO_DIRECTION[nextKey])
      setMoving(true)
    } else {
      setMoving(false)
    }
  }

  return (
    <div className="sprite-playground" data-hover>
      <div className="sprite-stage" aria-live="polite">
        <div
          className="sprite-avatar"
          role="img"
          aria-label={`Demo character ${moving ? "walking" : "idle"} facing ${DIRECTION_LABELS[direction]}`}
          style={{
            width: spriteSize,
            height: spriteSize,
            backgroundSize,
            backgroundPosition,
          }}
        />
        <div className="sprite-ground" aria-hidden="true" />
      </div>

      <div className="sprite-status">
        <span>{moving ? "walking" : "idle"}</span>
        <strong>{DIRECTION_LABELS[direction]}</strong>
      </div>

      <div className="wasd-pad" aria-label="WASD direction controls">
        {["w", "a", "s", "d"].map((key) => (
          <button
            key={key}
            type="button"
            className={`wasd-key wasd-key-${key}`}
            aria-label={`Hold ${key.toUpperCase()}`}
            onPointerDown={() => pressVirtualKey(key)}
            onPointerUp={() => releaseVirtualKey(key)}
            onPointerCancel={() => releaseVirtualKey(key)}
            onPointerLeave={() => releaseVirtualKey(key)}
          >
            {key.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
