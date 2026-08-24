# iframe-demo

Embeds CogniPuzzle with a plain `<iframe>` — no Cogniplay code dependency. The integration is [`src/App.vue`](src/App.vue): the iframe tag and a `postMessage` listener. Everything else is Vite scaffold.

- The host page owns the iframe size; puzzles adapt to any box (no auto-resize protocol).
- Gameplay events post to the parent as `{ source: "cogniplay", v: 1, embed, type, payload }`. Filter on `event.data?.source === "cogniplay"`.

| `type`            | `payload`                      |
| ----------------- | ------------------------------ |
| `ready`           | `{ puzzleType }`               |
| `started`         | `{}`                           |
| `piece-picked-up` | `{ pieceId, placed, total }`   |
| `piece-placed`    | `{ pieceId, placed, total }`   |
| `piece-returned`  | `{ pieceId, placed, total }`   |
| `piece-rotated`   | `{ pieceId, placed, total }`   |
| `solved`          | `{ elapsedMs, placed, total }` |
| `error`           | `{ kind, message, variant? }`  |
