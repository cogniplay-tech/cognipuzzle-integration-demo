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

The responsive behaviour is hand-built too. Above 1200px the panel is pinned to
the right of the board; below it, the panel is replaced by a help button in the
board's corner that opens a modal (closed by Escape, a backdrop click, or its
close button). None of that comes from the element — it is this component's
`matchMedia` watcher and markup.

Adopt this pattern and the reader chrome — instructions, and anything else
around the board — is yours to build and to keep in step with ours. That is a
real cost of the bundle and npm patterns, and the reason the demos look
identical is a deliberate choice here, not something the package gives you.

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
