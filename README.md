# CogniPuzzle integration demo

Three minimal Vue 3 apps, one per way of integrating CogniPuzzle puzzles. Each
app holds only its integration; the two element demos share the rest of the
page through [`packages/demo-shared`](packages/demo-shared).

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
| Instructions UI  | included                | `demo-shared`                | `demo-shared`                 |
| Updates          | automatic               | pinned, or `v1` alias        | like any npm dependency       |

Shared by the two element demos:

- The puzzle is fed as a DOM **property** (`:puzzle="…"`), never a JSON
  attribute. The `isCustomElement` hint in `vite.config.ts` stops Vue from
  resolving `<cogniplay-puzzle>` as a component.
- The element renders no instructions (its `tutorial` property needs
  host-supplied strings), so the host page builds and owns the instructions
  UI.
- `packages/demo-shared` is shared scaffolding, not part of the integration.
- Light/dark mode: `ModeToggle.vue` toggles a `dark` class on the root
  element, the `--demo-*` tokens in `styles.css` switch with it, and each app's
  `theme` object references them.

## Theme knobs

The element is themed through its `theme` property, a plain object keyed by
knob name. Absent knobs fall back to the defaults below, so `{}` (or `null`)
restores the stock look. Assigning `theme` repaints immediately and keeps
play in progress.

Colour knobs take any CSS colour: hex, `rgb()`, `oklch()`, `light-dark()`,
or a reference to one of your own tokens such as `var(--brand-primary)`. A
referenced token is followed live, because colours are consumed by the
browser's cascade rather than resolved in JS. Every colour knob is also a
custom property on the element, `--cogniplay-<knob>`, that page CSS may set
directly on the element or an ancestor. Modes, dials, and `blocker-logo`
drive geometry and DOM structure, so they exist only on `theme`.

Per knob, the cascade decides:

| `theme` has the knob | What wins                                             |
| -------------------- | ----------------------------------------------------- |
| yes                  | the `theme` value (an inline property on the element) |
| no                   | your page CSS rule, if any                            |
| no, and no page CSS  | the default                                           |

The element owns the `--cogniplay-*` declarations in its own `style`
attribute, so page CSS belongs in a stylesheet rule, never in that attribute.
A malformed colour is dropped and the knob falls back to its default. A
reference to a token the page never defines degrades to the default too.

Three keywords change what is drawn rather than its colour, and act only
through `theme`: `board-cell-color: transparent` paints nothing,
`board-cell-rim-color: none` removes the rim and its shadow, and
`panel-color` unset or `none` draws no panel.

### Colours, overlays, and the brand mark

| Knob                               | Custom property                                            | What it does                                                                                                                                                                                                                             | Default                                                                                                                   |
| ---------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `piece-1-color` … `piece-10-color` | `--cogniplay-piece-1-color` … `--cogniplay-piece-10-color` | The ten piece-colour palette slots (author order `a`–`j`, slot 1 = `a` … slot 10 = `j`). Pieces authored with a verbatim hex instead of a slot ignore these.                                                                             | `#2196F3`, `#F44336`, `#4CAF50`, `#FFD700`, `#9C27B0`, `#FF9800`, `#99D9EA`, `#FFAEC9`, `#8B4513`, `#B5E61D` (slots 1…10) |
| `preview-valid`                    | `--cogniplay-preview-valid`                                | Drag drop-target tint when the hovered placement is valid.                                                                                                                                                                               | `rgba(136, 199, 97, 0.30)`                                                                                                |
| `preview-invalid`                  | `--cogniplay-preview-invalid`                              | Drag drop-target tint when the hovered placement is invalid.                                                                                                                                                                             | `rgba(236, 98, 92, 0.30)`                                                                                                 |
| `blocker-logo`                     | theme only                                                 | An `<image>`-valid href for a brand mark stamped on blocker cells. Use an inline SVG or data URI (a `;base64` one is fine). Set the raw URL or data URI, not `url(...)`. A remote URL works but degrades to no mark if it fails to load. | unset (no logo)                                                                                                           |
| `blocker-logo-mode`                | theme only                                                 | `one` (first blocker only) or `all` (every blocker).                                                                                                                                                                                     | `one`                                                                                                                     |
| `tutorial-accent`                  | `--cogniplay-tutorial-accent`                              | Accent colour of the tutorial overlay and its button.                                                                                                                                                                                    | `#8aa3ef`                                                                                                                 |
| `tutorial-on-accent`               | `--cogniplay-tutorial-on-accent`                           | Text on that accent.                                                                                                                                                                                                                     | `#1a1a1f`                                                                                                                 |
| `tutorial-bg`                      | `--cogniplay-tutorial-bg`                                  | Overlay panel background.                                                                                                                                                                                                                | `#32323a`                                                                                                                 |
| `tutorial-text`                    | `--cogniplay-tutorial-text`                                | Primary text.                                                                                                                                                                                                                            | `#f5f5f7`                                                                                                                 |
| `tutorial-text-secondary`          | `--cogniplay-tutorial-text-secondary`                      | Secondary text.                                                                                                                                                                                                                          | `#a1a1aa`                                                                                                                 |
| `tutorial-surface`                 | `--cogniplay-tutorial-surface`                             | Icon well surface.                                                                                                                                                                                                                       | `#26262d`                                                                                                                 |
| `tutorial-scrim`                   | `--cogniplay-tutorial-scrim`                               | Backdrop scrim.                                                                                                                                                                                                                          | `#1a1a1f`                                                                                                                 |
| `tutorial-radius`                  | `--cogniplay-tutorial-radius`                              | Panel corner radius. A CSS length.                                                                                                                                                                                                       | `1rem`                                                                                                                    |
| `timer-bg`                         | `--cogniplay-timer-bg`                                     | Timer band background.                                                                                                                                                                                                                   | `rgba(0, 0, 0, .16)`                                                                                                      |
| `timer-text`                       | `--cogniplay-timer-text`                                   | Timer text.                                                                                                                                                                                                                              | `#424242`                                                                                                                 |
| `timer-solved`                     | `--cogniplay-timer-solved`                                 | Timer text once solved.                                                                                                                                                                                                                  | `#388e3c`                                                                                                                 |

