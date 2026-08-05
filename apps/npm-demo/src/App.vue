<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  wirePuzzleToDomain,
  PUZZLE_EVENT_NAMES,
  type Puzzle,
  type WirePuzzle,
  type CogniplayPuzzleElement,
} from '@cogniplay/puzzle'
import InstructionsPanel from './InstructionsPanel.vue'

const CONTENT_API = 'https://cognipuzzle-embed.com/embed/telex/daily/current'

const puzzleEl = ref<CogniplayPuzzleElement | null>(null)
const puzzle = ref<Puzzle | null>(null)
const events = ref<string[]>([])
const fetchError = ref<string | null>(null)

function log(type: string, detail: unknown) {
  events.value.push(`${type} ${JSON.stringify(detail)}`)
}

onMounted(() => {
  const el = puzzleEl.value!
  for (const type of PUZZLE_EVENT_NAMES) {
    el.addEventListener(type, (e) => log(type, e.detail))
  }
  void loadToday()
})

function reset() {
  puzzleEl.value?.reset()
}

async function loadToday() {
  fetchError.value = null
  try {
    const res = await fetch(CONTENT_API)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body: { puzzle: WirePuzzle } = await res.json()
    puzzle.value = wirePuzzleToDomain(body.puzzle)
  } catch (err) {
    fetchError.value = err instanceof Error ? err.message : String(err)
  }
}
</script>

<template>
  <main>
    <h1>CogniPuzzle — npm package</h1>
    <p>
      The <code>&lt;cogniplay-puzzle&gt;</code> element comes from
      <code>@cogniplay/puzzle</code>, registered once at startup. Usage is fully
      typed.
    </p>
    <div class="stage">
      <cogniplay-puzzle ref="puzzleEl" :puzzle="puzzle" show-timer>
        <div slot="fallback" class="fallback">
          The puzzle could not be loaded. Please try again later.
        </div>
      </cogniplay-puzzle>
      <InstructionsPanel />
    </div>
    <p>
      <button @click="loadToday">Reload today's puzzle</button>
      <button @click="reset">Reset</button>
    </p>
    <p v-if="fetchError" class="fetch-error">
      Could not load today's puzzle ({{ fetchError }}).
    </p>
    <section>
      <h2>Event log</h2>
      <ul>
        <li v-for="(entry, i) in events" :key="i">{{ entry }}</li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}
/* The element measures its own box to lay out, so it needs a definite height.
   A min-height alone collapses the board. */
.stage {
  position: relative;
  display: flex;
  height: 360px;
  border: 1px solid #e4e4e7;
}
cogniplay-puzzle {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;

  /* Piece palette (slots 1-10 = author order a-j) */
  --cogniplay-piece-1-color: #009966;
  --cogniplay-piece-2-color: #009966;
  --cogniplay-piece-3-color: #113355;
  --cogniplay-piece-4-color: #113355;
  --cogniplay-piece-5-color: #7b52c2;
  --cogniplay-piece-6-color: #7b52c2;
  --cogniplay-piece-7-color: #7b52c2;
  --cogniplay-piece-8-color: #113355;
  --cogniplay-piece-9-color: #113355;
  --cogniplay-piece-10-color: #113355;

  /* Pieces */
  --cogniplay-piece-outline: cell;
  --cogniplay-piece-rim: cell;
  --cogniplay-piece-sheen: 0;
  --cogniplay-piece-shadow: 0;
  --cogniplay-preview-valid: rgba(0, 153, 102, 0.3);
  --cogniplay-preview-invalid: rgba(204, 0, 0, 0.3);

  /* Board and shared geometry */
  --cogniplay-board-cell-color: #808080;
  --cogniplay-board-outline: cell;
  --cogniplay-board-outline-color: #515151;
  --cogniplay-gap: 0;
  --cogniplay-corner-radius: 0.12;
  --cogniplay-outline-width: 1.5;
  --cogniplay-rim-width: 0.3;
  --cogniplay-rim-shadow-style: edge;
  --cogniplay-rim-shadow: 0.3;
  --cogniplay-rim-shadow-softness: 0.1;

  /* Blockers */
  --cogniplay-blocker-color: #ffffff;
  --cogniplay-blocker-logo-mode: one;

  /* Panel */
  --cogniplay-panel-color: #ffffff;
  --cogniplay-panel-rim: 12;
  --cogniplay-panel-radius: 24;
  --cogniplay-panel-shadow: 0.28;

  /* Tutorial overlay */
  --cogniplay-tutorial-accent: #009966;
  --cogniplay-tutorial-on-accent: #1a1a1f;
  --cogniplay-tutorial-bg: #32323a;
  --cogniplay-tutorial-text: #f5f5f7;
  --cogniplay-tutorial-text-secondary: #a1a1aa;
  --cogniplay-tutorial-surface: #26262d;
  --cogniplay-tutorial-scrim: #1a1a1f;
  --cogniplay-tutorial-radius: 1rem;

  /* Timer overlay */
  --cogniplay-timer-bg: rgba(0, 0, 0, 0.16);
  --cogniplay-timer-text: #424242;
  --cogniplay-timer-solved: #009966;
}
.fallback {
  padding: 2rem;
  background: #fdecec;
}
.fetch-error {
  color: #a33;
}
ul {
  font-family: monospace;
}
</style>
