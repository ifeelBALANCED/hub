import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useStorage } from '@vueuse/core'
import {
  getRequestUserMeGet,
  logoutAuthLogoutPost,
  type UserInfoResponse,
} from '@/shared/api/client'
import { useQueryClient } from '@tanstack/vue-query'
import { QUERY_KEYS } from '@/shared/lib/constants'

export type User = UserInfoResponse

export const useUser = defineStore('user', () => {
  const queryClient = useQueryClient()

  const storage: Storage | undefined =
    typeof window !== 'undefined' ? window.sessionStorage : undefined

  const userRef = useStorage<UserInfoResponse | null>('user', null, storage, {
    serializer: {
      read: (raw: string) => {
        try {
          return raw ? (JSON.parse(raw) as UserInfoResponse) : null
        } catch {
          return null
        }
      },
      write: (value: UserInfoResponse | null) => JSON.stringify(value),
    },
  })

  const user = computed(() => userRef.value)
  const isAuthenticated = computed(() => Boolean(userRef.value))
  const userDisplayName = computed(() => userRef.value?.name ?? 'User')
  const userEmail = computed(() => userRef.value?.email)

  function setUser(userData: UserInfoResponse | null): void {
    userRef.value = userData
  }

  function clearUser(): void {
    userRef.value = null
  }

  async function fetchCurrentUser(): Promise<UserInfoResponse> {
    try {
      const data = await getRequestUserMeGet()
      setUser(data)
      await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.userMe() })
      return data
    } catch (err) {
      clearUser()
      queryClient.removeQueries({ queryKey: QUERY_KEYS.user })
      throw err
    }
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

  const cleanupClientState = (): void => {
    clearUser()
    queryClient.removeQueries({ queryKey: QUERY_KEYS.user })
  }

  async function logout(): Promise<void> {
    try {
      await logoutAuthLogoutPost()
    } finally {
      cleanupClientState()
      clearCookies()
    }
  }

  return {
    user,
    isAuthenticated,
    userDisplayName,
    userEmail,
    setUser,
    clearUser,
    fetchCurrentUser,
    logout,
  }
})
