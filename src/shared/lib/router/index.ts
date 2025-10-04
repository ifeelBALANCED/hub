import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/entities/session'
import { ROUTE_PATHS } from '@/shared/lib/constants'
import { storeToRefs } from 'pinia'

export type AuthGuardConfig = {
  defaultAuthenticatedRoute: string
  loginRoute: string
}

const DEFAULT_CONFIG: AuthGuardConfig = {
  defaultAuthenticatedRoute: ROUTE_PATHS.DASHBOARD,
  loginRoute: ROUTE_PATHS.AUTH,
}

export const createAuthGuard = (config: Partial<AuthGuardConfig> = {}) => {
  const guardConfig: AuthGuardConfig = { ...DEFAULT_CONFIG, ...config }

  return async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext,
  ) => {
    const authStore = useAuthStore()
    const { isAuthenticated, isInitialized } = storeToRefs(authStore)

    if (!isInitialized.value) {
      let attempts = 0
      const maxAttempts = 60

      while (!isInitialized.value && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 25))
        attempts++
      }
    }

    const authed = Boolean(isAuthenticated.value)
    const requiresAuth = Boolean(to.meta?.requiresAuth)
    const guestOnly = Boolean(to.meta?.guestOnly)
    const allowUnauthenticated = Boolean(to.meta?.allowUnauthenticated)

    if (to.path === ROUTE_PATHS.HOME) {
      if (authed) {
        next(guardConfig.defaultAuthenticatedRoute)
        return
      }
      next()
      return
    }

    if (to.matched.length === 0 || to.name === 'not-found') {
      next(authed ? guardConfig.defaultAuthenticatedRoute : guardConfig.loginRoute)
      return
    }

    if (allowUnauthenticated) {
      next()
      return
    }

    if (requiresAuth && !authed) {
      const redirect = encodeURIComponent(to.fullPath)
      next({ path: guardConfig.loginRoute, query: { redirect } })
      return
    }

    if (guestOnly && authed) {
      next(guardConfig.defaultAuthenticatedRoute)
      return
    }

    next()
  }
}

export const authGuard = createAuthGuard()
