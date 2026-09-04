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
  'piece-1-color': 'var(--demo-accent-1)',
  'piece-2-color': 'var(--demo-accent-1)',
  'piece-3-color': 'var(--demo-accent-2)',
  'piece-4-color': 'var(--demo-accent-2)',
  'piece-5-color': 'var(--demo-accent-3)',
  'piece-6-color': 'var(--demo-accent-3)',
  'piece-7-color': 'var(--demo-accent-3)',
  'piece-8-color': 'var(--demo-accent-2)',
  'piece-9-color': 'var(--demo-accent-2)',
  'piece-10-color': 'var(--demo-accent-2)',

  // Pieces
  'piece-outline': 'cell',
  'piece-rim': 'cell',
  'piece-sheen': '0',
  'piece-shadow': '0',
  'preview-valid': 'color-mix(in srgb, var(--demo-accent-1), transparent 70%)',
  'preview-invalid': 'rgba(204, 0, 0, 0.3)',

  // Board and shared geometry
  'board-cell-color': 'var(--demo-board)',
  'board-outline': 'cell',
  'board-outline-color': 'var(--demo-board-outline)',
  gap: '0',
  'corner-radius': '0.12',
  'outline-width': '1.5',
  'rim-width': '0.3',
  'rim-shadow-style': 'edge',
  'rim-shadow': '0.3',
  'rim-shadow-softness': '0.1',

  // Blockers
  'blocker-color': 'var(--demo-blocker)',
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
      typed. The theme's colours reference the page's CSS tokens.
    </p>
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
