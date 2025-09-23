<script setup lang="ts">
import { Mic, MicOff, Video, VideoOff, User } from 'lucide-vue-next'
import { cn } from '@/shared/lib/cn'

interface Participant {
  id: string
  name: string
  isVideoOn: boolean
  isAudioOn: boolean
  isMe?: boolean
}

defineProps<{
  participant: Participant
}>()
</script>

<template>
  <div
    :class="
      cn(
        'relative bg-background-tertiary rounded-lg overflow-hidden shadow-soft',
        'border border-border hover:border-accent/30 transition-all duration-200',
        participant.isMe && 'ring-2 ring-primary/30',
      )
    "
  >
    <div
      v-if="participant.isVideoOn"
      class="aspect-video bg-gradient-secondary flex items-center justify-center relative"
    >
      <div class="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
        <User class="h-6 w-6 text-accent" />
      </div>
    </div>
    <div
      v-else
      class="aspect-video bg-background-secondary flex items-center justify-center relative"
    >
      <div class="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
        <User class="h-6 w-6 text-foreground-muted" />
      </div>
    </div>

    <div class="absolute bottom-3 left-3 flex items-center space-x-2">
      <div class="flex items-center space-x-1">
        <Mic v-if="participant.isAudioOn" class="h-3 w-3 text-success" />
        <MicOff v-else class="h-3 w-3 text-destructive" />

        <Video v-if="participant.isVideoOn" class="h-3 w-3 text-success" />
        <VideoOff v-else class="h-3 w-3 text-destructive" />
      </div>
    </div>

    <div class="absolute bottom-3 right-3">
      <span
        class="text-xs font-medium text-foreground bg-background/80 px-2 py-1 rounded backdrop-blur-sm"
      >
        {{ participant.name }}
      </span>
    </div>
  </div>
</template>
