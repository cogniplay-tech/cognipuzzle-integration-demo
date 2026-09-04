<script setup lang="ts">
import { useColorMode } from './useColorMode'

const { dark, toggle } = useColorMode()
</script>

<template>
  <button class="button" type="button" @click="toggle">
    {{ dark ? 'Light mode' : 'Dark mode' }}
  </button>
</template>
