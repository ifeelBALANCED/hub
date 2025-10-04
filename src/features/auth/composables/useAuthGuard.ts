import { computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from './useAuth'

export type AuthGuardMode = 'requireAuth' | 'requireGuest' | 'optional'

interface UseAuthGuardOptions {
  mode?: AuthGuardMode
  redirectTo?: string
  onUnauthorized?: () => void
  onAuthorized?: () => void
}

export const useAuthGuard = (options: UseAuthGuardOptions = {}) => {
  const { mode = 'requireAuth', redirectTo, onUnauthorized, onAuthorized } = options

  const router = useRouter()
  const route = useRoute()
  const auth = useAuth()

  const shouldRequireAuth = computed(() => mode === 'requireAuth' && !auth.isAuthenticated.value)
  const shouldRequireGuest = computed(() => mode === 'requireGuest' && auth.isAuthenticated.value)

  const isAuthorized = computed(() => {
    switch (mode) {
      case 'requireAuth':
        return auth.isAuthenticated.value
      case 'requireGuest':
        return !auth.isAuthenticated.value
      case 'optional':
        return true
      default:
        return false
    }
  })

  const redirect = () => {
    if (!redirectTo) return

    if (shouldRequireAuth.value) {
      const returnUrl = encodeURIComponent(route.fullPath)
      router.push(`${redirectTo}?redirect=${returnUrl}`)
    } else if (shouldRequireGuest.value) {
      router.push(redirectTo)
    }
  }

  const handleAuthStateChange = () => {
    if (auth.isLoading.value) return

    if (!isAuthorized.value) {
      onUnauthorized?.()
      redirect()
    } else {
      onAuthorized?.()
    }
  }

  watch(() => auth.isAuthenticated.value, handleAuthStateChange, { immediate: true })
  watch(() => auth.isLoading.value, handleAuthStateChange)

  onMounted(() => {
    setTimeout(() => {
      handleAuthStateChange()
    }, 0)
  })

  return {
    isAuthorized,
    isLoading: computed(() => auth.isLoading.value || auth.isUserLoading.value),
    redirect,
    requireAuth: auth.requireAuth,
    requireGuest: auth.requireGuest,
  }
}
