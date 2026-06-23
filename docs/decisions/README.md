# Architecture Decision Records (ADRs)

> Why the project is the way it is. One file per decision, append-only: never
> rewrite history — supersede an old ADR with a new one. **For AI agents:** read
> these before proposing a change that contradicts an existing decision.

## Index

| # | Decision | Status |
|---|---|---|
| _0001_ | _(e.g. Instruction-first skills over bundled programs)_ | _Accepted_ |

> Add a row when you add an ADR.

## File format

`docs/decisions/NNNN-short-title.md`, zero-padded sequential — e.g.
`0001-instruction-first-skills.md`. Use this template:

```markdown
# NNNN. <Title>

- **Status:** Proposed | Accepted | Superseded by [NNNN](NNNN-...)
- **Date:** YYYY-MM-DD

## Context
What forces are at play? What problem are we solving?

## Decision
What we decided to do.

## Consequences
What becomes easier, what becomes harder, what we accept.
```

## Candidate decisions worth recording

These constraints already shape the system and deserve ADRs:

- Pixels come from an image model, never code-drawn.
- Instruction-first skills; bundled scripts are optional, never required.
- Chroma-key (green `#00B140` / magenta `#FF00FF`) instead of direct transparent output.
- Mandatory YAML sidecar descriptor per asset.
