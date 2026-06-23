# Tasks

> Work items: one file per task. A task is a self-contained unit of work an agent
> or human can pick up, execute, and verify. **For AI agents:** when asked to "work
> on a task" or "continue", read the relevant file here for the goal, scope, and
> acceptance criteria before touching code.
>
> Tasks describe *what to do and when it's done*. They are not decisions
> ([../decisions/](../decisions/)) and not how-tos ([../guides/](../guides/)).

## Layout

```
tasks/
├── README.md
├── backlog/      # not started yet
├── active/       # in progress (move here when work starts)
└── done/         # completed (move here when acceptance criteria pass)
```

Move a task file between folders as its status changes — the folder *is* the status.

## Naming

`NNNN-short-title.md`, zero-padded sequential — e.g. `0007-add-descriptor-schema-doc.md`.
The number is stable; it never changes when the file moves between folders.

## Task file template

```markdown
# NNNN. <Title>

- **Status:** backlog | active | done
- **Owner:** <who/which agent>
- **Created:** YYYY-MM-DD

## Goal
One sentence: what outcome this produces.

## Context
Why now, and any links — related [ADR](../../decisions/), skill, or guide.

## Scope
- In: what this task covers
- Out: what it explicitly does not

## Steps
1. …

## Acceptance criteria
- [ ] Verifiable condition that means "done"
- [ ] …
```

## Rules

- One task per file. Split big work into several numbered tasks.
- A task is only `done` when every acceptance checkbox is checked.
- Reference, don't restate: link the authoritative rule in [../reference/](../reference/)
  rather than copying it into the task.
