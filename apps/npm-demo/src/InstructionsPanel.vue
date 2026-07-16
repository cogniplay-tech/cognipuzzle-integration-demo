<script setup lang="ts">
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
</script>

<template>
  <aside class="howto">
    <h2>How to play</h2>
    <p class="goal">{{ GOAL }}</p>
    <h3>How to play</h3>
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
</template>

<style scoped>
.howto {
  flex: 0 0 300px;
  box-sizing: border-box;
  overflow-y: auto;
  padding: 1.25rem;
  border-left: 1px solid #e4e4e7;
  font:
    14px/1.5 system-ui,
    sans-serif;
  color: #27272a;
  background: #fff;
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
  color: #71717a;
}
p {
  margin: 0;
  color: #52525b;
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
  color: #71717a;
}
</style>
