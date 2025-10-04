import { computed } from 'vue'
import { useAuth } from './useAuth'

const TOKEN_EXPIRY_WARNING_TIME = 5 * 60 * 1000

export const useAuthUtils = () => {
  const auth = useAuth()

  const userDisplayName = computed(
    () => auth.user.value?.displayName || auth.user.value?.email || 'User',
  )

  const userInitials = computed(() => {
    const name = userDisplayName.value
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('')
  })

  const userAvatar = computed(() => auth.user.value?.avatarUrl || null)

  const tokenExpiration = computed(() => {
    if (!auth.tokens.value?.accessTokenExpiresIn) return null
    return new Date(Date.now() + auth.tokens.value.accessTokenExpiresIn * 1000)
  })

  const isTokenExpiringSoon = computed(() => {
    const expiration = tokenExpiration.value
    if (!expiration) return false
    return expiration.getTime() - Date.now() <= TOKEN_EXPIRY_WARNING_TIME
  })

  const authStatus = computed(() => {
    if (auth.isLoading.value) return 'loading'
    if (auth.isAuthenticated.value) return 'authenticated'
    return 'unauthenticated'
  })

  const canAccessProtectedRoute = computed(
    () => auth.isAuthenticated.value && !auth.isLoading.value,
  )

  return {
    userDisplayName,
    userInitials,
    userAvatar,
    tokenExpiration,
    isTokenExpiringSoon,
    authStatus,
    canAccessProtectedRoute,
    refreshAuth: auth.refreshTokens,
    clearAuth: auth.logout,
  }
}
