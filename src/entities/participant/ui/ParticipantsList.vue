<template>
  <div class="space-y-3">
    <div v-if="isLoading" class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="flex items-center space-x-3 p-3 bg-muted rounded-lg animate-pulse"
      >
        <div class="w-10 h-10 bg-muted-foreground/20 rounded-full"></div>
        <div class="flex-1">
          <div class="h-4 bg-muted-foreground/20 rounded w-1/3 mb-2"></div>
          <div class="h-3 bg-muted-foreground/10 rounded w-1/4"></div>
        </div>
      </div>
    </div>

    <div v-else-if="participants.length > 0" class="space-y-2">
      <div
        v-for="participant in participants"
        :key="participant.id"
        class="flex items-center space-x-3 p-3 bg-card border rounded-lg hover:bg-accent/50 transition-colors"
        :aria-label="`Participant: ${participant.name}`"
      >
        <div class="relative">
          <div
            class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold"
          >
            {{ participant?.name?.charAt(0).toUpperCase() }}
          </div>
          <div
            class="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full"
          ></div>
        </div>

        <div class="flex-1 min-w-0">
          <p class="font-medium truncate">{{ participant.name || 'Unknown User' }}</p>
          <p class="text-sm text-muted-foreground">
            Joined {{ formatTime(participant.joined_at) }}
          </p>
        </div>

        <div
          v-if="participant.role"
          class="px-2 py-1 text-xs font-medium rounded-full"
          :class="
            participant.role === 'host'
              ? 'bg-primary/10 text-primary'
              : 'bg-muted text-muted-foreground'
          "
        >
          {{ participant.role }}
        </div>
      </div>
    </div>

    <div v-else class="text-center py-8">
      <div class="text-muted-foreground mb-2">
        <svg
          class="w-12 h-12 mx-auto mb-2 opacity-50"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          ></path>
        </svg>
      </div>
      <p class="text-muted-foreground">No participants yet</p>
      <p class="text-sm text-muted-foreground mt-1">Share the room link to invite others</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Participant } from '../types'

interface Props {
  participants: Participant[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
