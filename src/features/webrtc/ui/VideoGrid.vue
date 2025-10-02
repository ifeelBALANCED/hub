<template>
  <div class="h-full w-full overflow-hidden relative">
    <Transition
      mode="out-in"
      enter-active-class="transition-all duration-150 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 scale-98"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-98"
    >
      <PresenterLayout
        v-if="currentLayout === 'presenter'"
        :key="'presenter'"
        :screen-stream="screenStream"
        :local-stream="localStream"
        :is-camera-on="isCameraOn"
        :is-microphone-on="isMicrophoneOn"
        :user-name="userName"
        :user-initials="userInitials"
        :participants="allParticipants"
        :local-audio-level="localAudioLevel"
      >
        <template #controls>
          <slot name="controls" />
        </template>
      </PresenterLayout>

      <StageOnlyLayout
        v-else-if="currentLayout === 'stage-only'"
        :key="'stage-only'"
        :local-stream="localStream"
        :is-camera-on="isCameraOn"
        :is-microphone-on="isMicrophoneOn"
        :user-name="userName"
        :user-initials="userInitials"
        :audio-level="localAudioLevel"
      >
        <template #controls>
          <slot name="controls" />
        </template>
      </StageOnlyLayout>

      <GridLayout
        v-else
        :key="'grid'"
        :participants="allParticipants"
        @pin-participant="handlePinParticipant"
      >
        <template #controls>
          <slot name="controls" />
        </template>
      </GridLayout>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWebRTC } from '../model/useWebRTC'
import { useParticipants } from '@/entities/participant'
import { useUser } from '@/entities/user'
import StageOnlyLayout from './layouts/StageOnlyLayout.vue'
import PresenterLayout from './layouts/PresenterLayout.vue'
import GridLayout from './layouts/GridLayout.vue'

interface Props {
  roomId: string
}

const props = defineProps<Props>()

const { mediaState, remoteStreams } = useWebRTC(props.roomId)
const { participants } = useParticipants(props.roomId)
const { user, userDisplayName } = useUser()

const pinnedParticipantId = ref<string | null>(null)
const localAudioLevel = ref(0)

const isCameraOn = computed(() => mediaState.value.isCameraOn)
const isMicrophoneOn = computed(() => mediaState.value.isMicrophoneOn)
const isScreenSharing = computed(() => mediaState.value.isScreenSharing)
const localStream = computed(() => mediaState.value.localStream)
const screenStream = computed(() => mediaState.value.screenStream)

const userName = computed(() => userDisplayName || 'User')
const userInitials = computed(() => {
  const name = userName.value
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const allParticipants = computed(() => {
  const result = []
  const currentUserEmail = user?.email

  result.push({
    id: `local-${currentUserEmail || 'user'}`,
    name: userName.value,
    initials: userInitials.value,
    stream: localStream.value,
    hasVideo: isCameraOn.value,
    isMicrophoneOn: isMicrophoneOn.value,
    isLocal: true,
    isSpeaking: localAudioLevel.value > 0.3,
    audioLevel: localAudioLevel.value,
    isPinned: pinnedParticipantId.value === `local-${currentUserEmail || 'user'}`,
  })

  participants.value.forEach((participant) => {
    // Skip if this participant is the current user (prevent duplicate)
    if (currentUserEmail && participant.id.includes(currentUserEmail)) {
      return
    }

    const stream = remoteStreams.value.get(participant.id)
    result.push({
      id: participant.id,
      name: participant.name,
      initials: participant?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      stream: stream || null,
      hasVideo: !!stream?.getVideoTracks().length,
      isMicrophoneOn: !!stream?.getAudioTracks().length,
      isLocal: false,
      isSpeaking: false,
      audioLevel: 0,
      isPinned: pinnedParticipantId.value === participant.id,
    })
  })

  return result
})

const currentLayout = computed(() => {
  if (isScreenSharing.value) {
    return 'presenter'
  }

  const totalParticipants = allParticipants.value.length

  if (totalParticipants === 1) {
    return 'stage-only'
  }

  return 'grid'
})

const handlePinParticipant = (id: string) => {
  pinnedParticipantId.value = pinnedParticipantId.value === id ? null : id
}

if (mediaState.value.localStream) {
  const audioContext = new AudioContext()
  const analyser = audioContext.createAnalyser()
  const microphone = audioContext.createMediaStreamSource(mediaState.value.localStream)
  const dataArray = new Uint8Array(analyser.frequencyBinCount)

  microphone.connect(analyser)
  analyser.fftSize = 256

  const updateAudioLevel = () => {
    if (!isMicrophoneOn.value) {
      localAudioLevel.value = 0
      requestAnimationFrame(updateAudioLevel)
      return
    }

    analyser.getByteFrequencyData(dataArray)
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length
    localAudioLevel.value = Math.min(average / 128, 1)
    requestAnimationFrame(updateAudioLevel)
  }

  updateAudioLevel()
}
</script>
