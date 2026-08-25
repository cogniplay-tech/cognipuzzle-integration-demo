# bundle-demo

Loads the self-contained CogniPuzzle bundle from the CDN with one `<script>` tag — no npm dependency. The integration is that tag in [`index.html`](index.html), the `isCustomElement` hint in [`vite.config.ts`](vite.config.ts), and [`src/App.vue`](src/App.vue). [`src/InstructionsPanel.vue`](src/InstructionsPanel.vue) is the hand-built instructions UI, not part of the integration (see the root README).

- This demo pins `/bundle/v1.7.0/`; `/bundle/v1/` is the major alias that follows deploys (5-min cache).
- The bundle exposes a `CogniplayPuzzle` global; the puzzle from the content API is a `WirePuzzle`, translated with `CogniplayPuzzle.wirePuzzleToDomain()` before it is assigned.
