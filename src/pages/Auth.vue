<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { AuthForm, useAuthGuard } from '@/features/auth'
import LoadingSpinner from '@/shared/ui/additionals/spinner/LoadingSpinner.vue'
import { Video } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const authGuard = useAuthGuard({
  mode: 'requireGuest',
  redirectTo: '/dashboard',
})

const isSignUp = computed(() => route.query.signup === 'true')

const handleAuthSuccess = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div v-if="authGuard.isLoading.value" class="flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>

    <div v-else class="w-full max-w-md">
      <div class="mb-8 text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2 font-semibold text-2xl">
          <Video class="h-8 w-8 text-primary" />
          <span>Hub</span>
        </RouterLink>
      </div>

      <AuthForm :mode="isSignUp ? 'register' : 'login'" @success="handleAuthSuccess" />
    </div>
  </div>
</template>
