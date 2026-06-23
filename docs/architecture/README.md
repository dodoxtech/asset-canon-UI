# Architecture

> System-level documentation: how the pieces fit together. No how-to steps here
> (those live in [../guides/](../guides/)) and no exact field specs (those live in
> [../reference/](../reference/)). This folder answers **"what is this and how does it flow?"**

## The model

`asset-canon` is an **orchestrator** skill plus four **specialist** skills. The
orchestrator owns the pipeline; specialists own the rules for one asset type.

```
                ┌─────────────────────────────┐
   brief  ──►   │        asset-canon          │   orchestrator
                │  PLAN → GENERATE → POST →    │
                │  WRITE → REPORT             │
                └──────────────┬──────────────┘
                               │ selects one specialist per asset
        ┌──────────────┬───────┴───────┬──────────────┐
        ▼              ▼               ▼              ▼
   asset-icon   asset-illustration  asset-sprite  asset-texture
```

| Skill | Owns |
|---|---|
| `asset-canon` | The pipeline, hard rules, chroma-key step, descriptor write, reporting |
| `asset-icon` | Icon/favicon/app-icon families: grid, stroke, radius, size ladders |
| `asset-illustration` | Hero/spot/empty-state art: shared style system, composition |
| `asset-sprite` | Game sprites/tiles + frame-grid spritesheets and atlases |
| `asset-texture` | Seamless tileable textures + the 2×2 seam check |

## Key invariants (the "why it's reliable" part)

- **Pixels come from an image model, never from code.** The pipeline orchestrates
  generation + post-processing; it never hand-draws art.
- **Instruction-first.** Skills are instructions the agent executes with its own
  tools. Bundled `scripts/` are an optional CI/repo convenience, never required.
- **Deterministic outputs.** Fixed canvas sizes, `<slug>-<variant>-<WxH>.<ext>`
  names, one palette per batch — so results are reproducible and diffable.
- **Every asset ships a descriptor.** A `<slug>.yaml` in [../assets/](../assets/)
  lets another agent place the asset *without opening the image*.

## Where to go next

- Doing the work → [../guides/](../guides/)
- Exact formats and rules → [../reference/](../reference/)
- Why a decision was made → [../decisions/](../decisions/)
