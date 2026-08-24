<script setup lang="ts">
import { ref, onMounted } from 'vue'
import InstructionsPanel from './InstructionsPanel.vue'

// Registered by the CDN bundle loaded in index.html.
declare global {
  const CogniplayPuzzle: {
    wirePuzzleToDomain: (wire: unknown) => object
  }
}

const CONTENT_API = 'https://cognipuzzle-embed.com/embed/telex/daily/current'

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
    <h1>CogniPuzzle — JS bundle</h1>
    <p>
      The <code>&lt;cogniplay-puzzle&gt;</code> element is registered by the CDN
      bundle loaded in <code>index.html</code>. The host page fetches the daily
      puzzle, translates it with the bundle's
      <code>CogniplayPuzzle.wirePuzzleToDomain</code>, supplies it as a property
      and listens to DOM events.
    </p>
    <div class="stage">
      <cogniplay-puzzle ref="puzzleEl" :puzzle="puzzle">
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
