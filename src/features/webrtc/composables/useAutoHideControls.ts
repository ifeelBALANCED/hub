import { ref, onMounted, onUnmounted } from 'vue'

interface UseAutoHideControlsOptions {
  /**
   * Delay in ms before hiding controls
   * @default 3000
   */
  delay?: number

  /**
   * Whether auto-hide is enabled
   * @default true
   */
  enabled?: boolean
}

/**
 * Composable to auto-hide controls after inactivity
 * Shows controls on mouse/keyboard/touch activity
 */
export const useAutoHideControls = (options: UseAutoHideControlsOptions = {}) => {
  const { delay = 3000, enabled = true } = options

  const showControls = ref(true)
  let hideTimeout: ReturnType<typeof setTimeout> | null = null

  const resetHideTimer = () => {
    if (!enabled) return

    showControls.value = true

    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }

    hideTimeout = setTimeout(() => {
      showControls.value = false
    }, delay)
  }

  const show = () => {
    showControls.value = true
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  const hide = () => {
    showControls.value = false
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
  }

  onMounted(() => {
    if (!enabled) return

    resetHideTimer()

    // Event listeners
    window.addEventListener('mousemove', resetHideTimer)
    window.addEventListener('mousedown', resetHideTimer)
    window.addEventListener('keydown', resetHideTimer)
    window.addEventListener('touchstart', resetHideTimer)
  })

  onUnmounted(() => {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
    }

    window.removeEventListener('mousemove', resetHideTimer)
    window.removeEventListener('mousedown', resetHideTimer)
    window.removeEventListener('keydown', resetHideTimer)
    window.removeEventListener('touchstart', resetHideTimer)
  })

  return {
    showControls,
    show,
    hide,
    resetHideTimer,
  }
}
