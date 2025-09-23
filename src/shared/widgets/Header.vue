<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Settings, Users, MessageSquare, ArrowLeft } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'

const router = useRouter()
const route = useRoute()

const roomId = computed(() => route.params.roomId as string)

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <header
    class="flex items-center justify-between p-4 bg-background-secondary border-b border-border"
  >
    <div class="flex items-center space-x-4">
      <HubButton variant="ghost" size="icon" class="hover:bg-background-tertiary" @click="goHome">
        <ArrowLeft class="h-4 w-4" />
      </HubButton>

      <div class="flex items-center space-x-2">
        <div class="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
          <span class="text-primary-foreground font-bold text-lg">H</span>
        </div>
        <span class="text-xl font-semibold text-foreground">Hub</span>
      </div>

      <div class="text-foreground-muted text-sm">
        {{ roomId ? `Room: ${roomId}` : 'Meeting Room' }}
      </div>
    </div>

    <div class="flex items-center space-x-2">
      <HubButton variant="control" size="icon">
        <Users class="h-4 w-4" />
      </HubButton>
      <HubButton variant="control" size="icon">
        <MessageSquare class="h-4 w-4" />
      </HubButton>
      <HubButton variant="control" size="icon">
        <Settings class="h-4 w-4" />
      </HubButton>
    </div>
  </header>
</template>
