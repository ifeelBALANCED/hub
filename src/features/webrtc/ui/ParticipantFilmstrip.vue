<template>
  <div
    class="flex gap-2 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent px-2 py-2"
    :class="vertical ? 'flex-col h-full' : 'flex-row w-full'"
  >
    <div
      v-for="participant in participants"
      :key="participant.id"
      class="relative flex-shrink-0 bg-muted rounded-lg overflow-hidden transition-all duration-200 hover:scale-105"
      :class="vertical ? 'w-full aspect-video' : 'h-20 aspect-video'"
      :style="{ minWidth: vertical ? 'auto' : '140px', maxWidth: vertical ? 'auto' : '200px' }"
    >
      <ActiveSpeakerRing
        :is-active="participant.isSpeaking || false"
        :intensity="participant.audioLevel || 0.8"
      />

      <video
        v-if="participant.stream && participant.hasVideo"
        :ref="(el) => setVideoRef(participant.id, el)"
        autoplay
        playsinline
        :muted="participant.isLocal"
        class="w-full h-full object-cover"
      />

      <div
        v-else
        class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5"
      >
        <div
          class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold"
        >
          {{ participant.initials }}
        </div>
      </div>

      <div
        class="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded flex items-center gap-1"
      >
        <span class="truncate max-w-[100px]">{{ participant.name }}</span>
        <svg
          v-if="!participant.isMicrophoneOn"
          class="w-2.5 h-2.5 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
          <line x1="1" y1="1" x2="23" y2="23" stroke-width="2" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ActiveSpeakerRing from './ActiveSpeakerRing.vue'

interface Participant {
  id: string
  name: string
  initials: string
  stream: MediaStream | null
  hasVideo: boolean
  isMicrophoneOn: boolean
  isLocal: boolean
  isSpeaking?: boolean
  audioLevel?: number
}

interface Props {
  participants: Participant[]
  vertical?: boolean
}

const props = defineProps<Props>()

const videoRefs = ref<Map<string, HTMLVideoElement>>(new Map())

const setVideoRef = (participantId: string, element: any) => {
  if (element && element.tagName === 'VIDEO') {
    videoRefs.value.set(participantId, element)
    const participant = props.participants.find((p) => p.id === participantId)
    if (participant?.stream) {
      element.srcObject = participant.stream
    }
  } else {
    videoRefs.value.delete(participantId)
  }
}
</script>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: hsl(var(--muted));
  border-radius: 3px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.5);
}
</style>
