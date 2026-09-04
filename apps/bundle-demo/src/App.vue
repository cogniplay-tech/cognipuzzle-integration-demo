<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { PuzzleStage, EventLog } from 'demo-shared'

// Registered by the CDN bundle loaded in index.html.
declare global {
  const CogniplayPuzzle: {
    wirePuzzleToDomain: (wire: unknown) => object
  }
}

const OUTLET: string | undefined = import.meta.env.VITE_COGNIPLAY_OUTLET
const SERIES: string | undefined = import.meta.env.VITE_COGNIPLAY_SERIES
const BASE_URL: string | undefined = import.meta.env
  .VITE_COGNIPLAY_EMBED_BASE_URL
const CONTENT_API = `${BASE_URL}/embed/${OUTLET}/${SERIES}/current`

type PuzzleElement = HTMLElement & { reset: () => void }

const PUZZLE_EVENTS = [
  'ready',
  'started',
  'piece-picked-up',
  'piece-placed',
  'piece-returned',
  'piece-rotated',
  'solved',
  'error',
] as const

const puzzleEl = ref<PuzzleElement | null>(null)
const puzzle = ref<object | null>(null)
const events = ref<string[]>([])
const loading = ref(false)
const fetchError = ref<string | null>(null)

function log(type: string, e: Event) {
  events.value.push(`${type} ${JSON.stringify((e as CustomEvent).detail)}`)
}

// Attach listeners before assigning `.puzzle`, so the load's `ready` is caught.
onMounted(() => {
  const el = puzzleEl.value!
  for (const type of PUZZLE_EVENTS) {
    el.addEventListener(type, (e) => log(type, e))
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
    const body = (await res.json()) as { puzzle: unknown }
    puzzle.value = CogniplayPuzzle.wirePuzzleToDomain(body.puzzle)
  } catch (err) {
    fetchError.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h1>CogniPuzzle - JS bundle</h1>
    <p>
      The <code>&lt;cogniplay-puzzle&gt;</code> element is registered by the CDN
      bundle loaded in <code>index.html</code>. The host page fetches the daily
      puzzle, translates it with the bundle's
      <code>CogniplayPuzzle.wirePuzzleToDomain</code>, supplies it as a property
      and listens to DOM events.
    </p>
    <PuzzleStage>
      <cogniplay-puzzle ref="puzzleEl" :puzzle="puzzle" show-timer>
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
    </p>
    <p v-if="loading" class="loading">Loading today's puzzle…</p>
    <p v-else-if="fetchError" class="fetch-error">
      Could not load today's puzzle ({{ fetchError }}).
    </p>
    <EventLog :entries="events" />
  </main>
</template>
