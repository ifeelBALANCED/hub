<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateRoom } from '../lib/useCreateRoom'
import { ArrowRight } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'

const router = useRouter()
const { createRoom, isCreating, error } = useCreateRoom()

const isLoading = computed(() => isCreating.value)
const canCreateRoom = computed(() => !isLoading.value && !error.value)
const hasError = computed(() => Boolean(error.value))

async function handleCreateRoom() {
  if (!canCreateRoom.value) return

  try {
    const result = await createRoom()
    if (result?.room_id) {
      emit('roomCreated', result.room_id)
      router.push({
        name: 'meeting-details',
        params: { roomId: result.room_id },
      })
    }
  } catch (err) {}
}

const emit = defineEmits<{
  startMeeting: []
  roomCreated: [roomId: string]
  error: [error: string]
}>()

watch(isCreating, (newValue) => {
  if (newValue) {
    emit('startMeeting')
  }
})

watch(error, (newError) => {
  if (newError) {
    emit('error', newError)
  }
})
</script>

<template>
  <div class="space-y-3">
    <div v-if="hasError" class="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
      <p class="text-sm text-destructive">{{ error }}</p>
    </div>

    <HubButton
      :variant="isCreating ? 'secondary' : 'hero'"
      :size="isCreating ? 'default' : 'lg'"
      :disabled="isCreating"
      class="w-full text-lg px-8 transition-all duration-200 relative"
      @click="handleCreateRoom"
    >
      <span v-if="isCreating" class="flex items-center justify-center gap-2">
        <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Creating Room...
      </span>
      <span v-else class="flex items-center justify-center gap-2">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          ></path>
        </svg>
        Start Meeting
        <ArrowRight class="h-5 w-5" />
      </span>
    </HubButton>

    <div v-if="isCreating" class="space-y-2">
      <div class="w-full bg-muted rounded-full h-2">
        <div
          class="bg-primary h-2 rounded-full transition-all duration-300 ease-out animate-pulse"
          style="width: 60%"
        ></div>
      </div>
      <p class="text-sm text-muted-foreground text-center">Setting up your meeting room...</p>
    </div>
  </div>
</template>
