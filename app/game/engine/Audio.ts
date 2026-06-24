// Tiny synthesized SFX bank (WebAudio).
//
// The asset pipeline ships images only — no audio files — so rather than pull in
// Howler for nothing, the game's handful of cues (coin, chime, clunk, shatter,
// fanfare, blip) are synthesized from oscillators. Zero bytes to download, works
// offline, and still gives the pickup beat its bright "ding". A mute toggle and
// the browser's gesture-unlock are handled here; the context is created lazily
// on first play so autoplay policies stay happy.

export type Sfx = "coin" | "chime" | "clunk" | "shatter" | "fanfare" | "blip"

interface Tone {
  freq: number
  /** Seconds. */
  dur: number
  type: OscillatorType
  /** Start delay (s) for layering a short sequence. */
  at?: number
  /** Peak gain 0..1. */
  gain?: number
  /** Linear pitch glide to this freq over the tone. */
  to?: number
}

const BANK: Record<Sfx, Tone[]> = {
  // Bright two-note coin pickup.
  coin: [
    { freq: 988, dur: 0.07, type: "square", gain: 0.25 },
    { freq: 1319, dur: 0.12, type: "square", at: 0.06, gain: 0.25 },
  ],
  // Soft confirm chime when a section reveals.
  chime: [
    { freq: 660, dur: 0.18, type: "triangle", gain: 0.22 },
    { freq: 990, dur: 0.22, type: "triangle", at: 0.05, gain: 0.18 },
  ],
  // Heavy key-drop thunk.
  clunk: [{ freq: 180, dur: 0.22, type: "sine", gain: 0.4, to: 70 }],
  // Lock-shatter noise-ish descending blip cluster.
  shatter: [
    { freq: 520, dur: 0.06, type: "square", gain: 0.2, to: 220 },
    { freq: 380, dur: 0.08, type: "square", at: 0.05, gain: 0.18, to: 140 },
    { freq: 260, dur: 0.1, type: "square", at: 0.11, gain: 0.16, to: 90 },
  ],
  // Triumphant arpeggio for quest-complete.
  fanfare: [
    { freq: 523, dur: 0.14, type: "square", gain: 0.22 },
    { freq: 659, dur: 0.14, type: "square", at: 0.12, gain: 0.22 },
    { freq: 784, dur: 0.14, type: "square", at: 0.24, gain: 0.22 },
    { freq: 1047, dur: 0.3, type: "square", at: 0.36, gain: 0.24 },
  ],
  // UI tick.
  blip: [{ freq: 740, dur: 0.05, type: "square", gain: 0.15 }],
}

class AudioBank {
  private ctx: AudioContext | null = null
  muted = false

  /** Lazily create/resume the context (call from a user gesture). */
  unlock(): void {
    if (typeof window === "undefined") return
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return
      this.ctx = new Ctor()
    }
    if (this.ctx.state === "suspended") void this.ctx.resume()
  }

  toggleMute(): boolean {
    this.muted = !this.muted
    return this.muted
  }

  play(name: Sfx): void {
    if (this.muted || !this.ctx) return
    const ctx = this.ctx
    const now = ctx.currentTime
    for (const tone of BANK[name]) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const start = now + (tone.at ?? 0)
      const peak = tone.gain ?? 0.2
      osc.type = tone.type
      osc.frequency.setValueAtTime(tone.freq, start)
      if (tone.to != null) {
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(1, tone.to),
          start + tone.dur,
        )
      }
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.008)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + tone.dur + 0.02)
    }
  }
}

/** Process-wide SFX bank (the game only needs one). */
export const audio = new AudioBank()
