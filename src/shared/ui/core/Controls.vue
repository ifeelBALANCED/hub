<script setup lang="ts">
import { ref } from 'vue'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  Phone,
  Settings,
  Camera,
  Volume2,
} from 'lucide-vue-next'
import HubButton from './HubButton.vue'

const isAudioOn = ref(true)
const isVideoOn = ref(true)
const isScreenSharing = ref(false)

const toggleAudio = () => {
  isAudioOn.value = !isAudioOn.value
}

const toggleVideo = () => {
  isVideoOn.value = !isVideoOn.value
}

const toggleScreenShare = () => {
  isScreenSharing.value = !isScreenSharing.value
}
</script>

<template>
  <div
    class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background-secondary/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg"
  >
    <div class="flex items-center justify-center p-4">
      <div class="flex items-center space-x-2">
        <HubButton
          :variant="isAudioOn ? 'control' : 'danger'"
          size="icon-lg"
          class="shadow-soft"
          @click="toggleAudio"
        >
          <Mic v-if="isAudioOn" class="h-5 w-5" />
          <MicOff v-else class="h-5 w-5" />
        </HubButton>

        <HubButton
          :variant="isVideoOn ? 'control' : 'danger'"
          size="icon-lg"
          class="shadow-soft"
          @click="toggleVideo"
        >
          <Video v-if="isVideoOn" class="h-5 w-5" />
          <VideoOff v-else class="h-5 w-5" />
        </HubButton>

        <HubButton
          :variant="isScreenSharing ? 'success' : 'control'"
          size="icon-lg"
          class="shadow-soft"
          @click="toggleScreenShare"
        >
          <Monitor class="h-5 w-5" />
        </HubButton>

        <div class="w-px h-6 bg-border mx-1" />

        <HubButton variant="control" size="icon-lg" class="shadow-soft">
          <Camera class="h-5 w-5" />
        </HubButton>

        <HubButton variant="control" size="icon-lg" class="shadow-soft">
          <Volume2 class="h-5 w-5" />
        </HubButton>

        <HubButton variant="control" size="icon-lg" class="shadow-soft">
          <Settings class="h-5 w-5" />
        </HubButton>

        <div class="w-px h-6 bg-border mx-1" />

        <HubButton variant="danger" size="icon-lg" class="shadow-soft">
          <Phone class="h-5 w-5 rotate-[135deg]" />
        </HubButton>
      </div>
    </div>
  </div>
</template>
