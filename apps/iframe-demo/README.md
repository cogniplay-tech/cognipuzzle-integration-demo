# iframe-demo

Embeds the CogniPuzzle daily puzzle with a plain `<iframe>` — no Cogniplay
code dependency at all.

## Integration footprint

The only Cogniplay-aware file is [`src/App.vue`](src/App.vue): the iframe tag
and a `postMessage` listener. `package.json` is untouched Vite scaffold.

## How it works

- The iframe points at the hosted embed page:
  `https://cognipuzzle-embed.com/play.html?embed=<outlet>`.
- The host page owns the iframe's size. Puzzles adapt to whatever box they
  are given; there is deliberately no auto-resize/height protocol.
- Gameplay events are posted to the parent page as envelopes of the shape
  `{ source: "cogniplay", v: 1, type, payload }`:

| `type`     | `payload`                       |
| ---------- | ------------------------------- |
| `ready`    | `{ embed, puzzleType }`         |
| `started`  | `{}`                            |
| `progress` | `{ placed, total }` (throttled) |
| `solved`   | `{ elapsedMs }`                 |
| `error`    | `{ kind, message }`             |

Filter on `event.data?.source === "cogniplay"` and ignore everything else.

## Run

    pnpm dev   # http://localhost:3880