### Board, pieces, blockers, and panel

Defaults reproduce the classic look exactly. Numbers are clamped to their
range, and an unrecognised keyword falls back to the default.

| Knob                    | Custom property                     | What it does                                                                                                                                                                                                                                       | Default                                       |
| ----------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| `gap`                   | theme only                          | Space reserved between distinct objects (pieces, blockers, board cells) as a fraction of cell size (0–0.25). At `0` the board fuses into one seamless carpet.                                                                                      | `0`                                           |
| `corner-radius`         | theme only                          | Corner rounding as a fraction of edge length, all geometries.                                                                                                                                                                                      | `0.12`                                        |
| `rim-width`             | theme only                          | Width of the inset rim band (see `board-cell-rim-color`, `piece-rim`, `blocker-rim-color`) as a fraction of cell size.                                                                                                                             | `0.3`                                         |
| `rim-shadow`            | theme only                          | Strength (0–1) of the rim depth shadow. Only drawn when a rim is present. `0` = flat. The default depends on `rim-shadow-style`.                                                                                                                   | `0.3` (edge) / `0.5` (inset)                  |
| `rim-shadow-style`      | theme only                          | `edge` = a crisp darker line along the rim face's upper-left edges (the classic hex-nub cue, no filter), `inset` = a soft inner-shadow band via an SVG filter.                                                                                     | `edge`                                        |
| `rim-shadow-softness`   | theme only                          | Sharpness of the `inset` band (0–1). `0` = crisp, `1` = a wide blurred gradient. Ignored by `edge`.                                                                                                                                                | `0.1`                                         |
| `board-cell-color`      | `--cogniplay-board-cell-color`      | Empty board cell fill. The keyword `transparent`, set through `theme`, paints nothing at all (no fill, rim, or outline) so the panel or page shows through. Set from CSS it is a plain transparent fill.                                           | `#9a9a9a`                                     |
| `board-cell-rim-color`  | `--cogniplay-board-cell-rim-color`  | Board cell inset rim colour. The keyword `none`, set through `theme`, removes the rim and its shadow.                                                                                                                                              | derived (lighter shade of `board-cell-color`) |
| `board-outline`         | theme only                          | `cell` (every board cell strokes its own boundary), `silhouette` (the carpet strokes its outer boundary once, only at `gap: 0`), `none` (no stroke).                                                                                               | `cell`                                        |
| `board-outline-color`   | `--cogniplay-board-outline-color`   | Board outline stroke colour.                                                                                                                                                                                                                       | `#606060`                                     |
| `piece-outline`         | theme only                          | Same three modes as `board-outline`, applied to pieces and blockers.                                                                                                                                                                               | `cell`                                        |
| `piece-outline-color`   | `--cogniplay-piece-outline-color`   | Piece/blocker outline stroke colour (alpha allowed). Unset → a darker shade of the piece's own colour, derived in CSS so it follows a token-bound fill.                                                                                            | unset (derived)                               |
| `piece-rim`             | theme only                          | `none` / `cell` / `silhouette`, an inset rim band inside each piece/blocker.                                                                                                                                                                       | `cell`                                        |
| `piece-rim-color`       | `--cogniplay-piece-rim-color`       | Piece/blocker rim colour. Unset → a lighter shade of the piece's own colour, derived in CSS.                                                                                                                                                       | unset (derived)                               |
| `outline-width`         | theme only                          | Stroke width in px, board and piece/blocker outlines alike.                                                                                                                                                                                        | `1.5`                                         |
| `piece-sheen`           | theme only                          | Peak opacity of a white top-down sheen across each piece/blocker.                                                                                                                                                                                  | `0`                                           |
| `piece-shadow`          | theme only                          | Drop-shadow opacity on loose (tray and dragged) pieces.                                                                                                                                                                                            | `0`                                           |
| `blocker-color`         | `--cogniplay-blocker-color`         | Blocker cell fill.                                                                                                                                                                                                                                 | `#F0F0F0`                                     |
| `blocker-rim-color`     | `--cogniplay-blocker-rim-color`     | Blocker rim colour (see `piece-rim`). Unset → derived from `blocker-color`.                                                                                                                                                                        | `#909090`                                     |
| `blocker-outline-color` | `--cogniplay-blocker-outline-color` | Blocker outline colour (outline mode follows `piece-outline`). Unset → derived from `blocker-color`, matching the board outline so a blocker reads as board furniture.                                                                             | `#606060`                                     |
| `panel-color`           | `--cogniplay-panel-color`           | Colour of a panel painted behind the board, following the board's own outline rather than a bounding rect. `none` or unset disables it. The panel is switched on by setting this knob through `theme` (any colour, including a `var()` reference). | unset (no panel)                              |
| `panel-rim`             | theme only                          | How far the panel grows outward past the board's edge, in px. Clamped to roughly half a cell, so very large values plateau.                                                                                                                        | `12`                                          |
| `panel-radius`          | theme only                          | Panel corner radius, in px.                                                                                                                                                                                                                        | `24`                                          |
| `panel-shadow`          | theme only                          | Panel drop-shadow opacity (0–1).                                                                                                                                                                                                                   | `0.28`                                        |

The package README (`node_modules/@cogniplay/puzzle/README.md`) carries the
same tables with a worked "Theming from CSS" example.
