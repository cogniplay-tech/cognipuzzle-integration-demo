# iframe-demo

Embeds CogniPuzzle with a plain `<iframe>` — no Cogniplay code dependency. The integration is [`src/App.vue`](src/App.vue): the iframe tag and a `postMessage` listener. Everything else is Vite scaffold.

- The host page owns the iframe size; puzzles adapt to any box (no auto-resize protocol).
- Gameplay events post to the parent as `{ source: "cogniplay", v: 1, embed, type, payload }`. Filter on `event.data?.source === "cogniplay"`.

| `type`            | `payload`                                        |
| ----------------- | ------------------------------------------------ |
| `ready`           | `{ puzzleType }`                                 |
| `started`         | `{}`                                             |
| `piece-picked-up` | `{ pieceId, source, placed, total }`             |
| `piece-placed`    | `{ pieceId?, source?, placed, total, solves }`   |
| `piece-returned`  | `{ pieceId?, source?, release?, placed, total }` |
| `piece-rotated`   | `{ pieceId, source, placed, total }`             |
| `solved`          | `{ elapsedMs, placed, total }`                   |
| `error`           | `{ kind, message, variant? }`                    |

- `source`: `"tray"` or `"board"`, where the piece was when the gesture began.
- `release`: how a drag that did not place ended. `"on-board"` (pointer within a board cell), `"near-board"` (pointer off the board, piece outline still overlapping it), `"off-board"`, `"cancelled"` (Escape, lost pointer, drag recovery).
- `solves`: `true` on the placement that solved the puzzle, so a `solved` event follows it.
- `pieceId`, `source` and `release` are absent for the legacy variants (`quatro-legacy`, `hexa-legacy`), whose moves are taps.
