# bundle-demo

Loads the self-contained CogniPuzzle bundle from the CDN with one `<script>` tag — no npm dependency. The integration is that tag in [`index.html`](index.html), the `isCustomElement` hint in [`vite.config.ts`](vite.config.ts), and [`src/App.vue`](src/App.vue) with its light and dark theme objects.
The instructions UI, the mobile takeover, and the page styles come from `demo-shared` - they are not part of the puzzle widget.

- The `<script>` tag pins an exact bundle version (a path like `/bundle/v1.7.1/`). The major alias `/bundle/v1/` follows deploys instead (5-min cache).
- The bundle exposes a `CogniplayPuzzle` global; the puzzle from the content API is a `WirePuzzle`, translated with `CogniplayPuzzle.wirePuzzleToDomain()` before it is assigned.
