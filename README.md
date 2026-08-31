# CogniPuzzle integration demo

Three minimal Vue 3 apps, one per way of integrating CogniPuzzle puzzles. Each
app contains everything its pattern needs and nothing more - copy the one that
matches how you integrate.

| App                                    | Pattern              | Dev port | Run               |
| -------------------------------------- | -------------------- | -------- | ----------------- |
| [`apps/iframe-demo`](apps/iframe-demo) | iframe embed         | 3880     | `pnpm dev:iframe` |
| [`apps/bundle-demo`](apps/bundle-demo) | `<script>` JS bundle | 3881     | `pnpm dev:bundle` |
| [`apps/npm-demo`](apps/npm-demo)       | npm package          | 3882     | `pnpm dev:npm`    |

## Setup

Every app reads the outlet and series slugs from `VITE_COGNIPLAY_OUTLET` and
`VITE_COGNIPLAY_SERIES`, and the embed host (assets and content API) from
`VITE_COGNIPLAY_EMBED_BASE_URL`:

    cp .env.example .env.local   # then fill in the outlet and series

`.env.local` lives at the workspace root (each app's `envDir` points here) and
is gitignored.

The example pre-fills the production embed host; point
`VITE_COGNIPLAY_EMBED_BASE_URL` (no trailing slash) at local or staging to
test other puzzle assets and content.

## Comparison

|                  | iframe                  | JS bundle                    | npm package                   |
| ---------------- | ----------------------- | ---------------------------- | ----------------------------- |
| Code dependency  | none                    | one `<script>` tag           | `@cogniplay/puzzle`           |
| Build config     | none                    | `isCustomElement` hint       | `isCustomElement` hint        |
| Data feed        | platform-resolved       | host-supplied and/or fetched | host-supplied and/or fetched  |
| TypeScript types | —                       | —                            | full (`Puzzle`, `WirePuzzle`) |
| Events           | `postMessage` envelopes | DOM `CustomEvent`s           | DOM `CustomEvent`s            |
| Instructions UI  | included                | hand-built                   | hand-built                    |
| Updates          | automatic               | pinned, or `v1` alias        | like any npm dependency       |

Shared by the two element demos:

- The puzzle is fed as a DOM **property** (`:puzzle="…"`), never a JSON
  attribute. The `isCustomElement` hint in `vite.config.ts` stops Vue from
  resolving `<cogniplay-puzzle>` as a component.
- The element renders no instructions (its `tutorial` property needs
  host-supplied strings), so `src/InstructionsPanel.vue` is the instructions UI,
  copied from the hosted embed. The host page builds and owns it; it is not part
  of the integration.
