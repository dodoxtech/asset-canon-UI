# 0008f. Dialogue window (open/typewriter/close)

- **Status:** done
- **Owner:** unassigned
- **Created:** 2026-06-24
- **Parent:** [0008](0008-build-engine-mvp.md)

## Goal
On pickup, slide up one GBA-style dialogue window with typewriter text from typed
section data, dim the world behind it, and close on input.

## Scope
- In: a typed `Section` shape + one sample entry; a dialogue window component
  (slide-up, typewriter reveal, world dim); open on the 0008e pickup event; close
  via ▶ button / click / Esc / tap; responsive sizing.
- Out: all 5 sections' real copy, Cano reactions, cutscene/CTA (0009).

## Steps
1. Define `data/sections.ts` with a typed `Section` (id, title, body) + one entry.
2. Dialogue window in `ui/`: slide up from bottom, typewriter the body char-by-char,
   dim the world behind (~40%). Tapping/click/▶ while typing reveals full text.
3. Subscribe to the pickup event from 0008e to open it with the sample section.
4. Close on ▶ / click / Esc / tap; restore world brightness; return control to play.
5. Ensure the window fits and is tappable on phone (portrait + landscape), within
   safe areas.

## Acceptance criteria
- [ ] Pickup opens the dialogue window with typewriter text from typed section data.
- [ ] World dims behind the window while open.
- [ ] Closes via ▶, click, Esc, and tap; play resumes after close.
- [ ] Window is legible and tappable on desktop and phone, both orientations.
