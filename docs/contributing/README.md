# Contributing

> How to change the project itself — add or edit a skill, and keep docs in sync.
> For *using* the skills, see [../guides/](../guides/).

## Where skills live

Skills are in [`../../.agents/skills/`](../../.agents/skills/), one folder per
skill, each with a `SKILL.md`. The orchestrator is `asset-canon`; specialists are
`asset-icon`, `asset-illustration`, `asset-sprite`, `asset-texture`. Installed
skills and their hashes are tracked in [`../../skills-lock.json`](../../skills-lock.json).

## Adding or changing a skill

1. **Edit `SKILL.md`.** Keep the YAML frontmatter (`name`, `description`) accurate —
   the `description` is how the skill gets discovered, so make it match what it does.
2. **Keep the hard rules intact.** A specialist must not contradict `asset-canon`'s
   pipeline rules (image-model-only pixels, deterministic names, chroma-key,
   mandatory descriptor).
3. **Update docs in the same change.** If you change a number or format, update the
   matching file in [../reference/](../reference/); if you change the flow, update
   [../architecture/](../architecture/); if it's a real decision, add an ADR in
   [../decisions/](../decisions/).
4. **Regenerate the lock** if the toolchain expects it, so `skills-lock.json`
   reflects the new content hash.

## Documentation rules

- One source of truth: authoritative rules live in `reference/`; everything else links.
- Each `docs/` folder's `README.md` is the contract for what may live in it — respect it.
- Lowercase `kebab-case` filenames; `.md` for prose, `.yaml` for descriptors.

## Checklist before you commit

- [ ] `SKILL.md` frontmatter `description` still matches behavior.
- [ ] No specialist contradicts `asset-canon` hard rules.
- [ ] Affected docs (`reference/`, `architecture/`, `decisions/`) updated.
- [ ] `skills-lock.json` regenerated if content changed.
