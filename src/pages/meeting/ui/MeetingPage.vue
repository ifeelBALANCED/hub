<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20"
  >
    <div v-if="connectionStatus === 'connecting'" class="text-center max-w-md mx-auto p-8">
      <div class="relative mb-8">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 mx-auto"></div>
        <div
          class="absolute inset-0 animate-spin rounded-full h-16 w-16 border-t-4 border-primary mx-auto"
        ></div>
      </div>

      <div class="space-y-3">
        <h2 class="text-2xl font-semibold text-foreground">Connecting to Meeting</h2>
        <p class="text-muted-foreground">
          Establishing secure connection...
          <span v-if="reconnectAttempt > 0" class="block text-sm mt-1">
            Attempt {{ reconnectAttempt + 1 }}
          </span>
        </p>

        <div class="flex justify-center space-x-1 mt-4">
          <div class="w-2 h-2 bg-primary/60 rounded-full animate-pulse"></div>
          <div
            class="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
            style="animation-delay: 0.1s"
          ></div>
          <div
            class="w-2 h-2 bg-primary/60 rounded-full animate-pulse"
            style="animation-delay: 0.2s"
          ></div>
        </div>
      </div>
    </div>

    <div v-else-if="connectionStatus === 'connected'" class="w-full max-w-4xl mx-auto p-6">
      <div class="bg-card border rounded-xl shadow-sm p-6">
        <div class="flex items-center justify-between mb-8">
          <div class="flex items-center gap-3">
            <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <h1 class="text-2xl font-bold text-foreground">Meeting Room</h1>
          </div>
          <div class="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
            <svg
              class="w-3 h-3 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              ></path>
            </svg>
            <span class="text-sm text-muted-foreground font-mono">{{ roomId }}</span>
          </div>
        </div>

        <div class="space-y-6">
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold text-foreground">
                Participants ({{ participants.participantsCount.value }})
              </h2>
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                Live
              </div>
            </div>

            <ParticipantsList
              :participants="participants.sortedParticipants.value"
              :is-loading="false"
            />

            <div v-if="participants.participants.value.length === 0" class="text-center py-12">
              <div
                class="w-16 h-16 mx-auto mb-4 bg-muted/50 rounded-full flex items-center justify-center"
              >
                <svg
                  class="w-8 h-8 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  ></path>
                </svg>
              </div>
              <p class="text-muted-foreground font-medium">Waiting for participants...</p>
              <p class="text-sm text-muted-foreground mt-1">Share the room ID to invite others</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center max-w-lg mx-auto p-8">
      <div class="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
        <div class="text-destructive mb-4 flex justify-center">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            ></path>
          </svg>
        </div>

        <h2 class="text-xl font-semibold mb-3 text-destructive">Connection Failed</h2>
        <p class="text-muted-foreground mb-6">
          {{ error || 'Unable to connect to the meeting room' }}
        </p>

        <button
          @click="retryConnection"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-200 font-medium"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Retry Connection
        </button>
      </div>

      <div class="bg-muted/50 border rounded-lg p-4 text-left">
        <h3 class="font-medium mb-2 text-sm">Troubleshooting:</h3>
        <ul class="text-xs text-muted-foreground space-y-1">
          <li>• Check your internet connection</li>
          <li>• Ensure you're logged in with valid credentials</li>
          <li>• Verify the meeting room exists and is active</li>
          <li>• Check if WebSocket connections are allowed</li>
          <li>• Try refreshing the page if issues persist</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MeetingPage',
})

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMeetingConnection } from '@/features/meeting-connection'
import { useParticipants, ParticipantsList } from '@/entities/participant'

const route = useRoute()
const { connectionStatus, error, reconnectAttempt, close, backoff } = useMeetingConnection()
const roomId = computed(() => route.params.roomId as string)
const participants = useParticipants(roomId.value)

const retryConnection = () => {
  close()
}
</script>
