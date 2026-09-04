import { ref } from 'vue'

const dark = ref(false)

export function useColorMode() {
  function toggle() {
    dark.value = !dark.value
    document.documentElement.classList.toggle('dark', dark.value)
  }
  return { dark, toggle }
}
