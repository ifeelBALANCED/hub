<template>
  <div class="relative w-full h-full bg-black overflow-hidden">
    <ActiveSpeakerRing :is-active="isActiveSpeaker" :intensity="audioLevel" />

    <video
      v-if="localStream && isCameraOn"
      ref="videoRef"
      autoplay
      muted
      playsinline
      class="w-full h-full object-cover transition-transform duration-300"
      :class="{ 'scale-105': isActiveSpeaker }"
    />

    <div
      v-else
      class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-muted/20"
    >
      <div
        class="w-32 h-32 md:w-48 md:h-48 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-5xl md:text-7xl font-bold mb-6 shadow-2xl"
      >
        {{ userInitials }}
      </div>
      <p class="text-xl md:text-2xl font-medium text-foreground">{{ userName }}</p>
      <p class="text-sm md:text-base text-muted-foreground mt-2">Camera is off</p>
    </div>

    <div
      v-if="!isMicrophoneOn"
      class="absolute top-6 left-6 bg-red-500/90 backdrop-blur-sm rounded-full p-3 shadow-lg animate-in fade-in duration-200"
    >
      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
        />
        <line x1="1" y1="1" x2="23" y2="23" stroke-width="2" />
      </svg>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-200 ease-in"
      enter-from-class="opacity-0 translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-4"
    >
      <div v-show="showControls" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <slot name="controls" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, nextTick, ref } from 'vue'
import ActiveSpeakerRing from '../ActiveSpeakerRing.vue'
import { useAutoHideControls } from '../../composables/useAutoHideControls'

interface Props {
  localStream: MediaStream | null
  isCameraOn: boolean
  isMicrophoneOn: boolean
  userName: string
  userInitials: string
  audioLevel?: number
  autoHideControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  audioLevel: 0,
  autoHideControls: true,
})

const videoRef = ref<HTMLVideoElement>()

const { showControls } = useAutoHideControls({
  delay: 3000,
  enabled: props.autoHideControls,
})

const isActiveSpeaker = computed(() => props.isMicrophoneOn && props.audioLevel > 0.3)

// Watch for stream changes and attach to video element
watch(
  () => props.localStream,
  async (stream) => {
    await nextTick()
    if (videoRef.value && stream && props.isCameraOn) {
      videoRef.value.srcObject = stream
      try {
        await videoRef.value.play()
      } catch {
        // Ignore autoplay errors
      }
    } else if (videoRef.value && !stream) {
      videoRef.value.srcObject = null
    }
  },
  { immediate: true },
)

// Watch for camera toggle
watch(
  () => props.isCameraOn,
  async (isOn) => {
    await nextTick()
    if (videoRef.value && props.localStream && isOn) {
      videoRef.value.srcObject = props.localStream
      try {
        await videoRef.value.play()
      } catch {
        // Ignore autoplay errors
      }
    }
  },
)
</script>
