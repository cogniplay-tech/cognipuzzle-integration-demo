<script setup lang="ts">
import { useTemplateRef } from 'vue'
import InstructionsPanel from './InstructionsPanel.vue'
import { useTakeover } from './useTakeover'

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
</script>

<template>
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
      <slot></slot>
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
</template>

<style scoped>
/* The element measures its own box to lay out, so it needs a definite height.
   A min-height alone collapses the board. */
.stage {
  position: relative;
  display: flex;
  height: 360px;
  border: 1px solid var(--demo-border);
}
:slotted(cogniplay-puzzle) {
  display: block;
  flex: 1 1 auto;
  min-width: 0;
  height: 100%;
}
/* Full screen: the header takes a row and the board fills the rest. */
.stage.expanded {
  flex-direction: column;
  border: 0;
  background: var(--demo-bg);
}
.stage.expanded :slotted(cogniplay-puzzle) {
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
  border-bottom: 1px solid var(--demo-border);
}
.takeover-title {
  font-weight: 600;
  color: var(--demo-fg);
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
</style>
