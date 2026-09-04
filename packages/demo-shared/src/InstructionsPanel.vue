<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const GOAL =
  'Fill every open cell on the board with your pieces — no gaps, no overlaps.'
const WIN = 'Every piece is placed and every open cell is covered.'

const CONTROLS: { label: string; paths: string[] }[] = [
  {
    label: 'Drag a piece from the tray onto the board',
    paths: [
      'M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2',
      'M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2',
      'M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8',
      'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15',
    ],
  },
  {
    label: 'Twist with a second finger to rotate (or the Q / E keys)',
    paths: ['M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8', 'M21 3v5h-5'],
  },
  {
    label: 'Double-tap with a second finger to flip (or Space)',
    paths: [
      'm3 7 5 5-5 5V7',
      'm21 7-5 5 5 5V7',
      'M12 20v2',
      'M12 14v2',
      'M12 8v2',
      'M12 2v2',
    ],
  },
  {
    label: 'Drag a placed piece off the board to send it back to the tray',
    paths: [
      'M9 14 4 9l5-5',
      'M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11',
    ],
  },
]

const HELP_ICON = ['M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3', 'M12 17h.01']

// Below this width the pinned panel is replaced by a help button + modal,
// matching the hosted embed. The embed scopes this to its own viewport (the
// iframe is the puzzle box); here both button and modal anchor to .stage.
const DESKTOP_MIN_WIDTH = 1200

const isDesktop = ref(true)
const open = ref(false)
let mql: MediaQueryList | null = null

function onBreakpoint() {
  isDesktop.value = mql!.matches
  if (isDesktop.value) open.value = false
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}

onMounted(() => {
  mql = window.matchMedia(`(min-width: ${DESKTOP_MIN_WIDTH}px)`)
  isDesktop.value = mql.matches
  mql.addEventListener('change', onBreakpoint)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  mql?.removeEventListener('change', onBreakpoint)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <aside v-if="isDesktop" class="howto">
    <h2>How to play</h2>
    <p class="goal">{{ GOAL }}</p>
    <h3>Controls</h3>
    <ul class="controls">
      <li v-for="control in CONTROLS" :key="control.label">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path v-for="d in control.paths" :key="d" :d="d" />
        </svg>
        <span>{{ control.label }}</span>
      </li>
    </ul>
    <h3>Win</h3>
    <p class="win">{{ WIN }}</p>
  </aside>

  <button
    v-else
    class="help-button"
    type="button"
    aria-label="How to play"
    aria-haspopup="dialog"
    :aria-expanded="open"
    @click="open = true"
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path v-for="d in HELP_ICON" :key="d" :d="d" />
    </svg>
  </button>

  <div v-if="!isDesktop && open" class="modal" @click.self="open = false">
    <div class="card" role="dialog" aria-modal="true" aria-label="How to play">
      <div class="card-header">
        <h2>How to play</h2>
        <button
          class="close"
          type="button"
          aria-label="Close"
          @click="open = false"
        >
          ✕
        </button>
      </div>
      <p class="goal">{{ GOAL }}</p>
      <h3>Controls</h3>
      <ul class="controls">
        <li v-for="control in CONTROLS" :key="control.label">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path v-for="d in control.paths" :key="d" :d="d" />
          </svg>
          <span>{{ control.label }}</span>
        </li>
      </ul>
      <h3>Win</h3>
      <p class="win">{{ WIN }}</p>
    </div>
  </div>
</template>

<style scoped>
.howto {
  flex: 0 0 300px;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 1.25rem;
  border-left: 1px solid var(--demo-border);
  font:
    14px/1.5 system-ui,
    sans-serif;
  color: var(--demo-fg);
}
h2 {
  margin: 0 0 0.75rem;
  font-size: 1rem;
}
h3 {
  margin: 1.25rem 0 0.5rem;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--demo-muted);
}
p {
  margin: 0;
  color: var(--demo-fg-secondary);
}
.controls {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.625rem;
}
.controls li {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}
.controls svg {
  width: 1.25rem;
  height: 1.25rem;
  flex: none;
  margin-top: 0.125rem;
  color: var(--demo-muted);
}
.help-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: grid;
  place-items: center;
  width: 2rem;
  height: 2rem;
  padding: 0;
  border: 1px solid var(--demo-border);
  border-radius: 50%;
  background: var(--demo-surface);
  color: var(--demo-fg-secondary);
  cursor: pointer;
}
.help-button svg {
  width: 1.125rem;
  height: 1.125rem;
}
.modal {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: grid;
  place-items: center;
  padding: 1rem;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.45);
}
.card {
  width: 100%;
  max-width: 26rem;
  max-height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  padding: 1.25rem;
  border-radius: 0.75rem;
  font:
    14px/1.5 system-ui,
    sans-serif;
  color: var(--demo-fg);
  background: var(--demo-surface);
}
.card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
}
.card-header h2 {
  margin: 0 0 0.75rem;
}
.close {
  border: none;
  background: none;
  padding: 0.25rem;
  font-size: 1rem;
  color: var(--demo-muted);
  cursor: pointer;
}
</style>
