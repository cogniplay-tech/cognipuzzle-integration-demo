# npm-demo

Installs `@cogniplay/puzzle` from the private registry — full TypeScript types, customer-controlled versioning. The integration is [`package.json`](package.json), the `defineCogniplayPuzzle()` call in [`src/main.ts`](src/main.ts), the `isCustomElement` hint in [`vite.config.ts`](vite.config.ts), and [`src/App.vue`](src/App.vue). The instructions UI, the mobile takeover, and the page chrome come from `demo-shared`, which is not part of the integration (see the root README).

## Registry

- Workspace-root [`.npmrc`](../../.npmrc) routes the `@cogniplay` scope to Cloudsmith.
- Auth comes from your user `~/.npmrc` (read-only entitlement token); no token is committed.

The package README (`node_modules/@cogniplay/puzzle/README.md`) is the authoritative integration guide.
