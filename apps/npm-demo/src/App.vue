<script setup lang="ts">
import { ref } from 'vue'
import {
  wirePuzzleToDomain,
  type Puzzle,
  type WirePuzzle,
} from '@cogniplay/puzzle'

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

function feedBroken() {
  puzzle.value = {
    type: 'quatro-mino',
    board: 'not-a-board',
  } as unknown as Puzzle
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
    <h1>Cognipuzzle — npm package</h1>
    <p>
      The <code>&lt;cogniplay-puzzle&gt;</code> element comes from
      <code>@cogniplay/puzzle</code>, registered once at startup. Usage is fully
      typed.
    </p>
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
    <p>
      <button @click="feedSample">Sample puzzle (local data)</button>
      <button @click="loadToday">Today's puzzle (live API)</button>
      <button @click="feedBroken">Feed broken puzzle</button>
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
cogniplay-puzzle {
  display: block;
  min-height: 360px;
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
