// Hand-authored valid sample content — the realistic "outlet supplies the data"
// scenario. No import/bundler: a plain global the page and the smoke test read.
window.cogniplaySample = {
  puzzle: {
    type: "quatro-mino",
    difficulty: "beginner",
    board: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]],
    blockers: [],
    pieces: [
      { id: "a", color: "88C761", orientations: [[[0,0],[1,0],[0,1],[1,1]]] },
      { id: "b", color: "4FA3E3", orientations: [[[0,0],[1,0],[2,0],[3,0]]] },
    ],
  },
  tutorial: {
    puzzle: {
      type: "quatro-mino", difficulty: "beginner",
      board: [[0,0],[1,0],[0,1],[1,1]], blockers: [],
      pieces: [{ id: "a", color: "88C761", orientations: [[[0,0],[1,0],[0,1],[1,1]]] }],
    },
    pinnedOrientations: [0],
    script: [
      { kind: "info", id: "objective" },
      { kind: "place", pieceId: "a", lesson: "drag", target: { origin: [0,0], orientationIndex: 0 }, hintCells: [[0,0],[1,0],[0,1],[1,1]] },
    ],
    strings: {
      lessons: {
        drag: { title: "Drag the piece", touch: "Drag it onto its spot.", keyboard: "Drag it onto its spot." },
        rotate: { title: "Rotate", touch: "", keyboard: "" },
        flip: { title: "Flip", touch: "", keyboard: "" },
        flipRotate: { title: "Flip, then rotate", touch: "", keyboard: "" },
      },
      info: { objective: { title: "Fill the board", body: "Place every piece — no gaps." } },
      done: { title: "You've got it 🎉", subtitle: "That's the idea.", button: "Done" },
      controls: { next: "Next", skip: "Skip tutorial" },
    },
  },
};
