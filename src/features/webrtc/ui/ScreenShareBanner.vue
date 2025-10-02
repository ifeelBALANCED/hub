<template>
  <div
    v-if="isScreenSharing"
    class="flex-shrink-0 w-full z-50 bg-primary/95 backdrop-blur-sm text-primary-foreground shadow-lg animate-in slide-in-from-top duration-300"
  >
    <div class="max-w-[2000px] mx-auto px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-primary-foreground/20 rounded-lg">
          <svg class="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" fill="currentColor" />
          </svg>
          <span class="text-sm font-medium">You are presenting</span>
        </div>

        <div
          v-if="screenShareType"
          class="text-xs text-primary-foreground/80 flex items-center gap-1.5"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="screenShareType === 'screen'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
            <path
              v-else-if="screenShareType === 'window'"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <span>
            {{
              screenShareType === 'screen'
                ? 'Entire screen'
                : screenShareType === 'window'
                  ? 'Window'
                  : 'Browser tab'
            }}
          </span>
        </div>
      </div>

      <button
        @click="handleStopSharing"
        class="flex items-center gap-2 px-4 py-2 bg-primary-foreground text-primary rounded-lg hover:bg-primary-foreground/90 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
        Stop Presenting
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWebRTC } from '../model/useWebRTC'

interface Props {
  roomId: string
}

const props = defineProps<Props>()

const { mediaState, toggleScreenShare } = useWebRTC(props.roomId)

const isScreenSharing = computed(() => mediaState.value.isScreenSharing)
const screenShareType = computed(() => mediaState.value.screenShareType)

const handleStopSharing = async () => {
  await toggleScreenShare()
}
</script>
