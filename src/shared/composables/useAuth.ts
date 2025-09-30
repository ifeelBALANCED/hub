import { useMutation, useQuery } from '@tanstack/vue-query'
import { computed, toValue, type MaybeRefOrGetter, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { AxiosError } from 'axios'
import { useAuthStore } from '@/shared/stores/auth'
import { useUser } from '@/entities/user'
import { notificationService, extractErrorMessage, type ApiErrorResponse } from '@/shared/services'
import { QUERY_KEYS, MUTATION_KEYS, ROUTE_PATHS } from '@/shared/lib/constants'
import {
  getRequestUserMeGet,
  loginAuthLoginPost,
  logoutAuthLogoutPost,
  registerAuthRegisterPost,
  googleOauthAuthGooglePost,
  getGoogleAuthUrlAuthGoogleUrlGet,
  linkAccountToGoogleAuthGoogleLinkPost,
  type UserLogin,
  type UserRegister,
  type GoogleAuthRequest,
  type OAuthLinkRequest,
} from '@/shared/api/client'

export function useAuthSession() {
  const userStore = useUser()

  const query = useQuery({
    queryKey: QUERY_KEYS.userMe(),
    queryFn: getRequestUserMeGet,
    retry: false,
    staleTime: 60_000 * 5,
    enabled: computed(() => userStore.isAuthenticated),
  })

  watch(query.data, (data) => {
    if (data && !query.isLoading.value) {
      userStore.setUser(data)
    }
  })

  const isAuthenticating = computed(() => query.isLoading.value || query.isRefetching.value)

  return {
    ...query,
    user: userStore.user,
    isAuthenticated: userStore.isAuthenticated,
    userDisplayName: userStore.userDisplayName,
    userEmail: userStore.userEmail,
    isAuthenticating,
  }
}

export function useCurrentUser() {
  return useAuthSession()
}

export function useRegister() {
  const router = useRouter()

  return useMutation({
    mutationKey: MUTATION_KEYS.auth.register,
    mutationFn: (payload: MaybeRefOrGetter<UserRegister>) =>
      registerAuthRegisterPost(toValue(payload)),
    onSuccess: () => {
      notificationService.success({ title: 'Registration successful - please sign in' })
      router.push(ROUTE_PATHS.SIGN_IN)
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = extractErrorMessage(error)
      notificationService.error({ title: errorMessage })
    },
  })
}

export function useLogin() {
  const authStore = useAuthStore()
  const userStore = useUser()

  return useMutation({
    mutationKey: MUTATION_KEYS.auth.login,
    mutationFn: (payload: MaybeRefOrGetter<UserLogin>) => loginAuthLoginPost(toValue(payload)),
    onSuccess: async () => {
      try {
        const userData = await getRequestUserMeGet()
        userStore.setUser(userData)
        await authStore.handleLoginSuccess()
      } catch {
        notificationService.error({ title: 'Failed to complete login process' })
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = extractErrorMessage(error)
      notificationService.error({ title: errorMessage })
    },
  })
}

export function useLogout() {
  const authStore = useAuthStore()
  const userStore = useUser()
  const router = useRouter()

  return useMutation({
    mutationKey: MUTATION_KEYS.auth.logout,
    mutationFn: async () => {
      return logoutAuthLogoutPost()
    },
    onSuccess: () => {
      userStore.clearUser()
      authStore.handleLogoutSuccess()
      notificationService.success({ title: 'Successfully logged out' })
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = extractErrorMessage(error)
      notificationService.error({ title: errorMessage })
      userStore.clearUser()
      router.push({ name: 'get-started' })
    },
  })
}

export function useGoogleAuthUrl() {
  return useMutation({
    mutationKey: ['googleAuthUrl'],
    mutationFn: () => getGoogleAuthUrlAuthGoogleUrlGet(),
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = extractErrorMessage(error)
      notificationService.error({ title: errorMessage })
    },
  })
}

export function useGoogleAuth() {
  const authStore = useAuthStore()
  const userStore = useUser()

  return useMutation({
    mutationKey: ['googleAuth'],
    mutationFn: (payload: GoogleAuthRequest) => googleOauthAuthGooglePost(payload),
    onSuccess: async () => {
      try {
        const userData = await getRequestUserMeGet()
        userStore.setUser(userData)
        await authStore.handleLoginSuccess()
        notificationService.success({ title: 'Successfully signed in with Google' })
      } catch {
        notificationService.error({ title: 'Failed to complete Google sign-in' })
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = extractErrorMessage(error)
      notificationService.error({ title: errorMessage })
    },
  })
}

export function useLinkGoogleAccount() {
  return useMutation({
    mutationKey: ['linkGoogleAccount'],
    mutationFn: (payload: OAuthLinkRequest) => linkAccountToGoogleAuthGoogleLinkPost(payload),
    onSuccess: async () => {
      notificationService.success({ title: 'Account successfully linked to Google' })
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const errorMessage = extractErrorMessage(error)
      notificationService.error({ title: errorMessage })
    },
  })
}
