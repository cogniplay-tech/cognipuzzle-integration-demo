<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'
import {
  wirePuzzleToDomain,
  PUZZLE_EVENT_NAMES,
  type Puzzle,
  type WirePuzzle,
  type CogniplayPuzzleElement,
  type ThemePatch,
} from '@cogniplay/puzzle'
import InstructionsPanel from './InstructionsPanel.vue'

const OUTLET: string | undefined = import.meta.env.VITE_COGNIPLAY_OUTLET
const SERIES: string | undefined = import.meta.env.VITE_COGNIPLAY_SERIES
const CONTENT_API = `https://cognipuzzle-embed.com/embed/${OUTLET}/${SERIES}/current`

// Outlet look. Every knob lives here, including timer-* and
// tutorial-*, and reaches the element through its `theme` property.
const theme: ThemePatch = {
  // Piece palette (slots 1-10 = author order a-j)
  'piece-1-color': '#009966',
  'piece-2-color': '#009966',
  'piece-3-color': '#113355',
  'piece-4-color': '#113355',
  'piece-5-color': '#7b52c2',
  'piece-6-color': '#7b52c2',
  'piece-7-color': '#7b52c2',
  'piece-8-color': '#113355',
  'piece-9-color': '#113355',
  'piece-10-color': '#113355',

  // Pieces
  'piece-outline': 'cell',
  'piece-rim': 'cell',
  'piece-sheen': '0',
  'piece-shadow': '0',
  'preview-valid': 'rgba(0, 153, 102, 0.3)',
  'preview-invalid': 'rgba(204, 0, 0, 0.3)',

  // Board and shared geometry
  'board-cell-color': '#808080',
  'board-outline': 'cell',
  'board-outline-color': '#515151',
  gap: '0',
  'corner-radius': '0.12',
  'outline-width': '1.5',
  'rim-width': '0.3',
  'rim-shadow-style': 'edge',
  'rim-shadow': '0.3',
  'rim-shadow-softness': '0.1',

  // Blockers
  'blocker-color': '#ffffff',
  'blocker-logo-mode': 'one',

  // Panel
  'panel-color': '#ffffff',
  'panel-rim': '12',
  'panel-radius': '24',
  'panel-shadow': '0.28',

  // Tutorial overlay
  'tutorial-accent': '#009966',
  'tutorial-on-accent': '#1a1a1f',
  'tutorial-bg': '#32323a',
  'tutorial-text': '#f5f5f7',
  'tutorial-text-secondary': '#a1a1aa',
  'tutorial-surface': '#26262d',
  'tutorial-scrim': '#1a1a1f',
  'tutorial-radius': '1rem',

  // Timer overlay
  'timer-bg': 'rgba(0, 0, 0, 0.16)',
  'timer-text': '#424242',
  'timer-solved': '#009966',
}

const puzzleEl = useTemplateRef<CogniplayPuzzleElement>('puzzleEl')
const puzzle = ref<Puzzle | null>(null)
const events = ref<string[]>([])
const loading = ref(false)
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
  loading.value = true
  fetchError.value = null
  try {
    if (!OUTLET || !SERIES)
      throw new Error(
        'VITE_COGNIPLAY_OUTLET and VITE_COGNIPLAY_SERIES must be set',
      )
    const res = await fetch(CONTENT_API)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = (await res.json()) as { puzzle: WirePuzzle }
    puzzle.value = wirePuzzleToDomain(body.puzzle)
  } catch (err) {
    fetchError.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
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
      <cogniplay-puzzle
        ref="puzzleEl"
        :puzzle="puzzle"
        :theme="theme"
        show-timer
      >
        <div slot="fallback" class="fallback">
          The puzzle could not be loaded. Please try again later.
        </div>
      </cogniplay-puzzle>
      <InstructionsPanel />
    </div>
    <p>
      <button :disabled="loading" @click="loadToday">
        Reload today's puzzle
      </button>
      <button @click="reset">Reset</button>
    </p>
    <p v-if="loading" class="loading">Loading today's puzzle…</p>
    <p v-else-if="fetchError" class="fetch-error">
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
}
.fallback {
  padding: 2rem;
  background: #fdecec;
}
.loading {
  color: #71717a;
}
.fetch-error {
  color: #a33;
}
ul {
  font-family: monospace;
}
</style>
