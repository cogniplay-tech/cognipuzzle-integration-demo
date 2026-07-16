<script setup lang="ts">
import { ref } from 'vue'
import InstructionsPanel from './InstructionsPanel.vue'

declare global {
  interface Window {
    cogniplaySample: { puzzle: object }
  }
}

const puzzle = ref<object>(window.cogniplaySample.puzzle)
const events = ref<string[]>([])

function log(type: string, e: Event) {
  events.value.push(`${type} ${JSON.stringify((e as CustomEvent).detail)}`)
}

function feedSample() {
  puzzle.value = window.cogniplaySample.puzzle
}
</script>

<template>
  <main>
    <h1>Cognipuzzle — JS bundle</h1>
    <p>
      The <code>&lt;cogniplay-puzzle&gt;</code> element is registered by the CDN
      bundle loaded in <code>index.html</code>. The host page supplies the
      puzzle data as a property and listens to DOM events.
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
      <button @click="feedSample">Restore sample puzzle</button>
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
ul {
  font-family: monospace;
}
</style>
