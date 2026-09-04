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
import { PuzzleStage, EventLog, ModeToggle, useColorMode } from 'demo-shared'

const OUTLET: string | undefined = import.meta.env.VITE_COGNIPLAY_OUTLET
const SERIES: string | undefined = import.meta.env.VITE_COGNIPLAY_SERIES
const BASE_URL: string | undefined = import.meta.env
  .VITE_COGNIPLAY_EMBED_BASE_URL
const CONTENT_API = `${BASE_URL}/embed/${OUTLET}/${SERIES}/current`

const lightTheme: ThemePatch = {
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

const darkTheme: ThemePatch = {
  ...lightTheme,
  'piece-1-color': '#34d399',
  'piece-2-color': '#34d399',
  'piece-3-color': '#93c5fd',
  'piece-4-color': '#93c5fd',
  'piece-5-color': '#c4b5fd',
  'piece-6-color': '#c4b5fd',
  'piece-7-color': '#c4b5fd',
  'piece-8-color': '#93c5fd',
  'piece-9-color': '#93c5fd',
  'piece-10-color': '#93c5fd',
  'preview-valid': 'rgba(52, 211, 153, 0.3)',
  'board-cell-color': '#2b3442',
  'board-outline-color': '#8593a6',
  'blocker-color': '#3f3f46',
  'tutorial-accent': '#34d399',
  'timer-bg': 'rgba(255, 255, 255, 0.16)',
  'timer-text': '#e4e4e7',
  'timer-solved': '#34d399',
}

const { dark } = useColorMode()

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
    if (!OUTLET || !SERIES || !BASE_URL)
      throw new Error(
        'VITE_COGNIPLAY_OUTLET, VITE_COGNIPLAY_SERIES and VITE_COGNIPLAY_EMBED_BASE_URL must be set',
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
    <h1>CogniPuzzle - npm package</h1>
    <p>
      The <code>&lt;cogniplay-puzzle&gt;</code> element comes from
      <code>@cogniplay/puzzle</code>, registered once at startup. Usage is fully
      typed. The mode toggle swaps the object bound to the element's
      <code>theme</code> property.
    </p>
    <PuzzleStage>
      <cogniplay-puzzle
        ref="puzzleEl"
        :puzzle="puzzle"
        :theme="dark ? darkTheme : lightTheme"
        show-timer
      >
        <div slot="fallback" class="fallback">
          The puzzle could not be loaded. Please try again later.
        </div>
      </cogniplay-puzzle>
    </PuzzleStage>
    <p class="actions">
      <button class="button" :disabled="loading" @click="loadToday">
        Reload today's puzzle
      </button>
      <button class="button" @click="reset">Reset</button>
      <ModeToggle />
    </p>
    <p v-if="loading" class="loading">Loading today's puzzle…</p>
    <p v-else-if="fetchError" class="fetch-error">
      Could not load today's puzzle ({{ fetchError }}).
    </p>
    <EventLog :entries="events" />
  </main>
</template>
