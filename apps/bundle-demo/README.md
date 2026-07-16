# bundle-demo

Loads the self-contained Cognipuzzle bundle from the CDN with one
`<script>` tag — no npm dependency.

## Integration footprint

Cogniplay-aware files:

- [`index.html`](index.html) — the bundle `<script>` tag (plus the local
  sample data).
- [`vite.config.ts`](vite.config.ts) — tells Vue's compiler that
  `cogniplay-puzzle` is a custom element.
- [`public/sample-data.js`](public/sample-data.js) — the host-supplied
  puzzle data for the demo.
- [`src/App.vue`](src/App.vue) — renders the element, feeds it the puzzle
  as a property, listens to its DOM events.

[`src/InstructionsPanel.vue`](src/InstructionsPanel.vue) is **not** in that
list, and that is the point — see below.

## The "How to play" panel is not free here

The hosted iframe embed ships a "How to play" panel alongside the puzzle. The
element ships no equivalent: it renders the board, and the guided tutorial it
does support (its `tutorial` property) requires the host to supply every string
it displays. This app shows a panel only because it is hand-written here, in
[`src/InstructionsPanel.vue`](src/InstructionsPanel.vue) — a copy of the hosted
one, kept so the three demos look alike and the comparison is about integration
rather than styling.

Adopt this pattern and the reader chrome — instructions, and anything else
around the board — is yours to build and to keep in step with ours. That is a
real cost of the bundle and npm patterns, and the reason the demos look
identical is a deliberate choice here, not something the bundle gives you.

## How it works

- The bundle self-registers `<cogniplay-puzzle>` on load. This demo pins the
  exact version (`/bundle/v1.1.0/`); `/bundle/v1/` is the major alias that
  follows new deploys automatically (5-minute cache).
- Feed the puzzle as a **property** (`:puzzle="…"`), not a JSON attribute.
- Events (`change`, `solve`, `error`) are ordinary DOM `CustomEvent`s;
  payload in `event.detail`.
- Bad input never throws at the host page: the element emits `error` and
  shows the `slot="fallback"` content.
- The host must give the element a **definite** height (here `height: 360px`).
  `min-height` alone is not enough — the element measures its own box to lay
  out, so it collapses to a squat layout.

## Run

    pnpm dev   # http://localhost:3881
