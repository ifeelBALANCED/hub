import { ref } from 'vue'

interface UseClipboardOptions {
  /**
   * Duration in ms to show "copied" state
   * @default 2000
   */
  copiedDuration?: number

  /**
   * Callback on successful copy
   */
  onSuccess?: (text: string) => void

  /**
   * Callback on copy error
   */
  onError?: (error: Error) => void
}

/**
 * Composable for clipboard operations
 * Provides copy functionality with visual feedback
 */
export const useClipboard = (options: UseClipboardOptions = {}) => {
  const { copiedDuration = 2000, onSuccess, onError } = options

  const copied = ref(false)
  const isSupported = ref(
    typeof navigator !== 'undefined' &&
      'clipboard' in navigator &&
      typeof navigator.clipboard.writeText === 'function',
  )

  let timeout: ReturnType<typeof setTimeout> | null = null

  const copy = async (text: string): Promise<boolean> => {
    if (!isSupported.value) {
      const error = new Error('Clipboard API not supported')
      onError?.(error)
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      copied.value = true
      onSuccess?.(text)

      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        copied.value = false
      }, copiedDuration)

      return true
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Failed to copy')
      onError?.(err)
      return false
    }
  }

  return {
    copy,
    copied,
    isSupported,
  }
}
