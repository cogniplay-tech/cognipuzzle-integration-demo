<script setup lang="ts">
import { useTemplateRef } from 'vue'
import InstructionsPanel from './InstructionsPanel.vue'
import { useTakeover } from './useTakeover'

// The element claims every touch inside its box, so on narrow screens a tap
// layer covers it and expands the stage to full screen.
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
      <!-- Kept in the DOM while collapsed so the help button can teleport in. -->
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
/* The element needs a definite height; min-height alone collapses it. */
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
/* In the header the help button flows in the row instead of pinning to the
   corner. */
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
