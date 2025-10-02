<template>
  <div class="flex items-center justify-center gap-4 p-4 bg-card border rounded-lg">
    <!-- Connection Status Indicator -->
    <div class="flex items-center gap-2 text-sm">
      <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span class="text-muted-foreground">Connected</span>
    </div>

    <!-- Voice Animation (only show when microphone is on) -->
    <VoiceAnimation
      v-if="isMicrophoneOn"
      :is-microphone-on="isMicrophoneOn"
      :audio-stream="getAudioStream()"
    />
    <button
      @click="handleToggleCamera"
      :disabled="!hasMediaSupport || isLoading"
      :class="[
        'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isCameraOn
          ? 'bg-card hover:bg-muted/80 text-foreground'
          : 'bg-red-500 hover:bg-red-600 text-white',
        (!hasMediaSupport || isLoading) && 'opacity-50 cursor-not-allowed',
      ]"
      :title="isCameraOn ? 'Turn off camera' : 'Turn on camera'"
      :aria-label="isCameraOn ? 'Turn off camera' : 'Turn on camera'"
      :aria-pressed="isCameraOn"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          v-if="isCameraOn"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
        <g v-else>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
          <line x1="3" y1="3" x2="21" y2="21" stroke-width="2" stroke-linecap="round" />
        </g>
      </svg>
      <span class="text-sm font-medium">
        {{ isCameraOn ? 'Turn off' : 'Turn on' }}
      </span>
    </button>

    <!-- Microphone Control -->
    <button
      @click="handleToggleMicrophone"
      :disabled="!hasMediaSupport || isLoading"
      :class="[
        'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isMicrophoneOn
          ? 'bg-card hover:bg-muted/80 text-foreground'
          : 'bg-red-500 hover:bg-red-600 text-white',
        (!hasMediaSupport || isLoading) && 'opacity-50 cursor-not-allowed',
      ]"
      :title="isMicrophoneOn ? 'Mute microphone' : 'Unmute microphone'"
      :aria-label="isMicrophoneOn ? 'Mute microphone' : 'Unmute microphone'"
      :aria-pressed="isMicrophoneOn"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          v-if="isMicrophoneOn"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
        />
        <g v-else>
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
          />
          <line x1="4" y1="4" x2="20" y2="20" stroke-width="2" stroke-linecap="round" />
        </g>
      </svg>
      <span class="text-sm font-medium">
        {{ isMicrophoneOn ? 'Mute' : 'Unmute' }}
      </span>
    </button>

    <!-- Screen Share Control -->
    <button
      @click="toggleScreenShare"
      :disabled="!hasScreenShareSupport"
      :class="[
        'flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isScreenSharing
          ? 'bg-blue-500 hover:bg-blue-600 text-white'
          : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground',
        !hasScreenShareSupport && 'opacity-50 cursor-not-allowed',
      ]"
      :title="isScreenSharing ? 'Stop sharing screen' : 'Share screen'"
      :aria-label="isScreenSharing ? 'Stop sharing screen' : 'Share screen'"
      :aria-pressed="isScreenSharing"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
      <span class="text-sm font-medium">
        {{ isScreenSharing ? 'Stop Share' : 'Share Screen' }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useWebRTC } from '../model/useWebRTC'
import VoiceAnimation from './VoiceAnimation.vue'
import { useNotifications } from '@/shared/composables/useNotifications'

interface Props {
  roomId: string
}

const props = defineProps<Props>()

const { mediaState, toggleCamera, toggleMicrophone, toggleScreenShare, getAudioStream } = useWebRTC(
  props.roomId,
)
const { showError } = useNotifications()

const hasMediaSupport = ref(true)
const hasScreenShareSupport = ref(true)
const isLoading = ref(false)

// Check device support on mount
onMounted(async () => {
  try {
    // Check if media APIs are available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      hasMediaSupport.value = false
    } else {
      hasMediaSupport.value = true
    }

    // Check screen sharing support
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === 'function') {
      hasScreenShareSupport.value = true
    } else {
      hasScreenShareSupport.value = false
    }
  } catch {
    hasMediaSupport.value = false
    hasScreenShareSupport.value = false
  }
})

const handleToggleCamera = async () => {
  try {
    isLoading.value = true
    await toggleCamera()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      showError({
        title: 'Camera Access Denied',
        description: 'Please allow camera access in your browser settings.',
      })
    } else if (error instanceof DOMException && error.name === 'NotFoundError') {
      showError({
        title: 'No Camera Found',
        description: 'Please connect a camera and try again.',
      })
    } else {
      showError({
        title: 'Camera Error',
        description: 'Failed to access camera. Please try again.',
      })
    }
  } finally {
    isLoading.value = false
  }
}

const handleToggleMicrophone = async () => {
  try {
    isLoading.value = true
    await toggleMicrophone()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      showError({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access in your browser settings.',
      })
    } else if (error instanceof DOMException && error.name === 'NotFoundError') {
      showError({
        title: 'No Microphone Found',
        description: 'Please connect a microphone and try again.',
      })
    } else {
      showError({
        title: 'Microphone Error',
        description: 'Failed to access microphone. Please try again.',
      })
    }
  } finally {
    isLoading.value = false
  }
}

const isCameraOn = computed(() => mediaState.value.isCameraOn)
const isMicrophoneOn = computed(() => mediaState.value.isMicrophoneOn)
const isScreenSharing = computed(() => mediaState.value.isScreenSharing)
</script>
