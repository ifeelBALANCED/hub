<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGoogleAuth } from '@/shared/composables/useAuth'
import { notificationService } from '@/shared/services/notification.service'

const route = useRoute()
const router = useRouter()
const googleAuthMutation = useGoogleAuth()

const handleOAuthCallback = async () => {
  const code = route.query.code as string
  const error = route.query.error as string

  if (error) {
    notificationService.error({ title: 'OAuth Error', description: error })
    router.push({ name: 'get-started' })
    return
  }

  if (!code) {
    notificationService.error({ title: 'Invalid OAuth callback' })
    router.push({ name: 'get-started' })
    return
  }

  try {
    await googleAuthMutation.mutateAsync({ code })
    router.push({ name: 'home' })
  } catch (error) {
    notificationService.error({ title: 'Google authentication failed' })
    router.push({ name: 'get-started' })
  }
}

onMounted(() => {
  handleOAuthCallback()
})
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
      <p class="text-foreground-muted">Completing Google authentication...</p>
    </div>
  </div>
</template>
