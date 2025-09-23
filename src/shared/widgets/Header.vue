<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Settings, Users, MessageSquare, ArrowLeft } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'
import ThemeToggle from '@/shared/ui/additionals/ThemeToggle.vue'

const router = useRouter()
const route = useRoute()

const roomId = computed(() => route.params.roomId as string)

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <header
    class="flex items-center justify-between p-3 md:p-4 bg-background-secondary border-b border-border"
  >
    <div class="flex items-center space-x-4">
      <HubButton variant="ghost" size="icon" class="hover:bg-background-tertiary" @click="goHome">
        <ArrowLeft class="h-4 w-4" />
      </HubButton>

      <div class="flex items-center space-x-2">
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
      <div class="w-px h-8 bg-border mx-2"></div>
      <ThemeToggle class="hover:bg-background-tertiary" />
    </div>
  </header>
</template>
