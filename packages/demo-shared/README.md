# demo-shared

Code shared by the two element demos; not part of the integration.

- `PuzzleStage.vue` — stage with the mobile takeover; the element goes in its slot
- `InstructionsPanel.vue` — how-to-play panel
- `EventLog.vue` — event list
- `useTakeover.ts` — full-screen takeover behaviour
- `ModeToggle.vue` — light/dark button
- `useColorMode.ts` — the `dark` state behind it
- `styles.css` — `--demo-*` tokens and page styles; import once per app
