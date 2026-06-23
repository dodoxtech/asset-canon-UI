# Reference

> The contracts. Exact formats, schemas, and fixed rules — the single source of
> truth that guides and skills link to. If a number or format is authoritative,
> it lives here. Keep entries terse and precise; no tutorials (see [../guides/](../guides/)).

## What belongs here

| Topic | File to add | Authoritative for |
|---|---|---|
| Asset descriptor schema | `descriptor-schema.md` | Fields/shape of `docs/assets/<slug>.yaml` |
| File naming | `naming.md` | `<slug>-<variant>-<WxH>.<ext>` rules |
| Canvas & export sizes | `canvas-sizes.md` | Master sizes + export ladders per asset type |
| Palette & chroma plates | `palette-and-chroma.md` | One-palette-per-batch, chroma-green/magenta rules |
| Spritesheet grid | `frame-grid.md` | Uniform cell, zero gutter, row-major, columns |

## Canonical rules (quick copy — full detail in the skill files)

**Deterministic filename:** `<slug>-<variant>-<WxH>.<ext>` — lowercase kebab-case,
no spaces, no timestamps. Example: `cart-icon-line-512x512.png`.

**Chroma plate:** generate transparent-background assets on solid chroma-green
`#00B140`, then key to alpha. The subject must avoid the green family
(~`#00A040`–`#40FF80`); if it's naturally green, switch to chroma-magenta `#FF00FF`.

**One palette per batch:** all assets in one request share one palette, one line
weight, one shading model.

**Fixed canvas:** generate at the largest target, then downscale — never upscale.

## Descriptor sidecar (the agent-readable contract)

Every shipped asset writes `docs/assets/<slug>.yaml` describing its content, style,
and intended placement so another agent can place it **without opening the image**.
See [../assets/](../assets/) for where they live and the canonical field set.
