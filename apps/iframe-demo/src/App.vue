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
    <h1>Cognipuzzle — iframe embed</h1>
    <p>
      The puzzle below is a plain <code>&lt;iframe&gt;</code> pointing at the
      hosted embed page. The host page owns the box size (there is no
      auto-resize protocol); gameplay events arrive as
      <code>postMessage</code> envelopes.
    </p>
    <iframe
      src="https://staging.cognipuzzle-embed.com/play.html?embed=telex"
      title="Cognipuzzle daily puzzle"
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
  max-width: 960px;
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
