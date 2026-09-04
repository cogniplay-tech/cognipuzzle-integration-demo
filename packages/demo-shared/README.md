# demo-shared

Code shared by the two element demos. It is not part of the CogniPuzzle integration; the root README explains the split.

- `PuzzleStage.vue` — the bordered stage around `<cogniplay-puzzle>` with the mobile takeover, tap layer, and teleported instructions panel. The element goes in its default slot.
- `InstructionsPanel.vue` — the "How to play" aside on wide viewports, a help button and card on narrow ones.
- `EventLog.vue` — the event list, fed through its `entries` prop.
- `useTakeover.ts` — grows an element to full screen and back.
- `styles.css` — page backdrop, `main`, and the `.button`, `.actions`, `.loading`, `.fetch-error`, and `.fallback` classes. Import it once from the app's entry point.
