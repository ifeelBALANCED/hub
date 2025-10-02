import { onMounted, onUnmounted } from 'vue'

interface ShortcutHandlers {
  onToggleMicrophone?: () => void | Promise<void>
  onToggleCamera?: () => void | Promise<void>
  onToggleScreenShare?: () => void | Promise<void>
  onLeave?: () => void | Promise<void>
  onShowHelp?: () => void
}

export const useKeyboardShortcuts = (handlers: ShortcutHandlers) => {
  const handleKeyDown = async (event: KeyboardEvent) => {
    const target = event.target as HTMLElement
    const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)

    if (isInput && !event.metaKey && !event.ctrlKey) {
      return
    }

    const key = event.key.toLowerCase()

    if (event.shiftKey && key === '?') {
      event.preventDefault()
      handlers.onShowHelp?.()
      return
    }

    if (event.metaKey || event.ctrlKey) {
      return
    }

    switch (key) {
      case 'm':
        event.preventDefault()
        await handlers.onToggleMicrophone?.()
        break
      case 'c':
        event.preventDefault()
        await handlers.onToggleCamera?.()
        break
      case 's':
        event.preventDefault()
        await handlers.onToggleScreenShare?.()
        break
      case 'escape':
        event.preventDefault()
        break
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })

  return {
    shortcuts: [
      { key: 'M', description: 'Toggle microphone' },
      { key: 'C', description: 'Toggle camera' },
      { key: 'S', description: 'Toggle screen share' },
      { key: 'Esc', description: 'Close dialogs' },
      { key: 'Shift + ?', description: 'Show shortcuts' },
    ],
  }
}
