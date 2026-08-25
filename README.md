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
`VITE_COGNIPLAY_SERIES`:

    cp .env.example .env.local   # then fill in both values

`.env.local` lives at the workspace root (each app's `envDir` points here) and
is gitignored.

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
