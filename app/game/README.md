# Game source

Client-side engine for the CANON QUEST grey-box MVP (task 0008).

- `engine/` — loop, time, shared constants
- `scenes/` — room/scene definitions
- `entities/` — player, collectibles
- `ui/` — HUD and dialogue overlays
- `assets.ts` — typed asset manifest + `asset()` helper
- `GameStage.tsx` — `"use client"` shell that owns the canvas + loop
