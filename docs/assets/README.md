# Asset Descriptors

> This folder holds one **sidecar descriptor** per generated asset:
> `docs/assets/<slug>.yaml`. Descriptors are machine-readable so an agent can
> **place and reuse an asset without ever opening the image file**.
>
> **For AI agents:** to find a usable asset, read the `.yaml` files here — not the
> images. The descriptor tells you the subject, style, placement, and the exact
> files on disk. An asset is **not "done"** until its descriptor exists.

## Naming

`docs/assets/<slug>.yaml` — `<slug>` matches the asset's filename slug
(see [../reference/](../reference/) for `<slug>-<variant>-<WxH>.<ext>`).

## Descriptor shape

```yaml
slug: cart-icon              # kebab-case, matches the file slug
type: icon                   # icon | illustration | sprite | texture
subject: "shopping cart"     # what the asset depicts
style:
  palette: ["#1A1A1A"]       # hexes actually used
  line: line                 # line | solid | duotone | flat | ...
  shading: flat
intended_use: "primary nav add-to-cart button"
alt_text: "shopping cart"    # accessibility text for placement
composition: "centered, even padding"   # illustrations: where the negative space is
transparent: true            # was the background keyed to alpha?
# type-specific extras:
# tileable: true             # texture
# tile_size: 1024            # texture
# tonality: low-contrast     # texture
# columns: 6                 # sprite spritesheet
# atlas: cart-walk-atlas.json
files:                       # every exported file for this asset
  - cart-icon-line-512x512.png
  - cart-icon-line-256x256.png
  - cart-icon-line-512x512.webp
```

The full per-type field set is defined in [../reference/](../reference/)
(`descriptor-schema.md`). Keep this README's example in sync with it.

## Rules

- One descriptor per asset slug. Variants/sizes are listed under `files:`, not as
  separate descriptors.
- Generated image binaries may live elsewhere in the consuming project; the
  descriptor records their paths. This folder is for the `.yaml`, not the pixels.
