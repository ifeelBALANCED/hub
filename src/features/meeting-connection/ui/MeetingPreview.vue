<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6"
  >
    <div class="w-full max-w-4xl space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-foreground">Ready to join?</h1>
        <p class="text-muted-foreground">Check your camera and microphone before joining</p>
      </div>

      <!-- Preview Card -->
      <div class="bg-card border rounded-xl shadow-lg p-6 space-y-6">
        <!-- Video Preview -->
        <div class="relative bg-muted rounded-lg overflow-hidden aspect-video">
          <video
            v-if="isCameraOn && localStream"
            ref="previewVideoRef"
            autoplay
            muted
            playsinline
            class="w-full h-full object-cover"
          />
          <div
            v-else
            class="w-full h-full flex flex-col items-center justify-center text-muted-foreground"
          >
            <div
              class="w-20 h-20 bg-muted-foreground/10 rounded-full flex items-center justify-center mb-4"
            >
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p class="text-sm font-medium">{{ userDisplayName }}</p>
            <p class="text-xs mt-1">Camera is off</p>
          </div>

          <!-- Voice Animation Overlay -->
          <div v-if="isMicrophoneOn" class="absolute bottom-4 left-4">
            <VoiceAnimation :is-microphone-on="isMicrophoneOn" :audio-stream="getAudioStream()" />
          </div>
        </div>

        <!-- Permission Error Alert -->
        <div
          v-if="permissionError"
          class="bg-destructive/10 border border-destructive/20 rounded-lg p-4 space-y-3"
        >
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-destructive flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div class="flex-1">
              <p class="text-sm font-semibold text-destructive">Permission Blocked</p>
              <p class="text-sm text-muted-foreground mt-1">{{ permissionError }}</p>
            </div>
            <button
              @click="permissionError = null"
              class="text-muted-foreground hover:text-foreground transition-colors"
              title="Close"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Instructions to unblock -->
          <div class="bg-background/50 rounded-md p-3 space-y-2">
            <p class="text-xs font-semibold text-foreground">How to unblock permissions:</p>
            <ol class="text-xs text-muted-foreground space-y-1.5 ml-1">
              <li class="flex items-start gap-2">
                <span class="font-semibold text-destructive">1.</span>
                <span>
                  Look for a
                  <svg class="inline w-3 h-3 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  or
                  <svg class="inline w-3 h-3 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  icon in your browser's <strong>address bar</strong> (top left)
                </span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-semibold text-destructive">2.</span>
                <span
                  >Click it and find <strong>Camera</strong> and
                  <strong>Microphone</strong> settings</span
                >
              </li>
              <li class="flex items-start gap-2">
                <span class="font-semibold text-destructive">3.</span>
                <span>Change from <strong>"Blocked"</strong> to <strong>"Allow"</strong></span>
              </li>
              <li class="flex items-start gap-2">
                <span class="font-semibold text-destructive">4.</span>
                <span><strong>Refresh this page</strong> and try again</span>
              </li>
            </ol>
            <button
              @click="reloadPage"
              class="mt-2 flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground text-xs rounded-md hover:bg-primary/90 transition-colors w-full justify-center font-medium"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh page after allowing access
            </button>
          </div>
        </div>

        <!-- Controls -->
        <div class="flex items-center justify-center gap-4">
          <div class="relative">
            <button
              @click="handleToggleCamera"
              :disabled="isLoading"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 min-w-[100px]',
                isCameraOn
                  ? 'bg-card hover:bg-muted/80 text-foreground border'
                  : 'bg-red-500 hover:bg-red-600 text-white',
                isLoading && 'opacity-50 cursor-not-allowed',
              ]"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span class="text-xs font-medium">{{ isCameraOn ? 'Turn off' : 'Turn on' }}</span>
            </button>
            <!-- Permission hint badge -->
            <div
              v-if="!isCameraOn"
              class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm"
              title="Browser will request permission"
            >
              🔓
            </div>
          </div>

          <div class="relative">
            <button
              @click="handleToggleMicrophone"
              :disabled="isLoading"
              :class="[
                'flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 min-w-[100px]',
                isMicrophoneOn
                  ? 'bg-card hover:bg-muted/80 text-foreground border'
                  : 'bg-red-500 hover:bg-red-600 text-white',
                isLoading && 'opacity-50 cursor-not-allowed',
              ]"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <span class="text-xs font-medium">{{ isMicrophoneOn ? 'Mute' : 'Unmute' }}</span>
            </button>
            <!-- Permission hint badge -->
            <div
              v-if="!isMicrophoneOn"
              class="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm"
              title="Browser will request permission"
            >
              🔓
            </div>
          </div>
        </div>

        <!-- Room Info -->
        <div class="bg-muted/50 rounded-lg p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Room ID:</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-mono">{{ truncatedRoomId }}</span>
              <button
                @click="copyRoomId"
                class="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                :title="copied ? 'Copied!' : 'Copy room ID'"
              >
                <svg
                  v-if="copied"
                  class="h-4 w-4 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-xs text-muted-foreground">
            Share this ID with others to invite them to the meeting
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex items-center justify-center gap-4 pt-4">
          <button
            @click="$emit('cancel')"
            class="px-6 py-3 border rounded-lg hover:bg-muted transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            @click="joinMeeting"
            class="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow flex items-center gap-2"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Join now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, toRef } from 'vue'
