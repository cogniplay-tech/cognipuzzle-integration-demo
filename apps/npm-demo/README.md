# npm-demo

Installs `@cogniplay/puzzle` from the private registry — full TypeScript
types, customer-controlled versioning.

## Registry setup

The workspace-root [`.npmrc`](../../.npmrc) routes the `@cogniplay` scope to
the Cloudsmith registry. Authentication comes from your user `~/.npmrc`
(read-only entitlement token) — no token is committed here.

## Integration footprint

Cogniplay-aware files:

- [`package.json`](package.json) — `@cogniplay/puzzle` pinned exactly.
- [`src/main.ts`](src/main.ts) — `defineCogniplayPuzzle()` once at startup.
- [`vite.config.ts`](vite.config.ts) — custom-element hint for Vue's compiler.
- [`public/sample-data.js`](public/sample-data.js) — host-supplied demo data.
- [`src/App.vue`](src/App.vue) — typed `Puzzle` ref, events, both data
  sources.

## How it works

- Two data sources are demonstrated: host-supplied data (the reliable path)
  and a live fetch from the content API, translated with
  `wirePuzzleToDomain()` (the API serves a `WirePuzzle`). API failures are
  handled gracefully — live content changes daily.
- Sizing: give the element a **definite** height (`height: 360px` here). A
  `min-height` is not enough — the element measures its own box to lay out, and
  will render a collapsed strip inside a taller one.
- Events and the fallback slot: identical element contract to the bundle
  pattern; see the package README (`node_modules/@cogniplay/puzzle/README.md`),
  which is the authoritative integration guide.
- `pnpm typecheck` (`vue-tsc --noEmit`) passing against the imported types is
  part of the point: the package's bundled types are self-contained.

## Run

    pnpm dev         # http://localhost:3882
    pnpm typecheck
