<template>
  <div class="relative w-full h-full bg-black flex items-center justify-center">
    <video ref="screenVideoRef" autoplay playsinline class="w-full h-full object-contain" />

    <div
      v-if="showPiP && localStream && isCameraOn"
      ref="pipContainerRef"
      :style="{ left: pipPosition.x + 'px', top: pipPosition.y + 'px' }"
      class="absolute w-48 h-36 rounded-lg overflow-hidden shadow-2xl border-2 border-white/20 cursor-move group hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-200"
      @mousedown="startDrag"
    >
      <video ref="localVideoRef" autoplay muted playsinline class="w-full h-full object-cover" />

      <div
        v-if="isMicrophoneOn"
        class="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 bg-black/70 backdrop-blur-sm rounded-md"
      >
        <div class="relative flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <div class="absolute inset-0 rounded-full bg-green-500/30 animate-ping"></div>
        </div>
        <span class="text-white text-xs font-medium">You</span>
      </div>

      <div
        v-else
        class="absolute bottom-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm rounded-md flex items-center gap-1"
      >
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

      <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <svg
          class="w-4 h-4 text-white drop-shadow-lg"
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useWebRTC } from '../model/useWebRTC'

interface Props {
  roomId: string
}

const props = defineProps<Props>()

const { mediaState } = useWebRTC(props.roomId)

const screenVideoRef = ref<HTMLVideoElement>()
const localVideoRef = ref<HTMLVideoElement>()
const pipContainerRef = ref<HTMLDivElement>()

const isDragging = ref(false)
const pipPosition = ref({ x: 20, y: 20 })
const dragOffset = ref({ x: 0, y: 0 })

const showPiP = computed(() => mediaState.value.isCameraOn)
const isCameraOn = computed(() => mediaState.value.isCameraOn)
const isMicrophoneOn = computed(() => mediaState.value.isMicrophoneOn)
const localStream = computed(() => mediaState.value.localStream)
const screenStream = computed(() => mediaState.value.screenStream)

watch(
  screenStream,
  async (stream) => {
    await nextTick()
    if (screenVideoRef.value && stream) {
      screenVideoRef.value.srcObject = stream
      try {
        await screenVideoRef.value.play()
      } catch {
        //
      }
    } else if (screenVideoRef.value && !stream) {
      screenVideoRef.value.srcObject = null
    }
  },
  { immediate: true },
)

watch(
  localStream,
  async (stream) => {
    await nextTick()
    if (localVideoRef.value && stream) {
      localVideoRef.value.srcObject = stream
      try {
        await localVideoRef.value.play()
      } catch {
        //
      }
    } else if (localVideoRef.value && !stream) {
      localVideoRef.value.srcObject = null
    }
  },
  { immediate: true },
)

const startDrag = (e: MouseEvent) => {
  if (!pipContainerRef.value) return

  isDragging.value = true
  dragOffset.value = {
    x: e.clientX - pipPosition.value.x,
    y: e.clientY - pipPosition.value.y,
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
}

const handleDrag = (e: MouseEvent) => {
  if (!isDragging.value || !pipContainerRef.value) return

  const newX = e.clientX - dragOffset.value.x
  const newY = e.clientY - dragOffset.value.y

  const maxX = window.innerWidth - pipContainerRef.value.offsetWidth - 20
  const maxY = window.innerHeight - pipContainerRef.value.offsetHeight - 20

  pipPosition.value = {
    x: Math.max(20, Math.min(newX, maxX)),
    y: Math.max(20, Math.min(newY, maxY)),
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

onMounted(() => {
  const updatePipPosition = () => {
    if (!pipContainerRef.value) return
    const maxX = window.innerWidth - pipContainerRef.value.offsetWidth - 20
    const maxY = window.innerHeight - pipContainerRef.value.offsetHeight - 20
    pipPosition.value = {
      x: Math.min(pipPosition.value.x, maxX),
      y: Math.min(pipPosition.value.y, maxY),
    }
  }

  window.addEventListener('resize', updatePipPosition)

  onUnmounted(() => {
    window.removeEventListener('resize', updatePipPosition)
    stopDrag()
  })
})
</script>