import { useWebRTC } from '@/features/webrtc'
import { useVideoStream } from '@/features/webrtc/composables/useVideoStream'
import VoiceAnimation from '@/features/webrtc/ui/VoiceAnimation.vue'
import { useUser } from '@/entities/user'
import { useClipboard } from '@/shared/composables/useClipboard'

interface Props {
  roomId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cancel: []
  join: []
}>()

const { user, userDisplayName } = useUser()
const { mediaState, toggleCamera, toggleMicrophone, getAudioStream } = useWebRTC(props.roomId)

const permissionError = ref<string | null>(null)
const isLoading = ref(false)

const isCameraOn = computed(() => mediaState.value.isCameraOn)
const isMicrophoneOn = computed(() => mediaState.value.isMicrophoneOn)
const localStream = computed(() => mediaState.value.localStream)

const truncatedRoomId = computed(() => {
  const id = props.roomId
  if (id.length <= 16) return id
  return `${id.slice(0, 8)}...${id.slice(-4)}`
})

const { videoRef: previewVideoRef } = useVideoStream({
  stream: localStream,
  enabled: isCameraOn,
  debug: false,
})

const { copy: copyToClipboard, copied } = useClipboard({
  onError: () => {
    permissionError.value = 'Failed to copy link. Please copy the Room ID manually.'
  },
})

const copyRoomId = () => {
  const meetingUrl = `${window.location.origin}/meeting/${props.roomId}`
  copyToClipboard(meetingUrl)
}

const handleToggleCamera = async () => {
  try {
    isLoading.value = true
    permissionError.value = null
    await toggleCamera()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      permissionError.value =
        'Camera access denied. Please allow camera access in your browser settings.'
    } else if (error instanceof DOMException && error.name === 'NotFoundError') {
      permissionError.value = 'No camera found. Please connect a camera and try again.'
    } else {
      permissionError.value = 'Failed to access camera. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const handleToggleMicrophone = async () => {
  try {
    isLoading.value = true
    permissionError.value = null
    await toggleMicrophone()
  } catch (error) {
    if (error instanceof DOMException && error.name === 'NotAllowedError') {
      permissionError.value =
        'Microphone access denied. Please allow microphone access in your browser settings.'
    } else if (error instanceof DOMException && error.name === 'NotFoundError') {
      permissionError.value = 'No microphone found. Please connect a microphone and try again.'
    } else {
      permissionError.value = 'Failed to access microphone. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}

const joinMeeting = () => {
  sessionStorage.setItem(
    `meeting-${props.roomId}-media-state`,
    JSON.stringify({
      isCameraOn: isCameraOn.value,
      isMicrophoneOn: isMicrophoneOn.value,
    }),
  )
  emit('join')
}

const reloadPage = () => {
  window.location.reload()
}
</script>
