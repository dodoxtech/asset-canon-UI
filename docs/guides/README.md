# Guides

> Task-oriented how-tos. Each guide answers **"how do I do X?"** end-to-end.
> For *what the system is*, see [../architecture/](../architecture/). For exact
> rules and formats, see [../reference/](../reference/).

## Available guides

| Guide | Goal |
|---|---|
| _(add `installing-skills.md`)_ | Install the asset-canon skills into a project |
| _(add `generating-a-batch.md`)_ | Run a brief through the full pipeline |
| _(add `chroma-keying.md`)_ | Generate on a chroma plate and key it to clean alpha |
| _(add `spritesheets-and-atlases.md`)_ | Pack animation frames into a detectable grid |

> The table lists the guides this folder is *meant* to hold. Create a file when you
> write the guide, then link it here.

## How to write a guide (so agents can follow it)

1. **Start with the goal and the prerequisites** in one sentence each.
2. **Number the steps.** One action per step. Show the exact command or prompt.
3. **State the expected result** after a step that could silently fail.
4. **End with verification** — how to confirm it actually worked (e.g. "background
   is transparent, not white").
5. **Link the rules, don't restate them** — point to [../reference/](../reference/).

## Naming

`docs/guides/<verb>-<noun>.md`, lowercase kebab-case — e.g. `generating-a-batch.md`.
