<script setup lang="ts">
import VideoTile from '@/shared/ui/core/VideoTitle.vue'

interface Participant {
  id: string
  name: string
  isVideoOn: boolean
  isAudioOn: boolean
  isMe?: boolean
}

const mockParticipants: Participant[] = [
  { id: '1', name: 'You', isVideoOn: true, isAudioOn: true, isMe: true },
  { id: '2', name: 'Alex Thompson', isVideoOn: true, isAudioOn: true },
  { id: '3', name: 'Sarah Chen', isVideoOn: false, isAudioOn: true },
  { id: '4', name: 'Mike Rodriguez', isVideoOn: true, isAudioOn: false },
  { id: '5', name: 'Emma Wilson', isVideoOn: true, isAudioOn: true },
  { id: '6', name: 'David Kim', isVideoOn: false, isAudioOn: false },
]
</script>

<template>
  <div class="flex-1 p-4 overflow-hidden">
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-2 md:gap-3 h-full max-h-[calc(100vh-140px)] auto-rows-fr"
    >
      <VideoTile
        v-for="participant in mockParticipants"
        :key="participant.id"
        :participant="participant"
      />
    </div>
  </div>
</template>
