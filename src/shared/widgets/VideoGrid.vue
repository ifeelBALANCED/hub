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
]
</script>

<template>
  <div class="flex-1 p-6">
    <div class="grid grid-cols-2 gap-4 h-full max-h-[calc(100vh-200px)]">
      <VideoTile
        v-for="participant in mockParticipants"
        :key="participant.id"
        :participant="participant"
      />
    </div>
  </div>
</template>
