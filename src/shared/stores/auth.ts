import { defineStore } from 'pinia'
import { useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'
import { QUERY_KEYS } from '@/shared/lib/constants'
import { notificationService, extractErrorMessage } from '@/shared/services'
import type { AxiosError } from 'axios'
export const useAuthStore = defineStore('auth', () => {
  const queryClient = useQueryClient()
  const router = useRouter()

  const handleLoginSuccess = async () => {
    notificationService.success({ title: 'Login successful' })
    router.push({ name: 'home' })
  }

  const handleLogoutSuccess = async () => {
    await queryClient.cancelQueries()
    queryClient.removeQueries({ queryKey: QUERY_KEYS.userMe() })
    queryClient.clear()

    router.push({ name: 'get-started' })
  }

  const handleAuthError = (error: AxiosError) => {
    const errorMessage = extractErrorMessage(error)
    notificationService.error({ title: errorMessage })
  }

  const handleSessionExpiry = () => {
    queryClient.removeQueries({ queryKey: QUERY_KEYS.userMe() })
    notificationService.info({ title: 'Session expired. Please log in again.' })
    router.push({ name: 'get-started' })
  }

  return {
    handleLoginSuccess,
    handleLogoutSuccess,
    handleAuthError,
    handleSessionExpiry,
  }
})
