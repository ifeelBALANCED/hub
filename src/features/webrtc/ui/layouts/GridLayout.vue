<template>
  <div
    class="relative w-full h-full bg-gradient-to-br from-background via-background to-muted/10 p-4 overflow-y-auto"
  >
    <div class="grid gap-4 h-full" :class="gridClass">
      <div
        v-for="participant in participants"
        :key="participant.id"
        class="relative bg-muted rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
        :class="{ 'ring-2 ring-primary': participant.isPinned }"
      >
        <ActiveSpeakerRing
          :is-active="participant.isSpeaking || false"
          :intensity="participant.audioLevel || 0.8"
        />

        <video
          v-if="participant.stream && participant.hasVideo"
          :ref="(el) => setVideoRef(participant.id, el)"
          autoplay
          playsinline
          :muted="participant.isLocal"
          class="w-full h-full object-cover"
        />

        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5"
        >
          <div
            class="bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-lg"
            :class="avatarSizeClass"
          >
            {{ participant.initials }}
          </div>
          <p class="text-sm md:text-base font-medium text-foreground mt-3">
            {{ participant.name }}
          </p>
          <p v-if="!participant.hasVideo" class="text-xs text-muted-foreground mt-1">
            Camera is off
          </p>
        </div>

        <div
          class="absolute bottom-3 left-3 bg-black/80 text-white text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg backdrop-blur-sm flex items-center gap-2"
        >
          <span class="font-medium truncate max-w-[150px]">
            {{ participant.isLocal ? 'You' : participant.name }}
          </span>
          <span v-if="participant.isSpeaking && participant.isMicrophoneOn" class="flex-shrink-0">
            <span class="relative flex h-2 w-2">
              <span
                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
              ></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </span>
          <svg
            v-else-if="!participant.isMicrophoneOn"
            class="w-3 h-3 text-red-400 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <line x1="1" y1="1" x2="23" y2="23" stroke-width="2" />
          </svg>
        </div>

        <button
          v-if="!participant.isLocal"
          class="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 hover:bg-black/80 p-2 rounded-lg"
          @click="$emit('pin-participant', participant.id)"
        >
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-show="showControls" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <slot name="controls" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ActiveSpeakerRing from '../ActiveSpeakerRing.vue'
import { useAutoHideControls } from '../../composables/useAutoHideControls'

interface Participant {
  id: string
  name: string
  initials: string
  stream: MediaStream | null
  hasVideo: boolean
  isMicrophoneOn: boolean
  isLocal: boolean
  isSpeaking?: boolean
  audioLevel?: number
  isPinned?: boolean
}

interface Props {
  participants: Participant[]
  autoHideControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  autoHideControls: true,
})

defineEmits<{
  'pin-participant': [id: string]
}>()

const videoRefs = ref<Map<string, HTMLVideoElement>>(new Map())

const { showControls } = useAutoHideControls({
  delay: 3000,
  enabled: props.autoHideControls,
})

const gridClass = computed(() => {
  const count = props.participants.length
  if (count === 1) return 'grid-cols-1'
  if (count === 2) return 'grid-cols-1 md:grid-cols-2'
  if (count <= 4) return 'grid-cols-1 md:grid-cols-2'
  if (count <= 6) return 'grid-cols-2 md:grid-cols-3'
  if (count <= 9) return 'grid-cols-2 md:grid-cols-3'
  return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
})

const avatarSizeClass = computed(() => {
  const count = props.participants.length
  if (count === 1) return 'w-32 h-32 md:w-48 md:h-48 text-5xl md:text-7xl'
  if (count <= 4) return 'w-20 h-20 md:w-32 md:h-32 text-3xl md:text-5xl'
  return 'w-16 h-16 md:w-24 md:h-24 text-2xl md:text-4xl'
})

const setVideoRef = (participantId: string, element: any) => {
  if (element && element.tagName === 'VIDEO') {
    videoRefs.value.set(participantId, element)
    const participant = props.participants.find((p) => p.id === participantId)
    if (participant?.stream) {
      element.srcObject = participant.stream
      element.play().catch(() => {})
    }
  } else {
    videoRefs.value.delete(participantId)
  }
}
</script>
