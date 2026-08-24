# bundle-demo

Loads the self-contained CogniPuzzle bundle from the CDN with one `<script>` tag — no npm dependency.

## Footprint

| File                                             | Role                                                    |
| ------------------------------------------------ | ------------------------------------------------------- |
| [`index.html`](index.html)                       | bundle `<script>` tag + local sample data               |
| [`vite.config.ts`](vite.config.ts)               | `isCustomElement` hint for `cogniplay-puzzle`           |
| [`public/sample-data.js`](public/sample-data.js) | host-supplied puzzle data                               |
| [`src/App.vue`](src/App.vue)                     | renders the element, feeds `:puzzle`, listens to events |

[`src/InstructionsPanel.vue`](src/InstructionsPanel.vue) is **not** part of the integration — see below.

## Facts

- The bundle self-registers `<cogniplay-puzzle>` on load.
- Version: this demo pins `/bundle/v1.7.0/`; `/bundle/v1/` is the major alias that follows deploys (5-min cache).
- Feed the puzzle as a **property** (`:puzzle="…"`), not a JSON attribute.
- Events are DOM `CustomEvent`s (payload in `event.detail`): `ready`, `started`, `piece-picked-up` / `piece-placed` / `piece-returned` / `piece-rotated`, `solved`, `error`. Attach listeners **before** setting `.puzzle` or the load's `ready` is missed.
- A solved board is final (ignores input); the **Reset** button calls `el.reset()` to return it to the start and re-fire `ready`.
- Bad input never throws: the element emits `error` and shows the `slot="fallback"` content.
- Give the element a **definite** `height` (here `360px`); `min-height` collapses the board.

## Instructions panel (hand-built)

- The element renders no instructions; its `tutorial` property needs host-supplied strings.
- The panel and its responsive behaviour (pinned ≥1200px; help button + modal below, `matchMedia`-driven) are hand-written in [`src/InstructionsPanel.vue`](src/InstructionsPanel.vue), copied from the hosted embed so the demos match.
- Reader chrome is the host's to own — a real cost of the bundle and npm patterns.

## Run

    pnpm dev   # http://localhost:3881
