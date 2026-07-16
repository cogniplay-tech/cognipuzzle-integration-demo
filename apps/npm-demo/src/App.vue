<script setup lang="ts">
import { ref } from 'vue'
import {
  wirePuzzleToDomain,
  type Puzzle,
  type WirePuzzle,
} from '@cogniplay/puzzle'
import InstructionsPanel from './InstructionsPanel.vue'

declare global {
  interface Window {
    cogniplaySample: { puzzle: Puzzle }
  }
}

const CONTENT_API = 'https://cognipuzzle-embed.com/embed/telex/daily/current'

const puzzle = ref<Puzzle | null>(window.cogniplaySample.puzzle)
const events = ref<string[]>([])
const fetchError = ref<string | null>(null)

function log(type: string, e: Event) {
  events.value.push(`${type} ${JSON.stringify((e as CustomEvent).detail)}`)
}

function feedSample() {
  fetchError.value = null
  puzzle.value = window.cogniplaySample.puzzle
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
      <cogniplay-puzzle
        :puzzle="puzzle"
        @change="log('change', $event)"
        @solve="log('solve', $event)"
        @error="log('error', $event)"
      >
        <div slot="fallback" class="fallback">
          The puzzle could not be loaded. Please try again later.
        </div>
      </cogniplay-puzzle>
      <InstructionsPanel />
    </div>
    <p>
      <button @click="feedSample">Sample puzzle (local data)</button>
      <button @click="loadToday">Today's puzzle (live API)</button>
    </p>
    <p v-if="fetchError" class="fetch-error">
      Could not load today's puzzle ({{ fetchError }}) — the local sample
      remains the reliable path.
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
.fetch-error {
  color: #a33;
}
ul {
  font-family: monospace;
}
</style>
