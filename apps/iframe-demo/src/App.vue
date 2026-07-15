<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface CogniplayEnvelope {
  source: 'cogniplay'
  v: 1
  type: 'ready' | 'started' | 'progress' | 'solved' | 'error'
  payload: Record<string, unknown>
}

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
    <h1>CogniPuzzle — iframe embed</h1>
    <iframe
      src="https://cognipuzzle-embed.com/play.html?embed=telex"
      title="CogniPuzzle daily puzzle"
    ></iframe>
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
ul {
  font-family: monospace;
}
</style>
