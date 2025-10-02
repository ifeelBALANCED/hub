<template>
  <div class="relative w-full h-full flex flex-col bg-black overflow-hidden">
    <div
      v-if="filmstripParticipants.length > 0"
      class="flex-shrink-0 bg-black/50 backdrop-blur-sm border-b border-white/10"
      style="max-height: 96px"
    >
      <ParticipantFilmstrip :participants="filmstripParticipants" />
    </div>

    <div class="flex-1 relative overflow-hidden">
      <div class="w-full h-full flex items-center justify-center">
        <video ref="screenVideoRef" autoplay playsinline class="w-full h-full object-contain" />
      </div>

      <div
        v-if="showSelfView"
        ref="pipContainerRef"
        :style="{
          left: pipPosition.x + 'px',
          top: pipPosition.y + 'px',
          width: pipSize.width + 'px',
          height: pipSize.height + 'px',
        }"
        class="absolute rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 cursor-move group hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all duration-200 z-20"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <ActiveSpeakerRing :is-active="isLocalSpeaking" :intensity="localAudioLevel" />

        <video
          v-if="isCameraOn && localStream"
          ref="localVideoRef"
          autoplay
          muted
          playsinline
          class="w-full h-full object-cover"
        />

        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-primary/10"
        >
          <div
            class="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xl font-bold"
          >
            {{ userInitials }}
          </div>
        </div>

        <div
          class="absolute bottom-2 left-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm"
        >
          You
        </div>

        <div v-if="!isMicrophoneOn" class="absolute top-2 right-2 bg-red-500 rounded-full p-1">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
            <line x1="1" y1="1" x2="23" y2="23" stroke-width="2" />
          </svg>
        </div>

        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/20"
        >
          <svg
            class="w-6 h-6 text-white drop-shadow-lg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        </div>
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
      <div v-show="showControls" class="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
        <slot name="controls" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import ParticipantFilmstrip from '../ParticipantFilmstrip.vue'
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
}

interface Props {
  screenStream: MediaStream | null
  localStream: MediaStream | null
  isCameraOn: boolean
  isMicrophoneOn: boolean
  userName: string
  userInitials: string
  participants: Participant[]
  localAudioLevel?: number
  showSelfView?: boolean
  autoHideControls?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  localAudioLevel: 0,
  showSelfView: true,
  autoHideControls: true,
})

const pipContainerRef = ref<HTMLDivElement>()
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const pipPosition = ref({ x: 0, y: 0 })
const pipSize = ref({ width: 240, height: 135 })

// Video refs
const screenVideoRef = ref<HTMLVideoElement>()
const localVideoRef = ref<HTMLVideoElement>()

const { showControls } = useAutoHideControls({
  delay: 3000,
  enabled: props.autoHideControls,
})

// Watch for screen stream changes
watch(
  () => props.screenStream,
  async (stream) => {
    await nextTick()
    if (screenVideoRef.value && stream) {
      screenVideoRef.value.srcObject = stream
      try {
        await screenVideoRef.value.play()
      } catch {
        // Ignore autoplay errors
      }
    } else if (screenVideoRef.value && !stream) {
      screenVideoRef.value.srcObject = null
    }
  },
  { immediate: true },
)

// Watch for local stream changes
watch(
  () => props.localStream,
  async (stream) => {
    await nextTick()
    if (localVideoRef.value && stream && props.isCameraOn) {
      localVideoRef.value.srcObject = stream
      try {
        await localVideoRef.value.play()
      } catch {
        // Ignore autoplay errors
      }
    } else if (localVideoRef.value && !stream) {
      localVideoRef.value.srcObject = null
    }
  },
  { immediate: true },
)

// Watch for camera toggle
watch(
  () => props.isCameraOn,
  async (isOn) => {
    await nextTick()
    if (localVideoRef.value && props.localStream && isOn) {
      localVideoRef.value.srcObject = props.localStream
      try {
        await localVideoRef.value.play()
      } catch {
        // Ignore autoplay errors
      }
    }
  },
)

const isLocalSpeaking = computed(() => props.isMicrophoneOn && props.localAudioLevel > 0.3)
const filmstripParticipants = computed(() => props.participants.filter((p) => !p.isLocal))

const loadSavedPosition = () => {
  if (!pipContainerRef.value) {
    pipPosition.value = {
      x: window.innerWidth - pipSize.value.width - 20,
      y: window.innerHeight - pipSize.value.height - 180,
    }
    return
  }

  const saved = sessionStorage.getItem('pip-position')
  if (saved) {
    const parsed = JSON.parse(saved)
    pipPosition.value = parsed
  } else {
    pipPosition.value = {
      x: window.innerWidth - pipSize.value.width - 20,
      y: window.innerHeight - pipSize.value.height - 180,
    }
  }
}

const snapToCorner = () => {
  if (!pipContainerRef.value) return

  const { x, y } = pipPosition.value
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2

  const snapMargin = 20

  if (x < centerX) {
    pipPosition.value.x = snapMargin
  } else {
    pipPosition.value.x = window.innerWidth - pipSize.value.width - snapMargin
  }

  if (y < centerY) {
    pipPosition.value.y = snapMargin
  } else {
    pipPosition.value.y = window.innerHeight - pipSize.value.height - snapMargin - 160
  }

  sessionStorage.setItem('pip-position', JSON.stringify(pipPosition.value))
}

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!pipContainerRef.value) return

  isDragging.value = true
  const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
  const clientY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY

  dragOffset.value = {
    x: clientX - pipPosition.value.x,
    y: clientY - pipPosition.value.y,
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('touchmove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchend', stopDrag)
}

const handleDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value || !pipContainerRef.value) return

  const clientX = 'touches' in e ? (e.touches[0]?.clientX ?? 0) : e.clientX
  const clientY = 'touches' in e ? (e.touches[0]?.clientY ?? 0) : e.clientY

  const newX = clientX - dragOffset.value.x
  const newY = clientY - dragOffset.value.y

  const maxX = window.innerWidth - pipSize.value.width - 20
  const maxY = window.innerHeight - pipSize.value.height - 180

  pipPosition.value = {
    x: Math.max(20, Math.min(newX, maxX)),
    y: Math.max(20, Math.min(newY, maxY)),
  }
}

const stopDrag = () => {
  isDragging.value = false
  snapToCorner()
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('touchmove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
}

onMounted(() => {
  loadSavedPosition()
  window.addEventListener('resize', loadSavedPosition)
})

onUnmounted(() => {
  window.removeEventListener('resize', loadSavedPosition)
  stopDrag()
})
</script>
