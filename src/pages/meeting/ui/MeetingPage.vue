<template>
  <MeetingPreview v-if="showPreview" :room-id="roomId" @cancel="handleCancel" @join="handleJoin" />

  <div v-else class="h-screen flex flex-col bg-background overflow-hidden">
    <ScreenShareBanner :room-id="roomId" />

    <div
      v-if="error"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div
        class="bg-card border rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 space-y-6 animate-in fade-in zoom-in duration-200"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex-shrink-0 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-foreground mb-2">Connection Error</h3>
            <p class="text-sm text-muted-foreground">{{ error }}</p>

            <div
              v-if="reconnectAttempt > 0"
              class="mt-3 flex items-center gap-2 text-xs text-muted-foreground"
            >
              <div
                class="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"
              ></div>
              <span>Reconnecting (attempt {{ reconnectAttempt }})...</span>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            @click="retryConnection"
            class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Retry Connection
          </button>
          <button
            @click="handleLeave"
            class="flex-1 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors font-medium"
          >
            Leave Meeting
          </button>
        </div>
      </div>
    </div>

    <div class="flex-shrink-0 bg-card/50 backdrop-blur-md border-b px-4 sm:px-6 py-3">
      <div class="flex items-center justify-between max-w-[2000px] mx-auto">
        <div class="flex items-center gap-2 sm:gap-3">
          <div
            :class="[
              'w-2 h-2 rounded-full transition-colors',
              isConnected
                ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]'
                : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]',
            ]"
          ></div>
          <span class="text-xs sm:text-sm font-medium">
            {{ isConnected ? 'Connected' : 'Reconnecting...' }}
          </span>

          <div
            v-if="isRetrying"
            class="hidden sm:flex items-center gap-2 ml-2 px-2 py-1 bg-muted/50 rounded-md"
          >
            <div
              class="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full"
            ></div>
            <span class="text-xs text-muted-foreground"> {{ nextRetryDelay }}s </span>
          </div>
        </div>

        <div class="flex items-center gap-2 sm:gap-3">
          <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg border">
            <svg
              class="w-3.5 h-3.5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              ></path>
            </svg>
            <span class="text-xs font-mono text-muted-foreground">{{ truncatedRoomId }}</span>
          </div>
          <button
            @click="copyRoomLink"
            :class="[
              'flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-200 text-xs font-medium shadow-sm',
              linkCopied
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:bg-primary/90',
            ]"
            :title="linkCopied ? 'Link copied!' : 'Copy meeting link'"
          >
            <svg
              v-if="linkCopied"
              class="h-3.5 w-3.5"
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
            <svg v-else class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <span class="hidden sm:inline">{{ linkCopied ? 'Copied!' : 'Copy' }}</span>
          </button>

          <button
            @click="handleLeave"
            class="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-all duration-200 text-xs sm:text-sm font-semibold shadow-sm hover:shadow"
            title="Leave meeting"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            <span class="hidden sm:inline">Leave</span>
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-hidden">
      <VideoGrid :key="`video-grid-${isScreenSharing ? 'sharing' : 'normal'}`" :room-id="roomId">
        <template #controls>
          <div
            class="bg-card/95 backdrop-blur-md border border-border rounded-2xl shadow-2xl px-4 py-3"
          >
            <MediaControls :room-id="roomId" />
          </div>
        </template>
      </VideoGrid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMeetingConnection, MeetingPreview } from '@/features/meeting-connection'
import { useParticipants } from '@/entities/participant'
import { useUser } from '@/entities/user'
import {
  useWebRTC,
  useKeyboardShortcuts,
  useMediaStateRestore,
  MediaControls,
  VideoGrid,
  ScreenShareBanner,
} from '@/features/webrtc'
import { useClipboard } from '@/shared/composables/useClipboard'

const router = useRouter()
const route = useRoute()
const { connectionStatus, error, reconnectAttempt, close, backoff } = useMeetingConnection()
const { user, userDisplayName } = useUser()

const roomId = computed(() => route.params.roomId as string)
const participants = useParticipants(roomId.value)
const { mediaState, toggleCamera, toggleMicrophone, toggleScreenShare } = useWebRTC(roomId.value)

const showPreview = ref(true)

const { copy: copyToClipboard, copied: linkCopied } = useClipboard()

const isConnected = computed(() => connectionStatus.value === 'connected')
const isRetrying = computed(() => reconnectAttempt.value > 0)
const nextRetryDelay = computed(() => (backoff ? Math.ceil(backoff.calculateDelay() / 1000) : 0))
const isScreenSharing = computed(() => mediaState.value.isScreenSharing)
const truncatedRoomId = computed(() => {
  const id = roomId.value
  return id.length <= 12 ? id : `${id.slice(0, 8)}...${id.slice(-4)}`
})

const handleCancel = () => {
  router.push({ name: 'home' })
}

const handleJoin = () => {
  showPreview.value = false
}

const copyRoomLink = () => {
  const meetingUrl = `${window.location.origin}/meeting/${roomId.value}`
  copyToClipboard(meetingUrl)
}

const handleLeave = () => {
  close()
  router.push({ name: 'home' })
}

const retryConnection = () => {
  close()
}

useKeyboardShortcuts({
  onToggleMicrophone: toggleMicrophone,
  onToggleCamera: toggleCamera,
  onToggleScreenShare: toggleScreenShare,
  onLeave: handleLeave,
})

useMediaStateRestore({
  roomId: roomId.value,
  mediaState,
  toggleCamera,
  toggleMicrophone,
  debug: false,
})
</script>
