# CogniPuzzle integration demo

Three minimal Vue 3 apps, one per way of integrating CogniPuzzle puzzles. Each
app contains everything its pattern needs and nothing more — copy the one that
matches how you integrate.

| App                                    | Pattern              | Dev port | Run               |
| -------------------------------------- | -------------------- | -------- | ----------------- |
| [`apps/iframe-demo`](apps/iframe-demo) | iframe embed         | 3880     | `pnpm dev:iframe` |
| [`apps/bundle-demo`](apps/bundle-demo) | `<script>` JS bundle | 3881     | `pnpm dev:bundle` |
| [`apps/npm-demo`](apps/npm-demo)       | npm package          | 3882     | `pnpm dev:npm`    |

## Comparison

|                  | iframe                  | JS bundle              | npm package                   |
| ---------------- | ----------------------- | ---------------------- | ----------------------------- |
| Code dependency  | none                    | one `<script>` tag     | `@cogniplay/puzzle`           |
| Build config     | none                    | `isCustomElement` hint | `isCustomElement` hint        |
| Data feed        | platform-resolved       | host-supplied          | host-supplied and/or fetched  |
| TypeScript types | —                       | —                      | full (`Puzzle`, `WirePuzzle`) |
| Events           | `postMessage` envelopes | DOM `CustomEvent`s     | DOM `CustomEvent`s            |
| Instructions UI  | included                | hand-built             | hand-built                    |
| Updates          | automatic               | pinned, or `v1` alias  | like any npm dependency       |

Event names and payloads: see each app's README.
