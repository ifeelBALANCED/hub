<template>
  <div class="flex items-center gap-1">
    <div class="flex items-end gap-0.5 h-4">
      <div
        v-for="i in 5"
        :key="i"
        :class="['w-0.5 bg-green-500 rounded-full transition-all duration-75', getBarHeight(i)]"
        :style="{ height: getBarHeight(i) }"
      />
    </div>

    <div v-if="isSpeaking" class="flex items-center gap-1 text-green-500">
      <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

interface Props {
  isMicrophoneOn: boolean
  audioStream?: MediaStream | null
}

const props = defineProps<Props>()

const audioContext = ref<AudioContext | null>(null)
const analyser = ref<AnalyserNode | null>(null)
const microphone = ref<MediaStreamAudioSourceNode | null>(null)
const dataArray = ref<Uint8Array | null>(null)
const animationFrame = ref<number | null>(null)
const isSpeaking = ref(false)
const audioLevel = ref(0)

const getBarHeight = (index: number) => {
  const baseHeight = 4
  const maxHeight = 16
  const level = Math.min((audioLevel?.value || 0) / 128, 1) // Normalize to 0-1

  const heights = [0.2, 0.5, 1, 0.7, 0.3]
  const height = baseHeight + (maxHeight - baseHeight) * (heights[index - 1] || 0) * level

  return `${Math.max(baseHeight, height)}px`
}

const initializeAudioAnalysis = async () => {
  if (!props.audioStream || !props.isMicrophoneOn) return

  try {
    audioContext.value = new (window.AudioContext || (window as any).webkitAudioContext)()
    analyser.value = audioContext.value.createAnalyser()
    analyser.value.fftSize = 256

    const bufferLength = analyser.value.frequencyBinCount
    dataArray.value = new Uint8Array(bufferLength)

    const audioTracks = props.audioStream.getAudioTracks()
    if (audioTracks.length > 0) {
      microphone.value = audioContext.value.createMediaStreamSource(props.audioStream)
      microphone.value.connect(analyser.value)

      animate()
    }
  } catch (error) {
    //
  }
}

const animate = () => {
  if (!analyser.value || !dataArray.value) return

  // @ts-ignore - Type mismatch between Uint8Array<ArrayBufferLike> and Uint8Array<ArrayBuffer>
  analyser.value.getByteFrequencyData(dataArray.value)

  // Calculate average audio level
  let sum = 0
  for (let i = 0; i < dataArray.value.length; i++) {
    sum += dataArray.value[i] || 0
  }
  const average = sum / dataArray.value.length
  audioLevel.value = average

  // Determine if speaking (threshold-based)
  const speakingThreshold = 10 // Adjust this threshold as needed
  isSpeaking.value = average > speakingThreshold

  animationFrame.value = requestAnimationFrame(animate)
}

// Cleanup audio analysis
const cleanupAudioAnalysis = () => {
  if (animationFrame.value) {
    cancelAnimationFrame(animationFrame.value)
    animationFrame.value = null
  }

  if (microphone.value) {
    microphone.value.disconnect()
    microphone.value = null
  }

  if (audioContext.value && audioContext.value.state !== 'closed') {
    audioContext.value.close()
    audioContext.value = null
  }

  analyser.value = null
  dataArray.value = null
  isSpeaking.value = false
  audioLevel.value = 0
}

// Watch for microphone state changes
watch(
  () => props.isMicrophoneOn,
  (isOn) => {
    if (isOn && props.audioStream) {
      initializeAudioAnalysis()
    } else {
      cleanupAudioAnalysis()
    }
  },
)

// Watch for audio stream changes
watch(
  () => props.audioStream,
  (stream) => {
    if (props.isMicrophoneOn && stream) {
      initializeAudioAnalysis()
    } else {
      cleanupAudioAnalysis()
    }
  },
)

// Cleanup on unmount
onUnmounted(() => {
  cleanupAudioAnalysis()
})
</script>
