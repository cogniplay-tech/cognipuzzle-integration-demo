import { nextTick, onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

// Grows `frame` from its own rect to the full viewport and back. The frame
// stays where it is in the DOM, so the puzzle inside keeps its state across
// both directions. `opener` and `closer` receive focus after each move. Once
// the viewport matches `desktopQuery`, an open takeover collapses at once.
export function useTakeover(
  frame: Ref<HTMLElement | null>,
  opener: Ref<HTMLElement | null>,
  closer: Ref<HTMLElement | null>,
  desktopQuery: string,
) {
  const DURATION = 250
  const TRANSITION = ['top', 'left', 'width', 'height']
    .map((p) => `${p} ${DURATION}ms ease-out`)
    .join(', ')
  const reducedMotion = () =>
    matchMedia('(prefers-reduced-motion: reduce)').matches

  const expanded = ref(false)
  let settling = false

  async function expand() {
    const el = frame.value
    if (!el || expanded.value || settling) return
    expanded.value = true
    const rect = el.getBoundingClientRect()
    // Hold the frame's spot in the layout while it is out of flow.
    el.parentElement!.style.height = `${rect.height}px`
    Object.assign(el.style, {
      position: 'fixed',
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      zIndex: '50',
    })
    document.documentElement.style.overflow = 'hidden'
    el.setAttribute('role', 'dialog')
    el.setAttribute('aria-modal', 'true')
    const grow = () =>
      Object.assign(el.style, {
        top: '0px',
        left: '0px',
        width: '100vw',
        height: '100dvh',
      })
    if (reducedMotion()) {
      grow()
    } else {
      el.style.transition = TRANSITION
      // Two frames so the starting rect is committed before it animates.
      requestAnimationFrame(() => requestAnimationFrame(grow))
    }
    await nextTick()
    closer.value?.focus()
  }

  function collapse(animate = !reducedMotion()) {
    const el = frame.value
    if (!el || !expanded.value || settling) return
    const target = el.parentElement!.getBoundingClientRect()
    const settle = async () => {
      settling = false
      expanded.value = false
      el.style.cssText = ''
      el.parentElement!.style.height = ''
      el.removeAttribute('role')
      el.removeAttribute('aria-modal')
      document.documentElement.style.overflow = ''
      await nextTick()
      opener.value?.focus()
    }
    if (!animate) {
      void settle()
    } else {
      settling = true
      Object.assign(el.style, {
        top: `${target.top}px`,
        left: `${target.left}px`,
        width: `${target.width}px`,
        height: `${target.height}px`,
      })
      setTimeout(settle, DURATION + 50)
    }
  }

  // Escape peels one layer at a time. Mid-drag the element claims Escape to
  // cancel the drag (preventDefault on a window listener, which runs after
  // this document one), so defer one task and let its verdict stand. A dialog
  // open inside the frame (the help card) closes itself instead.
  function onKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') return
    setTimeout(() => {
      if (event.defaultPrevented) return
      if (frame.value?.querySelector('[aria-modal="true"]')) return
      collapse()
    })
  }

  // A window resized past the breakpoint while expanded would otherwise
  // stay full screen on a desktop layout that plays in place.
  let desktop: MediaQueryList | null = null
  function onBreakpoint() {
    if (desktop!.matches) collapse(false)
  }

  onMounted(() => {
    document.addEventListener('keydown', onKeydown)
    desktop = matchMedia(desktopQuery)
    desktop.addEventListener('change', onBreakpoint)
  })
  onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeydown)
    desktop?.removeEventListener('change', onBreakpoint)
    document.documentElement.style.overflow = ''
  })

  return { expanded, expand, collapse }
}
