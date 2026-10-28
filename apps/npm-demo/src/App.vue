<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'
import {
  PUZZLE_EVENT_NAMES,
  type CogniplayPuzzleElement,
  type EmittedState,
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
  'piece-border': 'cell',
  'piece-border-strength': '0',
  'piece-highlight': '0.3',
  'piece-sheen': '0',
  'piece-shadow': '0',
  'preview-valid': 'color-mix(in srgb, var(--demo-accent-1), transparent 70%)',
  'preview-invalid': 'rgba(204, 0, 0, 0.3)',

  // Board and shared geometry
  'board-cell-color': 'var(--demo-board)',
  'board-cell-border': 'cell',
  'board-cell-border-color': '#000000',
  'board-cell-border-strength': '0.125',
  'board-outline': 'cell',
  'board-outline-color': 'var(--demo-board-outline)',
  gap: '0',
  'corner-radius': '0.12',
  'outline-width': '1.5',
  'border-width': '0.3',
  'face-shadow-style': 'edge',
  'face-shadow': '0.3',
  'face-shadow-softness': '0.1',

  // Blockers: the mode token is the face, the frame is a paler tint of it
  'blocker-color': 'var(--demo-blocker)',
  'blocker-border-color': '#ffffff',
  'blocker-border-strength': '0.4',
  'blocker-outline-color': 'var(--demo-board-outline)',
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
const content = ref<unknown>(null)
const events = ref<string[]>([])
const loading = ref(false)
const fetchError = ref<string | null>(null)

function log(type: string, detail: unknown) {
  const { state: _state, ...rest } = (detail ?? {}) as Record<string, unknown>
  events.value.push(`${type} ${JSON.stringify(rest)}`)
}

// A solve, kept in the browser so a later visit shows its final board.
interface SolvedPlay {
  state: EmittedState
  elapsedMs: number
}
const SOLVED_KEY = 'cogniplay-demo-solved'

// A solve saved for another puzzle, such as yesterday's, doesn't count.
function loadSolved(puzzleId: string | undefined): SolvedPlay | null {
  try {
    const play = JSON.parse(
      localStorage.getItem(SOLVED_KEY) ?? 'null',
    ) as SolvedPlay | null
    return play?.state.puzzleId === puzzleId ? play : null
  } catch {
    return null
  }
}

function saveSolved(play: SolvedPlay) {
  try {
    localStorage.setItem(SOLVED_KEY, JSON.stringify(play))
  } catch {
    // No storage (a private window, say): the solve is not kept.
  }
}

// Every load waits behind the Start button for a fresh play, unless this
// puzzle was solved here before.
const phase = ref<'loading' | 'waiting' | 'live' | 'solved' | 'failed'>(
  'loading',
)
// A tap to play that lands before the puzzle is ready begins it once it is.
let beginWhenReady = false

function begin() {
  if (phase.value === 'loading') {
    beginWhenReady = true
    return
  }
  if (phase.value === 'waiting') puzzleEl.value!.start()
}

onMounted(() => {
  const el = puzzleEl.value!
  for (const type of PUZZLE_EVENT_NAMES) {
    el.addEventListener(type, (e) => log(type, e.detail))
  }
  el.addEventListener('ready', (e) => {
    const tapped = beginWhenReady
    beginWhenReady = false
    const solved = loadSolved(e.detail.state.puzzleId)
    if (solved) {
      // The final board, with the clock frozen at the solving time.
      el.resume(solved.state, { elapsedMs: solved.elapsedMs })
      return
    }
    phase.value = 'waiting'
    if (tapped) begin()
  })
  el.addEventListener('started', () => (phase.value = 'live'))
  el.addEventListener(
    'resumed',
    (e) => (phase.value = e.detail.solved ? 'solved' : 'live'),
  )
  el.addEventListener('solved', (e) => {
    phase.value = 'solved'
    saveSolved({ state: e.detail.state, elapsedMs: e.detail.elapsedMs })
  })
  // Content the element cannot read never reaches ready.
  el.addEventListener('error', () => (phase.value = 'failed'))
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
    content.value = await res.json()
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
    <PuzzleStage @play="begin">
      <cogniplay-puzzle
        ref="puzzleEl"
        :content="content"
        :theme="theme"
        show-timer
      >
        <div slot="fallback" class="fallback">
          The puzzle could not be loaded. Please try again later.
        </div>
      </cogniplay-puzzle>
      <div
        v-if="phase === 'waiting' || (phase === 'loading' && !fetchError)"
        class="start-overlay"
        :class="phase"
      >
        <button
          class="button"
          type="button"
          :disabled="phase === 'loading'"
          @click="begin"
        >
          {{ phase === 'loading' ? 'Loading…' : 'Start' }}
        </button>
      </div>
    </PuzzleStage>
    <p class="actions">
      <button class="button" :disabled="loading" @click="loadToday">
        Reload today's puzzle
      </button>
      <button class="button" :disabled="phase !== 'live'" @click="reset">
        Reset
      </button>
      <ModeToggle />
    </p>
    <p v-if="loading" class="loading">Loading today's puzzle…</p>
    <p v-else-if="fetchError" class="fetch-error">
      Could not load today's puzzle ({{ fetchError }}).
    </p>
    <EventLog :entries="events" />
  </main>
</template>

<style scoped>
/* Over the board until the play begins. Below the stage's desktop breakpoint
   the tap layer begins the play, so only Loading shows there. */
.start-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--demo-bg), transparent 40%);
}
/* No board to dim yet, and the phone takeover's Close stays tappable. */
.start-overlay.loading {
  background: none;
  pointer-events: none;
}
.start-overlay .button {
  height: 2.75rem;
  padding: 0 1.5rem;
  font-size: 1rem;
}
@media (max-width: 767px) {
  .start-overlay.waiting {
    display: none;
  }
}
</style>
