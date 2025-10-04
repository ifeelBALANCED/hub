import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import type { User, AuthTokens, AuthState } from './types'

const TOKEN_STORAGE_KEY = 'auth_tokens'
const USER_STORAGE_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const tokensRef = useStorage<AuthTokens | null>(TOKEN_STORAGE_KEY, null, sessionStorage, {
    serializer: {
      read: (raw: string) => {
        try {
          return raw ? (JSON.parse(raw) as AuthTokens) : null
        } catch {
          return null
        }
      },
      write: (value: AuthTokens | null) => JSON.stringify(value),
    },
  })

  const userRef = useStorage<User | null>(USER_STORAGE_KEY, null, sessionStorage, {
    serializer: {
      read: (raw: string) => {
        try {
          return raw ? (JSON.parse(raw) as User) : null
        } catch {
          return null
        }
      },
      write: (value: User | null) => JSON.stringify(value),
    },
  })

  const isInitialized = ref(false)

  const user = computed(() => userRef.value)
  const tokens = computed(() => tokensRef.value)
  const isAuthenticated = computed(() => Boolean(user.value && tokens.value))

  const authState = computed<AuthState>(() => ({
    user: user.value,
    tokens: tokens.value,
    isAuthenticated: isAuthenticated.value,
    isLoading: !isInitialized.value,
  }))

  const setTokens = (newTokens: AuthTokens) => {
    tokensRef.value = newTokens
  }

  const clearTokens = () => {
    tokensRef.value = null
  }

  const setUser = (newUser: User) => {
    userRef.value = newUser
  }

  const clearUser = () => {
    userRef.value = null
  }

  const clearCookies = (): void => {
    if (typeof document === 'undefined') return

    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=')
      const name = (eqPos > -1 ? cookie.substring(0, eqPos) : cookie).trim()
      if (!name) continue

      const expire = 'expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'
      const host = typeof window !== 'undefined' ? window.location.hostname : ''

      document.cookie = `${name}=;${expire}`
      if (host) document.cookie = `${name}=;${expire};domain=.${host}`
      if (host) document.cookie = `${name}=;${expire};domain=${host}`
    }
  }

  const cleanup = (): void => {
    clearUser()
    clearTokens()
    clearCookies()
  }

  const setInitialized = (value: boolean) => {
    isInitialized.value = value
  }

  return {
    user,
    tokens,
    isAuthenticated,
    authState,
    isInitialized: computed(() => isInitialized.value),
    setTokens,
    clearTokens,
    setUser,
    clearUser,
    cleanup,
    setInitialized,
  }
})
