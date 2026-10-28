# npm-demo

Installs `@cogniplay/puzzle` from the private registry — full TypeScript types, customer-controlled versioning. The integration is [`package.json`](package.json), the `defineCogniplayPuzzle()` call in [`src/main.ts`](src/main.ts), the `isCustomElement` hint in [`vite.config.ts`](vite.config.ts), and [`src/App.vue`](src/App.vue). The rest of the page comes from `demo-shared`.

## Registry

- Workspace-root [`.npmrc`](../../.npmrc) routes the `@cogniplay` scope to Cloudsmith.
- Auth comes from your user `~/.npmrc` (read-only entitlement token); no token is committed.

## Starting the play

A loaded puzzle waits, with its blockers hidden and no input taken, until the page begins the play. This demo begins it from a button, as an embedded puzzle would:

1. Every load is a fresh play. Until `ready` the stage shows a disabled Loading… button, which turns into Start over the waiting board. If the puzzle cannot be loaded (a failed fetch, or `error` from the element), the button goes and the error shows instead.
2. Start calls `start()`. The button goes on `started`, and the timer runs from 0.
3. `solved` saves `{ state, elapsedMs }` in `localStorage`. On a later visit, if the saved state's `puzzleId` matches the puzzle on `ready`, the page calls `resume(state, { elapsedMs })` at once instead of showing the button. The element shows the final board with the clock frozen at the solving time, and fires `resumed` with `solved: true`. A solve saved for another puzzle is ignored.
4. On narrow screens the stage's "Tap to play" layer replaces the Start button. The tap expands the stage and begins the play in the same tap. A tap before `ready` begins it once the puzzle is ready, with Loading… showing until then.
5. Reset clears the board within the play and the clock keeps running. Reloading the puzzle ends the play and brings the button back.

The package README (`node_modules/@cogniplay/puzzle/README.md`) is the authoritative integration guide.
