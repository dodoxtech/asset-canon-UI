"use client"

import { dom } from "../assets"
import { rooms } from "../data/rooms"

// Fast-travel minimap. Lists the six rooms as pixel glyphs (sliced from the
// minimap-rooms sheet via background-position); visited rooms are lit and
// clickable to jump there, unvisited ones are dimmed and disabled. Lets a
// returning visitor re-read any section instantly.

interface MinimapProps {
  open: boolean
  visited: boolean[]
  onTravel: (index: number) => void
  onClose: () => void
}

export default function Minimap({ open, visited, onTravel, onClose }: MinimapProps) {
  if (!open) return null
  return (
    <div className="minimap-scrim" onPointerDown={onClose} role="dialog" aria-label="Fast travel map">
      <div className="minimap-panel" onPointerDown={(e) => e.stopPropagation()}>
        <p className="minimap-title">FAST TRAVEL</p>
        <div className="minimap-rooms">
          {rooms.map((room) => {
            const seen = visited[room.index]
            return (
              <button
                key={room.id}
                type="button"
                className="minimap-room"
                data-seen={seen}
                disabled={!seen}
                onPointerDown={(e) => {
                  e.stopPropagation()
                  if (seen) {
                    onTravel(room.index)
                    onClose()
                  }
                }}
              >
                <span
                  className="minimap-glyph"
                  style={{
                    backgroundImage: `url(${dom.minimapSheet})`,
                    backgroundPosition: `-${room.glyph * 32}px 0`,
                  }}
                />
                <span className="minimap-name">{seen ? room.name : "????"}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
