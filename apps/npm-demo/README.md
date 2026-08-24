# npm-demo

Installs `@cogniplay/puzzle` from the private registry — full TypeScript types, customer-controlled versioning.

## Footprint

| File                               | Role                                      |
| ---------------------------------- | ----------------------------------------- |
| [`package.json`](package.json)     | `@cogniplay/puzzle` pinned exactly        |
| [`src/main.ts`](src/main.ts)       | `defineCogniplayPuzzle()` once at startup |
| [`vite.config.ts`](vite.config.ts) | `isCustomElement` hint for Vue's compiler |
| [`src/App.vue`](src/App.vue)       | typed `Puzzle` ref, `ThemePatch`, events  |

[`src/InstructionsPanel.vue`](src/InstructionsPanel.vue) is **not** part of the integration — see below.

## Registry

- Workspace-root [`.npmrc`](../../.npmrc) routes the `@cogniplay` scope to Cloudsmith.
- Auth comes from your user `~/.npmrc` (read-only entitlement token); no token is committed.

## Facts

- The puzzle comes from a live fetch translated with `wirePuzzleToDomain()` (the API serves a `WirePuzzle`).
- Theming is a typed `ThemePatch` object assigned to the element's `theme` property (`:theme="theme"`); every knob, including `timer-*` and `tutorial-*`, goes there.
- Events are DOM `CustomEvent`s: `ready`, `started`, `piece-picked-up` / `piece-placed` / `piece-returned` / `piece-rotated`, `solved`, `error`. Listeners use the typed `addEventListener` overload from `CogniplayPuzzleEventMap`, so `event.detail` is typed with no casts. Attach them **before** setting `.puzzle` or the load's `ready` is missed.
- A solved board is final (ignores input); the **Reset** button calls `el.reset()` to return it to the start and re-fire `ready`. Bad input emits `error` and shows the `slot="fallback"` content.
- Give the element a **definite** `height` (`360px`); `min-height` collapses the board.
- `pnpm typecheck` (`vue-tsc --noEmit`) passes against the bundled types — they are self-contained.
- The package README (`node_modules/@cogniplay/puzzle/README.md`) is the authoritative integration guide.

## Instructions panel (hand-built)

- The element renders no instructions; its `tutorial` property needs host-supplied strings.
- The panel and its responsive behaviour (pinned ≥1200px; help button + modal below, `matchMedia`-driven) are hand-written in [`src/InstructionsPanel.vue`](src/InstructionsPanel.vue), copied from the hosted embed so the demos match.
- Reader chrome is the host's to own — a real cost of the bundle and npm patterns.

## Run

    pnpm dev         # http://localhost:3882
    pnpm typecheck
