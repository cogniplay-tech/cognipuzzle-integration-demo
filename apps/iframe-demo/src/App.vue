<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface CogniplayEnvelope {
  source: 'cogniplay'
  v: 1
  embed: string
  type:
    | 'ready'
    | 'started'
    | 'piece-picked-up'
    | 'piece-placed'
    | 'piece-returned'
    | 'piece-rotated'
    | 'solved'
    | 'error'
    | 'tutorial-complete'
    | 'tutorial-exit'
    | 'load-error'
  payload: Record<string, unknown>
}

const OUTLET: string | undefined = import.meta.env.VITE_COGNIPLAY_OUTLET
const SERIES: string | undefined = import.meta.env.VITE_COGNIPLAY_SERIES
// The player's query param for the series is named `challenge`.
const EMBED_URL =
  OUTLET && SERIES
    ? `https://cognipuzzle-embed.com/play.html?embed=${OUTLET}&challenge=${SERIES}`
    : null

const events = ref<string[]>([])

function onMessage(e: MessageEvent) {
  const data = e.data as Partial<CogniplayEnvelope> | undefined
  if (data?.source !== 'cogniplay') return
  events.value.push(`${data.type} ${JSON.stringify(data.payload)}`)
}

onMounted(() => window.addEventListener('message', onMessage))
onUnmounted(() => window.removeEventListener('message', onMessage))
</script>

<template>
  <main>
    <h1>CogniPuzzle - iframe embed</h1>
    <iframe
      v-if="EMBED_URL"
      :src="EMBED_URL"
      title="CogniPuzzle daily puzzle"
    ></iframe>
    <p v-else class="config-error">
      Set <code>VITE_COGNIPLAY_OUTLET</code> and
      <code>VITE_COGNIPLAY_SERIES</code> in <code>.env.local</code>.
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
iframe {
  width: 100%;
  height: 360px;
  border: 0;
}
.config-error {
  color: #a33;
}
ul {
  font-family: monospace;
}
</style>
