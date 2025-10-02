import { onMounted, nextTick, type Ref } from 'vue'

interface MediaState {
  isCameraOn: boolean
  isMicrophoneOn: boolean
  localStream: MediaStream | null
}

interface UseMediaStateRestoreOptions {
  roomId: string
  mediaState: Ref<MediaState>
  toggleCamera: () => Promise<void>
  toggleMicrophone: () => Promise<void>
  debug?: boolean
}

/**
 * Composable to restore media state from preview screen
 * Reads saved state from sessionStorage and restores camera/mic
 */
export const useMediaStateRestore = ({
  roomId,
  mediaState,
  toggleCamera,
  toggleMicrophone,
  debug = false,
}: UseMediaStateRestoreOptions) => {
  const log = (...args: any[]) => {
    // eslint-disable-next-line no-console
    if (debug) console.log('[MediaRestore]', ...args)
  }

  onMounted(async () => {
    await nextTick()

    log('Checking media state', {
      currentCamera: mediaState.value.isCameraOn,
      currentMic: mediaState.value.isMicrophoneOn,
      hasStream: !!mediaState.value.localStream,
    })

    const savedState = sessionStorage.getItem(`meeting-${roomId}-media-state`)
    if (!savedState) {
      log('No saved state found')
      return
    }

    try {
      const { isCameraOn: wasCameraOn, isMicrophoneOn: wasMicrophoneOn } = JSON.parse(savedState)

      log('Restoring saved state', { wasCameraOn, wasMicrophoneOn })

      // Restore camera
      if (wasCameraOn && !mediaState.value.isCameraOn) {
        try {
          log('Restoring camera...')
          await toggleCamera()
          await nextTick()
          log('Camera restored', {
            isOn: mediaState.value.isCameraOn,
            hasStream: !!mediaState.value.localStream,
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          if (debug) console.error('[MediaRestore] Failed to restore camera:', error)
        }
      }

      // Restore microphone
      if (wasMicrophoneOn && !mediaState.value.isMicrophoneOn) {
        try {
          log('Restoring microphone...')
          await toggleMicrophone()
          await nextTick()
          log('Microphone restored', {
            isOn: mediaState.value.isMicrophoneOn,
          })
        } catch (error) {
          // eslint-disable-next-line no-console
          if (debug) console.error('[MediaRestore] Failed to restore microphone:', error)
        }
      }

      // Clean up
      sessionStorage.removeItem(`meeting-${roomId}-media-state`)
    } catch (error) {
      // eslint-disable-next-line no-console
      if (debug) console.error('[MediaRestore] Failed to parse saved state:', error)
    }
  })
}
