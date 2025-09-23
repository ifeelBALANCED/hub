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
  <div class="fixed bottom-0 left-0 right-0 bg-background-secondary border-t border-border">
    <div class="flex items-center justify-center p-6">
      <div class="flex items-center space-x-3">
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

        <div class="w-px h-8 bg-border mx-2" />

        <HubButton variant="control" size="icon-lg" class="shadow-soft">
          <Camera class="h-5 w-5" />
        </HubButton>

        <HubButton variant="control" size="icon-lg" class="shadow-soft">
          <Volume2 class="h-5 w-5" />
        </HubButton>

        <HubButton variant="control" size="icon-lg" class="shadow-soft">
          <Settings class="h-5 w-5" />
        </HubButton>

        <div class="w-px h-8 bg-border mx-2" />

        <HubButton variant="danger" size="icon-lg" class="shadow-soft">
          <Phone class="h-5 w-5 rotate-[135deg]" />
        </HubButton>
      </div>
    </div>
  </div>
</template>
