# Documentation

> **For AI agents:** this is the entry point. Start here, then jump to the folder
> whose README matches your task. Every folder below has a `README.md` that tells
> you what belongs there and where to look next. Read the folder README before
> reading or writing any file inside it.

`asset-canon` is an **instruction-first asset pipeline** delivered as agent skills.
It turns a short brief into production-ready image files on disk:

```
BRIEF  ->  PLAN  ->  GENERATE  ->  POST-PROCESS  ->  WRITE  ->  REPORT
```

The skills themselves live in [`.agents/skills/`](../.agents/skills/). This `docs/`
tree is the human- and agent-readable knowledge base around them.

## Map

| Folder | What's inside | Read it when you want to… |
|---|---|---|
| [landing-page/](landing-page/) | Design spec for the GBA-style playable marketing landing page | Build or change the public landing page |
| [architecture/](architecture/) | How the orchestrator + specialist skills and the pipeline fit together | Understand the system end-to-end |
| [guides/](guides/) | Task-oriented how-tos (install skills, generate a batch, key chroma) | Actually do something |
| [reference/](reference/) | Specs & contracts: descriptor schema, naming, palette/canvas rules | Look up an exact rule or format |
| [assets/](assets/) | Generated asset **sidecar descriptors** (`<slug>.yaml`) | Place/reuse an asset without opening the image |
| [tasks/](tasks/) | Work items (backlog / active / done), one file per task | Pick up, track, or continue a unit of work |
| [decisions/](decisions/) | Architecture Decision Records (ADRs) | Know *why* something is the way it is |
| [contributing/](contributing/) | How to add or change a skill | Modify the project itself |

## Conventions used across these docs

- **Filenames:** lowercase `kebab-case`. Markdown is `.md`; descriptors are `.yaml`.
- **Each folder is self-describing:** its `README.md` is the contract for what may
  live there. Don't drop files into a folder without matching its README.
- **Link, don't duplicate:** reference the canonical rule in `reference/` rather than
  re-stating it. One source of truth per fact.
- **Stay current:** if you change a rule in a skill, update the matching doc in the
  same change.
