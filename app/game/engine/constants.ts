// Shared engine constants. The virtual stage is a fixed GBA-ish 16:9 panel;
// everything is authored in these logical pixels and scaled by an integer
// factor to the viewport (task 0008c).

export const VIRTUAL_WIDTH = 480
export const VIRTUAL_HEIGHT = 270

/** Fixed simulation rate (Hz). */
export const UPDATES_PER_SECOND = 60
