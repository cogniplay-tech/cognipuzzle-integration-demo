# iframe-demo

Embeds CogniPuzzle with a plain `<iframe>` — no Cogniplay code dependency. The integration is [`src/App.vue`](src/App.vue): the iframe tag and a `postMessage` listener. Everything else is Vite scaffold.

- The host page owns the iframe size; puzzles adapt to any box (no auto-resize protocol).
- Gameplay events post to the parent as `{ source: "cogniplay", v: 1, embed, type, payload }`. Filter on `event.data?.source === "cogniplay"`.

| `type`            | `payload`                                                   |
| ----------------- | ----------------------------------------------------------- |
| `ready`           | `{ puzzleType, lesson? }`                                   |
| `started`         | `{ elapsedMs }`                                             |
| `piece-picked-up` | `{ pieceId, source, placed, total, elapsedMs }`             |
| `piece-placed`    | `{ pieceId?, source?, placed, total, solves, elapsedMs }`   |
| `piece-returned`  | `{ pieceId?, source?, release?, placed, total, elapsedMs }` |
| `piece-rotated`   | `{ pieceId, source, placed, total, elapsedMs }`             |
| `solved`          | `{ elapsedMs, placed, total }`                              |
| `error`           | `{ kind, message, variant? }`                               |

- The player starts the play as soon as the puzzle is ready, so `started` follows `ready` straight away. `elapsedMs` is the play's clock in milliseconds.

- `source`: `"tray"` or `"board"`, where the piece was when the gesture began.
- `release`: how a drag that did not place ended. `"on-board"` (pointer within a board cell), `"near-board"` (pointer off the board, piece outline still overlapping it), `"off-board"`, `"cancelled"` (Escape, lost pointer, drag recovery).
- `solves`: `true` on the placement that solved the puzzle, so a `solved` event follows it.
- `pieceId`, `source` and `release` are absent for the legacy variants (`quatro-legacy`, `hexa-legacy`), whose moves are taps.
