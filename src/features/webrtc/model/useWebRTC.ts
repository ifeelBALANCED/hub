import { ref, computed, watch, reactive } from 'vue'

export interface MediaStreamState {
  isCameraOn: boolean
  isMicrophoneOn: boolean
  isScreenSharing: boolean
  localStream: MediaStream | null
  screenStream: MediaStream | null
  screenShareType: 'screen' | 'window' | 'tab' | null
  remoteStreams: Map<string, MediaStream>
  mediaStateBeforeScreenShare: {
    isCameraOn: boolean
    isMicrophoneOn: boolean
  } | null
}

const roomStates = new Map<string, MediaStreamState>()

const getOrCreateRoomState = (roomId: string): MediaStreamState => {
  if (!roomStates.has(roomId)) {
    const state = reactive({
      isCameraOn: false,
      isMicrophoneOn: false,
      isScreenSharing: false,
      localStream: null,
      screenStream: null,
      screenShareType: null,
      remoteStreams: new Map(),
      mediaStateBeforeScreenShare: null,
    })
    roomStates.set(roomId, state)
  }
  return roomStates.get(roomId)!
}

export const useWebRTC = (roomId: string) => {
  const mediaState = ref<MediaStreamState>(getOrCreateRoomState(roomId))

  watch(
    () => roomId,
    (newRoomId) => {
      if (newRoomId) {
        mediaState.value = getOrCreateRoomState(newRoomId)
      }
    },
  )

  const remoteStreams = computed(() => mediaState.value.remoteStreams)

  const isAnyMediaActive = computed(
    () =>
      mediaState.value.isCameraOn ||
      mediaState.value.isMicrophoneOn ||
      mediaState.value.isScreenSharing,
  )

  const initializeMedia = async (constraints: MediaStreamConstraints) => {
    const stream = await navigator.mediaDevices.getUserMedia(constraints)

    if (mediaState.value.localStream) {
      if (constraints.video) {
        const oldVideoTracks = mediaState.value.localStream.getVideoTracks()
        oldVideoTracks.forEach((track) => {
          track.stop()
          mediaState.value.localStream!.removeTrack(track)
        })
      }
      if (constraints.audio) {
        const oldAudioTracks = mediaState.value.localStream.getAudioTracks()
        oldAudioTracks.forEach((track) => {
          track.stop()
          mediaState.value.localStream!.removeTrack(track)
        })
      }

      stream.getTracks().forEach((track) => {
        mediaState.value.localStream!.addTrack(track)
      })
    } else {
      mediaState.value.localStream = stream
    }

    if (constraints.video) {
      mediaState.value.isCameraOn = true
    }
    if (constraints.audio) {
      mediaState.value.isMicrophoneOn = true
    }

    stream.getTracks().forEach((track) => {
      track.onended = () => {
        if (track.kind === 'video') {
          mediaState.value.isCameraOn = false
        } else if (track.kind === 'audio') {
          mediaState.value.isMicrophoneOn = false
        }

        if (!mediaState.value.isCameraOn && !mediaState.value.isMicrophoneOn) {
          mediaState.value.localStream = null
        }
      }
    })

    return stream
  }

  const toggleCamera = async () => {
    if (mediaState.value.isCameraOn) {
      if (mediaState.value.localStream) {
        const videoTracks = mediaState.value.localStream.getVideoTracks()
        videoTracks.forEach((track) => {
          track.stop()
          mediaState.value.localStream!.removeTrack(track)
        })
      }
      mediaState.value.isCameraOn = false

      if (mediaState.value.localStream && mediaState.value.localStream.getTracks().length === 0) {
        mediaState.value.localStream = null
      }
    } else {
      await initializeMedia({
        video: true,
        audio: false,
      })
    }
  }

  const toggleMicrophone = async () => {
    if (mediaState.value.isMicrophoneOn) {
      if (mediaState.value.localStream) {
        const audioTracks = mediaState.value.localStream.getAudioTracks()
        audioTracks.forEach((track) => {
          track.stop()
          mediaState.value.localStream!.removeTrack(track)
        })
      }
      mediaState.value.isMicrophoneOn = false

      if (mediaState.value.localStream && mediaState.value.localStream.getTracks().length === 0) {
        mediaState.value.localStream = null
      }
    } else {
      await initializeMedia({
        video: false,
        audio: true,
      })
    }
  }

  const toggleScreenShare = async () => {
    if (mediaState.value.isScreenSharing) {
      if (mediaState.value.screenStream) {
        mediaState.value.screenStream.getTracks().forEach((track) => {
          track.stop()
        })
        mediaState.value.screenStream = null
      }

      mediaState.value.isScreenSharing = false
      mediaState.value.screenShareType = null

      await new Promise((resolve) => setTimeout(resolve, 50))

      if (mediaState.value.mediaStateBeforeScreenShare) {
        const previousState = mediaState.value.mediaStateBeforeScreenShare

        if (previousState.isCameraOn && !mediaState.value.isCameraOn) {
          await toggleCamera()
        }
        if (previousState.isMicrophoneOn && !mediaState.value.isMicrophoneOn) {
          await toggleMicrophone()
        }
        if (!previousState.isCameraOn && mediaState.value.isCameraOn) {
          await toggleCamera()
        }
        if (!previousState.isMicrophoneOn && mediaState.value.isMicrophoneOn) {
          await toggleMicrophone()
        }

        mediaState.value.mediaStateBeforeScreenShare = null
      }
    } else {
      mediaState.value.mediaStateBeforeScreenShare = {
        isCameraOn: mediaState.value.isCameraOn,
        isMicrophoneOn: mediaState.value.isMicrophoneOn,
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      const videoTrack = stream.getVideoTracks()[0]
      if (!videoTrack) {
        throw new Error('No video track available')
      }

      const settings = videoTrack.getSettings()

      mediaState.value.screenStream = stream
      mediaState.value.isScreenSharing = true
      mediaState.value.screenShareType =
        (settings.displaySurface as 'screen' | 'window' | 'tab') || 'screen'

      // Enable camera to show self-view (like Google Meet)
      if (!mediaState.value.isCameraOn) {
        await toggleCamera()
      }

      const restoreMediaState = async () => {
        mediaState.value.screenStream = null
        mediaState.value.isScreenSharing = false
        mediaState.value.screenShareType = null

        await new Promise((resolve) => setTimeout(resolve, 50))

        if (mediaState.value.mediaStateBeforeScreenShare) {
          const previousState = mediaState.value.mediaStateBeforeScreenShare

          if (previousState.isCameraOn && !mediaState.value.isCameraOn) {
            await toggleCamera()
          }
          if (previousState.isMicrophoneOn && !mediaState.value.isMicrophoneOn) {
            await toggleMicrophone()
          }
          if (!previousState.isCameraOn && mediaState.value.isCameraOn) {
            await toggleCamera()
          }
          if (!previousState.isMicrophoneOn && mediaState.value.isMicrophoneOn) {
            await toggleMicrophone()
          }

          mediaState.value.mediaStateBeforeScreenShare = null
        }
      }

      videoTrack.onended = restoreMediaState

      stream.getAudioTracks().forEach((track) => {
        track.onended = () => {
          if (mediaState.value.screenStream) {
            mediaState.value.screenStream.removeTrack(track)
          }
        }
      })
    }
  }

  const getAudioStream = () => {
    if (!mediaState.value.localStream) return null
    const audioTracks = mediaState.value.localStream.getAudioTracks()
    if (audioTracks.length === 0) return null

    const audioStream = new MediaStream()
    audioTracks.forEach((track) => audioStream.addTrack(track))
    return audioStream
  }

  const addRemoteStream = (participantId: string, stream: MediaStream) => {
    mediaState.value.remoteStreams.set(participantId, stream)
  }

  const removeRemoteStream = (participantId: string) => {
    const stream = mediaState.value.remoteStreams.get(participantId)
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      mediaState.value.remoteStreams.delete(participantId)
    }
  }

  const cleanup = () => {
    if (mediaState.value.localStream) {
      mediaState.value.localStream.getTracks().forEach((track) => track.stop())
      mediaState.value.localStream = null
    }

    if (mediaState.value.screenStream) {
      mediaState.value.screenStream.getTracks().forEach((track) => track.stop())
      mediaState.value.screenStream = null
    }

    mediaState.value.remoteStreams.forEach((stream) => {
      stream.getTracks().forEach((track) => track.stop())
    })
    mediaState.value.remoteStreams.clear()

    mediaState.value.isCameraOn = false
    mediaState.value.isMicrophoneOn = false
    mediaState.value.isScreenSharing = false
    mediaState.value.screenShareType = null
    mediaState.value.mediaStateBeforeScreenShare = null
  }

  return {
    mediaState,
    remoteStreams,
    isAnyMediaActive,
    toggleCamera,
    toggleMicrophone,
    toggleScreenShare,
    getAudioStream,
    addRemoteStream,
    removeRemoteStream,
    cleanup,
  }
}
