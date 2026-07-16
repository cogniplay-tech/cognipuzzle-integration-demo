# iframe-demo

Embeds the CogniPuzzle daily puzzle with a plain `<iframe>` — no Cogniplay code dependency.

**Footprint:** only [`src/App.vue`](src/App.vue) — the iframe tag and a `postMessage` listener. `package.json` is untouched Vite scaffold.

## Facts

- Source: `https://cognipuzzle-embed.com/play.html?embed=<outlet>`.
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

The relay strips `state` from the payload (write-only on the wire); `pieceId` is
omitted for legacy variants; `tutorial-complete`/`tutorial-exit` (`{}`) and the
shell's `load-error` also arrive.

## Run

    pnpm dev   # http://localhost:3880
