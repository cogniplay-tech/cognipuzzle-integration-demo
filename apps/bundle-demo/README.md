# bundle-demo

Loads the self-contained CogniPuzzle bundle from the CDN with one `<script>` tag — no npm dependency. The integration is that tag in [`index.html`](index.html), the `isCustomElement` hint in [`vite.config.ts`](vite.config.ts), and [`src/App.vue`](src/App.vue). [`src/InstructionsPanel.vue`](src/InstructionsPanel.vue) is the hand-built instructions UI, not part of the integration (see the root README).

- The `<script>` tag pins an exact bundle version (a path like `/bundle/v1.7.0/`). The major alias `/bundle/v1/` follows deploys instead (5-min cache).
- The bundle exposes a `CogniplayPuzzle` global; the puzzle from the content API is a `WirePuzzle`, translated with `CogniplayPuzzle.wirePuzzleToDomain()` before it is assigned.
