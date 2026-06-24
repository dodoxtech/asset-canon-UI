// Typed section copy shown in the dialogue window on pickup. 0008f ships the
// shape + one sample entry; the real five sections and Cano reactions land in
// 0009. `index` from the pickup event maps into this array.

export interface Section {
  id: string
  title: string
  body: string
}

export const sections: Section[] = [
  {
    id: "shard-0",
    title: "A Shard of the Canon",
    body:
      "You pried a glowing shard loose from the workshop floor. It hums with " +
      "the memory of every asset ever forged here. Five of these, and the " +
      "canon reassembles itself. Four to go.",
  },
]

/** Section for a pickup slot, clamped to what exists (extras fall back). */
export function sectionForIndex(index: number): Section {
  return sections[index] ?? sections[sections.length - 1]
}
