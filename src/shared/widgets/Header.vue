<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { Settings, Users, MessageSquare, ArrowLeft, LogOut } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'
import ThemeToggle from '@/shared/ui/additionals/ThemeToggle.vue'
import { useAuthSession, useLogout } from '@/shared/composables/useAuth'

const router = useRouter()
const route = useRoute()
const authSession = useAuthSession()
const logoutMutation = useLogout()

const roomId = route.params.roomId as string

const goHome = () => {
  router.push('/')
}

const goToSignIn = () => {
  router.push({ name: 'sign-in' })
}

const handleLogout = () => {
  logoutMutation.mutate()
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

      <div v-if="!authSession.isAuthenticated" class="flex items-center space-x-2">
        <HubButton variant="outline" size="sm" @click="goToSignIn"> Sign In </HubButton>
      </div>

      <div
        v-if="authSession.isAuthenticated"
        class="flex items-center space-x-3 pl-3 border-l border-border text-sm text-foreground"
      >
        <div class="flex flex-col leading-tight">
          <span class="font-semibold">{{ authSession.userDisplayName }}</span>
          <span class="text-xs text-foreground-muted">{{ authSession.userEmail }}</span>
        </div>
        <HubButton
          variant="ghost"
          size="icon-sm"
          class="hover:text-destructive"
          :disabled="authSession.isAuthenticating"
          @click="handleLogout"
        >
          <LogOut class="h-4 w-4" />
        </HubButton>
      </div>
    </div>
  </header>
</template>
