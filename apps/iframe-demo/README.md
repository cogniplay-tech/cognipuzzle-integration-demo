# iframe-demo

Embeds the CogniPuzzle daily puzzle with a plain `<iframe>` — no Cogniplay code dependency.

**Footprint:** only [`src/App.vue`](src/App.vue) — the iframe tag and a `postMessage` listener. `package.json` is untouched Vite scaffold.

## Facts

- Source: `https://cognipuzzle-embed.com/play.html?embed=<outlet>`.
- The host page owns the iframe size; puzzles adapt to any box (no auto-resize protocol).
- Gameplay events post to the parent as `{ source: "cogniplay", v: 1, type, payload }`. Filter on `event.data?.source === "cogniplay"`.

| `type`     | `payload`                       |
| ---------- | ------------------------------- |
| `ready`    | `{ embed, puzzleType }`         |
| `started`  | `{}`                            |
| `progress` | `{ placed, total }` (throttled) |
| `solved`   | `{ elapsedMs }`                 |
| `error`    | `{ kind, message }`             |

## Run

    pnpm dev   # http://localhost:3880
