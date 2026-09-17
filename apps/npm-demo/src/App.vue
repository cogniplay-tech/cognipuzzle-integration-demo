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

const PALETTE: ThemePatch = {
  'piece-1-color': 'var(--demo-piece-4)',
  'piece-2-color': 'var(--demo-piece-1)',
  'piece-3-color': 'var(--demo-piece-2)',
  'piece-4-color': 'var(--demo-piece-7)',
  'piece-5-color': 'var(--demo-piece-6)',
  'piece-6-color': 'var(--demo-piece-1)',
  'piece-7-color': 'var(--demo-piece-5)',
  'piece-8-color': 'var(--demo-piece-2)',
  'piece-9-color': 'var(--demo-piece-3)',
  'piece-10-color': 'var(--demo-piece-3)',
}

const theme: ThemePatch = {
  ...PALETTE,

  'piece-fill': 'cell',
  gap: '0.125',
  'corner-radius': '0.125',
  'piece-inner-shadow': '0.1',
  'piece-inner-shadow-width': '0.3125',

  'piece-outline': 'none',
  'piece-rim': 'none',
  'piece-sheen': '0',
  'piece-shadow': '0',
  'board-outline': 'none',
  'board-cell-rim-color': 'none',
  'board-cell-color': 'var(--demo-board)',
  'blocker-color': 'var(--demo-blocker)',

  'preview-valid': 'transparent',
  'preview-invalid': 'transparent',
  // Swap the two lines above for these to keep the drop-target tint as well:
  // 'preview-valid': 'rgba(136, 199, 97, 0.30)',
  // 'preview-invalid': 'rgba(236, 98, 92, 0.30)',
  'drag-invalid-darken': '0.3',

  'tutorial-accent': 'var(--demo-piece-1)',
  'tutorial-on-accent': '#1a1a1f',
  'tutorial-bg': '#32323a',
  'tutorial-text': '#f5f5f7',
  'tutorial-text-secondary': '#a1a1aa',
  'tutorial-surface': '#26262d',
  'tutorial-scrim': '#1a1a1f',
  'tutorial-radius': '1rem',

  'timer-bg': 'color-mix(in srgb, var(--demo-fg), transparent 84%)',
  'timer-text': 'var(--demo-fg)',
  'timer-solved': 'var(--demo-piece-4)',
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
