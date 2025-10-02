import { ref, watch, nextTick, type Ref } from 'vue'

interface UseVideoStreamOptions {
  stream: Ref<MediaStream | null>
  enabled?: Ref<boolean>
  debug?: boolean
}

/**
 * Composable to manage video element srcObject and playback
 * Handles stream attachment and automatic play
 */
export const useVideoStream = ({ stream, enabled, debug = false }: UseVideoStreamOptions) => {
  const videoRef = ref<HTMLVideoElement>()

  const log = (...args: any[]) => {
    // eslint-disable-next-line no-console
    if (debug) console.log('[VideoStream]', ...args)
  }

  const attachStream = async () => {
    await nextTick()

    if (!videoRef.value) {
      log('No video element ref')
      return
    }

    if (stream.value) {
      const tracks = stream.value.getVideoTracks()
      log('Attaching stream', {
        hasVideo: tracks.length > 0,
        videoActive: tracks[0]?.enabled,
      })

      videoRef.value.srcObject = stream.value

      try {
        await videoRef.value.play()
        log('Video playing')
      } catch (error) {
        // eslint-disable-next-line no-console
        if (debug) console.error('[VideoStream] Failed to play:', error)
      }
    } else {
      log('Clearing stream')
      videoRef.value.srcObject = null
    }
  }

  watch(stream, attachStream, { immediate: true })

  if (enabled) {
    watch(enabled, (isEnabled) => {
      log('Enabled state changed:', isEnabled)
    })
  }

  return {
    videoRef,
    attachStream,
  }
}
