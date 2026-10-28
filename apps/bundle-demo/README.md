# bundle-demo

Loads the self-contained CogniPuzzle bundle from the CDN with one `<script>` tag — no npm dependency. The integration is that tag in [`index.html`](index.html), the `isCustomElement` hint in [`vite.config.ts`](vite.config.ts), and [`src/App.vue`](src/App.vue). The rest of the page comes from `demo-shared`.

- The `<script>` tag pins an exact bundle version (a path like `/bundle/v2.0.0/`). The major alias `/bundle/v2/` follows deploys instead (5-min cache).
- The response from the content API is assigned to `.content` as it arrives, with no translation.
