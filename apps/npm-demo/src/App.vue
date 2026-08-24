<script setup lang="ts">
import { ref, onMounted, useTemplateRef } from 'vue'
import {
  wirePuzzleToDomain,
  PUZZLE_EVENT_NAMES,
  type Puzzle,
  type WirePuzzle,
  type CogniplayPuzzleElement,
  type ThemePatch,
} from '@cogniplay/puzzle'
import InstructionsPanel from './InstructionsPanel.vue'
import { useTakeover } from './useTakeover'

const OUTLET: string | undefined = import.meta.env.VITE_COGNIPLAY_OUTLET
const SERIES: string | undefined = import.meta.env.VITE_COGNIPLAY_SERIES
const CONTENT_API = `https://cognipuzzle-embed.com/embed/${OUTLET}/${SERIES}/current`

// Outlet look. Every knob lives here, including timer-* and
// tutorial-*, and reaches the element through its `theme` property.
const theme: ThemePatch = {
  // Piece palette (slots 1-10 = author order a-j)
  'piece-1-color': '#009966',
  'piece-2-color': '#009966',
  'piece-3-color': '#113355',
  'piece-4-color': '#113355',
  'piece-5-color': '#7b52c2',
  'piece-6-color': '#7b52c2',
  'piece-7-color': '#7b52c2',
  'piece-8-color': '#113355',
  'piece-9-color': '#113355',
  'piece-10-color': '#113355',

  // Pieces
  'piece-outline': 'cell',
  'piece-rim': 'cell',
  'piece-sheen': '0',
  'piece-shadow': '0',
  'preview-valid': 'rgba(0, 153, 102, 0.3)',
  'preview-invalid': 'rgba(204, 0, 0, 0.3)',

  // Board and shared geometry
  'board-cell-color': '#808080',
  'board-outline': 'cell',
  'board-outline-color': '#515151',
  gap: '0',
  'corner-radius': '0.12',
  'outline-width': '1.5',
  'rim-width': '0.3',
  'rim-shadow-style': 'edge',
  'rim-shadow': '0.3',
  'rim-shadow-softness': '0.1',

  // Blockers
  'blocker-color': '#ffffff',
  'blocker-logo-mode': 'one',

  // Panel
  'panel-color': '#ffffff',
  'panel-rim': '12',
  'panel-radius': '24',
  'panel-shadow': '0.28',

  // Tutorial overlay
  'tutorial-accent': '#009966',
  'tutorial-on-accent': '#1a1a1f',
  'tutorial-bg': '#32323a',
  'tutorial-text': '#f5f5f7',
  'tutorial-text-secondary': '#a1a1aa',
  'tutorial-surface': '#26262d',
  'tutorial-scrim': '#1a1a1f',
  'tutorial-radius': '1rem',

  // Timer overlay
  'timer-bg': 'rgba(0, 0, 0, 0.16)',
  'timer-text': '#424242',
  'timer-solved': '#009966',
}

const puzzleEl = useTemplateRef<CogniplayPuzzleElement>('puzzleEl')
const puzzle = ref<Puzzle | null>(null)
const events = ref<string[]>([])
const loading = ref(false)
const fetchError = ref<string | null>(null)

// On narrow screens the element claims every touch gesture inside its box,
// so a finger landing on it cannot scroll the page. A tap layer covers the
// stage there; tapping grows the stage to full screen.
const stage = useTemplateRef<HTMLElement>('stage')
const tapLayer = useTemplateRef<HTMLElement>('tapLayer')
const closeButton = useTemplateRef<HTMLElement>('closeButton')
// Keep in step with the tap layer's media query below.
const DESKTOP_QUERY = '(min-width: 768px)'
const { expanded, expand, collapse } = useTakeover(
  stage,
  tapLayer,
  closeButton,
  DESKTOP_QUERY,
)

function log(type: string, detail: unknown) {
  events.value.push(`${type} ${JSON.stringify(detail)}`)
}

onMounted(() => {
  const el = puzzleEl.value!
  for (const type of PUZZLE_EVENT_NAMES) {
    el.addEventListener(type, (e) => log(type, e.detail))
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
    if (!OUTLET || !SERIES)
      throw new Error(
        'VITE_COGNIPLAY_OUTLET and VITE_COGNIPLAY_SERIES must be set',
      )
    const res = await fetch(CONTENT_API)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const body = (await res.json()) as { puzzle: WirePuzzle }
    puzzle.value = wirePuzzleToDomain(body.puzzle)
  } catch (err) {
    fetchError.value = err instanceof Error ? err.message : String(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h1>CogniPuzzle - npm package</h1>
    <p>
      The <code>&lt;cogniplay-puzzle&gt;</code> element comes from
      <code>@cogniplay/puzzle</code>, registered once at startup. Usage is fully
      typed.
    </p>
    <div class="stage-slot">
      <div ref="stage" class="stage" :class="{ expanded }">
        <!-- Rendered while collapsed too (hidden), so the help button
             below can teleport in as the takeover opens. -->
        <div v-show="expanded" class="takeover-header">
          <span class="takeover-title">Today's puzzle</span>
          <div class="takeover-actions">
            <span id="takeover-help"></span>
            <button
              ref="closeButton"
              class="button"
              type="button"
              @click="collapse()"
            >
              Close
            </button>
          </div>
        </div>
        <cogniplay-puzzle
          ref="puzzleEl"
          :puzzle="puzzle"
          :theme="theme"
          show-timer
        >
          <div slot="fallback" class="fallback">
            The puzzle could not be loaded. Please try again later.
          </div>
        </cogniplay-puzzle>
        <button
          v-show="!expanded"
          ref="tapLayer"
          class="tap-layer"
          type="button"
          @click="expand"
        >
          <span>Tap to play</span>
        </button>
        <Teleport to="#takeover-help" :disabled="!expanded" defer>
          <InstructionsPanel />
        </Teleport>
      </div>
    </div>
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
/* Full screen: the header takes a row and the board fills the rest. */
.stage.expanded {
  flex-direction: column;
  border: 0;
  background: #fff;
}
.stage.expanded cogniplay-puzzle {
  flex: 1 1 0;
  min-height: 0;
  height: auto;
}
.takeover-header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.5rem 0.5rem 0.5rem 1rem;
  border-bottom: 1px solid #e4e4e7;
}
.takeover-title {
  font-weight: 600;
  color: #27272a;
}
.takeover-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
/* Inside the header the help button sits in the row, not pinned to the
   stage corner. */
.takeover-actions :deep(.help-button) {
  position: static;
}
.button {
  height: 2rem;
  padding: 0 0.75rem;
  border: 1px solid #e4e4e7;
  border-radius: 0.75rem;
  background: #fff;
  color: #27272a;
  font:
    500 0.875rem system-ui,
    sans-serif;
  cursor: pointer;
  transition: background-color 120ms;
}
.button:hover {
  background: #f4f4f5;
}
.button:disabled {
  opacity: 0.5;
  cursor: default;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.tap-layer {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}
.tap-layer span {
  display: block;
  width: 100%;
  padding: 2.5rem 0 0.75rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
  color: #fff;
  font:
    600 0.875rem system-ui,
    sans-serif;
  text-align: center;
}
/* Same breakpoint as DESKTOP_QUERY in the script. */
@media (min-width: 768px) {
  .tap-layer {
    display: none;
  }
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
