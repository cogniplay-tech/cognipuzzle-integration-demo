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
import { PuzzleStage, EventLog, ModeToggle } from 'demo-shared'

const OUTLET: string | undefined = import.meta.env.VITE_COGNIPLAY_OUTLET
const SERIES: string | undefined = import.meta.env.VITE_COGNIPLAY_SERIES
const BASE_URL: string | undefined = import.meta.env
  .VITE_COGNIPLAY_EMBED_BASE_URL
const CONTENT_API = `${BASE_URL}/embed/${OUTLET}/${SERIES}/current`

const theme: ThemePatch = {
  // Piece palette (slots 1-10 = author order a-j)
  'piece-1-color': '#f9c900',
  'piece-2-color': '#2b4ea1',
  'piece-3-color': '#6abd45',
  'piece-4-color': '#e795bf',
  'piece-5-color': '#8d8dff',
  'piece-6-color': '#2b4ea1',
  'piece-7-color': '#6abd45',
  'piece-8-color': '#e795bf',
  'piece-9-color': '#007251',
  'piece-10-color': '#007251',

  // Pieces
  'piece-border': 'cell',
  'piece-border-color': '#ffffff',
  'piece-border-strength': '0.3',
  'piece-highlight': '0',
  'piece-outline': 'cell',
  'piece-outline-color': 'rgb(0 0 0 / 0.16)',
  'piece-sheen': '0',
  'piece-shadow': '0',

  // Board and shared geometry
  'board-cell-color': '#3e5059',
  'board-cell-border': 'cell',
  'board-cell-border-color': 'transparent',
  'board-cell-border-strength': '1',
  'board-outline': 'cell',
  'board-outline-color': 'color-mix(in srgb, var(--demo-fg), transparent 78%)',
  gap: '0',
  'corner-radius': '0.0593',
  'border-width': '0.2076',
  'outline-width': '0.5',
  'face-shadow': '0',
  'tray-scale': '0.7',
  'board-shrink': '0.1',

  // Blockers
  'blocker-color': '#6f858e',
  'blocker-border-color': '#c4c8cc',
  'blocker-border-strength': '1',
  'blocker-outline-color': 'rgb(0 0 0 / 0.16)',
  'blocker-logo-mode': 'one',

  // Tutorial overlay
  'tutorial-accent': 'var(--demo-accent-1)',
  'tutorial-on-accent': '#1a1a1f',
  'tutorial-bg': '#32323a',
  'tutorial-text': '#f5f5f7',
  'tutorial-text-secondary': '#a1a1aa',
  'tutorial-surface': '#26262d',
  'tutorial-scrim': '#1a1a1f',
  'tutorial-radius': '1rem',

  // Timer overlay
  'timer-bg': 'color-mix(in srgb, var(--demo-fg), transparent 84%)',
  'timer-text': 'var(--demo-fg)',
  'timer-solved': 'var(--demo-accent-1)',
}

const puzzleEl = useTemplateRef<CogniplayPuzzleElement>('puzzleEl')
const puzzle = ref<Puzzle | null>(null)
const events = ref<string[]>([])
const loading = ref(false)
const fetchError = ref<string | null>(null)

function log(type: string, detail: unknown) {
  const { state: _state, ...rest } = (detail ?? {}) as Record<string, unknown>
  events.value.push(`${type} ${JSON.stringify(rest)}`)
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
    <PuzzleStage>
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
