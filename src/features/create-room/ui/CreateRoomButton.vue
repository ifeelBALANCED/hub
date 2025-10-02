<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCreateRoom } from '../lib/useCreateRoom'
import { useUser } from '@/entities/user'
import { ArrowRight, Video, Loader2 } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'

const router = useRouter()
const { createRoom, isCreating } = useCreateRoom()
const { isAuthenticated } = useUser()

const canCreate = computed(() => !isCreating.value && isAuthenticated)

const handleCreate = async () => {
  if (!canCreate.value) return

  const result = await createRoom()
  if (result?.room_id) {
    router.push({
      name: 'meeting-details',
      params: { roomId: result.room_id },
    })
  }
}
</script>

<template>
  <HubButton
    :variant="isCreating ? 'secondary' : 'hero'"
    :size="'lg'"
    :disabled="!canCreate"
    class="text-lg px-8 transition-all duration-200 w-fit"
    @click="handleCreate"
  >
    <span v-if="isCreating" class="flex items-center justify-center gap-2">
      <Loader2 class="h-5 w-5 animate-spin" />
      Creating Room...
    </span>
    <span v-else class="flex items-center justify-center gap-2">
      <Video class="h-5 w-5" />
      Start Meeting
      <ArrowRight class="h-5 w-5" />
    </span>
  </HubButton>
</template>
