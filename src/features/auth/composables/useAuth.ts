import { useAuthStore } from '@/entities/session'
import { useQueryClient } from '@tanstack/vue-query'
import {
  usePostV1AuthLogin,
  usePostV1AuthRegister,
  usePostV1AuthLogout,
  useGetV1AuthMe,
  postV1AuthRefresh,
  getGetV1MeetingsQueryOptions,
  type PostV1AuthLoginMutationBody,
  type PostV1AuthRegisterMutationBody,
} from '@/shared/api/client'
import { computed, watchEffect } from 'vue'
import { logger } from '@/shared/services/logger.service'
import type { LoginCredentials, RegisterCredentials } from '@/entities/session/model/types'
import { storeToRefs } from 'pinia'

const AUTH_QUERY_KEY = ['v1', 'auth', 'me']
const STALE_TIME = 15 * 60 * 1000 // 15 minutes for auth data
const GC_TIME = 60 * 60 * 1000 // 1 hour

export const useAuth = () => {
  const authStore = useAuthStore()
  const queryClient = useQueryClient()
  const { user, tokens, isAuthenticated, isInitialized } = storeToRefs(authStore)

  let refreshTimer: number | null = null
  let visibilityListenerSet = false

  const clearRefreshTimer = () => {
    if (refreshTimer !== null) {
      clearTimeout(refreshTimer)
      refreshTimer = null
    }
  }

  const scheduleProactiveRefresh = () => {
    clearRefreshTimer()
    const expiresInSeconds = tokens.value?.accessTokenExpiresIn
    if (!expiresInSeconds) return

    const leadMs = 60 * 1000
    const delayMs = Math.max(expiresInSeconds * 1000 - leadMs, 5000)

    const startTimer = () => {
      refreshTimer = window.setTimeout(() => {
        refreshTokens().catch((e) => logger.warn('Proactive refresh failed', e))
      }, delayMs)
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const onBackOnline = () => {
        window.removeEventListener('online', onBackOnline)
        startTimer()
      }
      window.addEventListener('online', onBackOnline, { once: true })
      return
    }

    startTimer()
  }

  const loginMutation = usePostV1AuthLogin({
    mutation: {
      retry: false,
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: AUTH_QUERY_KEY })
      },
      onSuccess: (response) => {
        if (response && response.accessToken && response.refreshToken) {
          authStore.setTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            accessTokenExpiresIn: response.accessTokenExpiresIn || 3600,
            refreshTokenExpiresIn: response.refreshTokenExpiresIn || 86400,
          })
          queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
        }
      },
      onError: (error) => {
        logger.error('Login failed', error)
        authStore.clearTokens()
        authStore.clearUser()
      },
    },
  })

  const registerMutation = usePostV1AuthRegister({
    mutation: {
      retry: false,
      onSuccess: (response) => {
        if (response && response.accessToken && response.refreshToken) {
          authStore.setTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
            accessTokenExpiresIn: response.accessTokenExpiresIn || 3600,
            refreshTokenExpiresIn: response.refreshTokenExpiresIn || 86400,
          })
          queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEY })
        }
      },
      onError: (error) => {
        logger.error('Registration failed', error)
        authStore.clearTokens()
        authStore.clearUser()
      },
    },
  })

  const logoutMutation = usePostV1AuthLogout({
    mutation: {
      retry: false,
      onSettled: () => {
        authStore.cleanup()
        queryClient.clear()
      },
    },
  })

  const currentUserQuery = useGetV1AuthMe({
    query: {
      enabled: computed(() => Boolean(tokens.value) && isInitialized.value && navigator.onLine),
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      placeholderData: () => {
        return queryClient.getQueryData(AUTH_QUERY_KEY)
      },
      retry: (failureCount, error) => {
        // Don't retry on network errors during initial load
        if (error && typeof error === 'object' && 'message' in error) {
          const message = (error as any).message
          if (
            message &&
            (message.includes('Network Error') || message.includes('Failed to fetch'))
          ) {
            return false
          }
        }

        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status
          if (status === 401 || status === 403 || status === 404) return false
          if (status >= 400 && status < 500) return false
        }
        return failureCount < 2
      },
      select: (data: any) => {
        if (data) authStore.setUser(data)
        return data
      },
      networkMode: 'online',
    },
  })

  const initializeAuth = async () => {
    if (isInitialized.value) return

    setTimeout(async () => {
      try {
        if (tokens.value) {
          const cachedUser = queryClient.getQueryData(AUTH_QUERY_KEY)
          if (cachedUser) {
            authStore.setUser(cachedUser)
          }

          if (navigator.onLine && !currentUserQuery.isFetching.value) {
            await currentUserQuery.refetch()
          }
        }
      } catch (error) {
        logger.error('Failed to initialize auth', error)
        if (error && typeof error === 'object' && 'message' in error) {
          const message = (error as any).message
          if (
            !(message && (message.includes('Network Error') || message.includes('Failed to fetch')))
          ) {
            authStore.cleanup()
          }
        } else {
          authStore.cleanup()
        }
      } finally {
        authStore.setInitialized(true)
      }
    }, 100) // Small delay to ensure network is ready
  }

  watchEffect(() => {
    if (!isInitialized.value) initializeAuth()
  })

  watchEffect(() => {
    const accessToken = tokens.value?.accessToken
    if (!accessToken) {
      clearRefreshTimer()
      return
    }
    scheduleProactiveRefresh()
  })

  if (!visibilityListenerSet && typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        const seconds = tokens.value?.accessTokenExpiresIn
        if (seconds && seconds * 1000 <= 90 * 1000) {
          refreshTokens().catch(() => scheduleProactiveRefresh())
        }
      }
    })
    visibilityListenerSet = true
  }

  watchEffect(() => {
    const error = currentUserQuery.error.value
    if (error && typeof error === 'object' && 'status' in error) {
      const status = (error as any).status
      if (status === 401 || status === 403) {
        logger.warn('User session invalid, clearing auth state')
        authStore.cleanup()
      }
    }
  })

  const login = async (credentials: LoginCredentials) => {
    return new Promise((resolve, reject) => {
      loginMutation.mutate(
        { data: credentials as PostV1AuthLoginMutationBody },
        {
          onSuccess: () => {
            const refetchResult = currentUserQuery.refetch()
            refetchResult
              .then((result: any) => {
                if (result?.data) resolve(result.data)
                else reject(new Error('Failed to fetch user after login'))
              })
              .catch(reject)
              .finally(() => {
                // no meetings prefetch here; Dashboard will fetch once with the same key
                try {
                  // warm only the key structure without triggering fetch
                  const key: any = (getGetV1MeetingsQueryOptions({ limit: 10 }) as any).queryKey
                  queryClient.setQueryData(key, (old) => old ?? undefined)
                } catch {}
              })
          },
          onError: (error) => reject(error),
        },
      )
    })
  }

  const register = async (credentials: RegisterCredentials) => {
    return new Promise((resolve, reject) => {
      registerMutation.mutate(
        { data: credentials as PostV1AuthRegisterMutationBody },
        {
          onSuccess: () => {
            const refetchResult = currentUserQuery.refetch()
            refetchResult
              .then((result: any) => {
                if (result?.data) resolve(result.data)
                else reject(new Error('Failed to fetch user after registration'))
              })
              .catch(reject)
              .finally(() => {
                try {
                  const key: any = (getGetV1MeetingsQueryOptions({ limit: 10 }) as any).queryKey
                  queryClient.setQueryData(key, (old) => old ?? undefined)
                } catch {}
              })
          },
          onError: (error) => reject(error),
        },
      )
    })
  }

  const logout = async () => {
    return new Promise<void>((resolve) => {
      logoutMutation.mutate(undefined, {
        onSettled: () => resolve(),
      })
    })
  }

  const requireAuth = () => {
    if (!isAuthenticated.value) throw new Error('Authentication required')
  }

  const requireGuest = () => {
    if (isAuthenticated.value) throw new Error('Must be logged out')
  }

  const refreshTokens = async () => {
    const refreshToken = tokens.value?.refreshToken
    if (!refreshToken) throw new Error('No refresh token available')

    try {
      const data: any = await postV1AuthRefresh({ refreshToken } as any)
      if (data?.accessToken) {
        authStore.setTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken || refreshToken,
          accessTokenExpiresIn: data.accessTokenExpiresIn || 3600,
          refreshTokenExpiresIn:
            data.refreshTokenExpiresIn || tokens.value?.refreshTokenExpiresIn || 86400,
        })
        return data
      }
      throw new Error('Invalid refresh response')
    } catch (err) {
      authStore.cleanup()
      throw err
    }
  }

  return {
    user,
    tokens,
    isAuthenticated,
    isLoading: computed(() => !isInitialized.value || currentUserQuery.isLoading.value),
    isInitialized,
    login,
    register,
    logout,
    isLoggingIn: computed(() => loginMutation.isPending.value),
    isRegistering: computed(() => registerMutation.isPending.value),
    isLoggingOut: computed(() => logoutMutation.isPending.value),
    currentUser: currentUserQuery.data,
    isFetchingUser: computed(() => currentUserQuery.isFetching.value),
    isUserLoading: computed(() => currentUserQuery.isLoading.value),
    initializeAuth,
    refreshTokens,
    requireAuth,
    requireGuest,
    loginError: computed(() => loginMutation.error.value),
    registerError: computed(() => registerMutation.error.value),
    logoutError: computed(() => logoutMutation.error.value),
    userError: computed(() => currentUserQuery.error.value),
    clearErrors: () => {
      loginMutation.reset()
      registerMutation.reset()
      logoutMutation.reset()
    },
  }
}
