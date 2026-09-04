<script setup lang="ts">
defineProps<{ entries: string[] }>()
</script>

<template>
  <section>
    <h2>Event log</h2>
    <ul>
      <li v-for="(entry, i) in entries" :key="i">{{ entry }}</li>
    </ul>
  </section>
</template>

<style scoped>
ul {
  font-family: monospace;
}
</style>
