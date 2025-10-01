import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { appEnv } from '@/shared/lib/config'
import { ROUTE_PATHS } from '@/shared/lib/constants'
import { useUser } from '@/entities/user'

interface RouteMeta {
  layout?: unknown
  requiresAuth?: boolean
  guestOnly?: boolean
  allowUnauthenticated?: boolean
  title?: string
}

const HomePage = () => import('@/views/HomeView.vue')
const SignInPage = () => import('@/views/SignIn.vue')
const GetStartedPage = () => import('@/views/GetStarted.vue')
const MeetingPage = () => import('@/pages/meeting/ui/MeetingPage.vue')
const NotFoundPage = () => import('@/views/NotFound.vue')

const OAuthCallbackPage = () => import('@/views/OAuthCallback.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.HOME,
    name: 'home',
    component: HomePage,
    meta: {
      title: 'Welcome',
      allowUnauthenticated: true,
    } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.SIGN_IN,
    name: 'sign-in',
    component: SignInPage,
    meta: {
      title: 'Sign In',
      guestOnly: true,
    } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.GET_STARTED,
    name: 'get-started',
    component: GetStartedPage,
    meta: {
      title: 'Get Started',
      guestOnly: true,
    } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.MEETING,
    name: 'meeting',
    component: MeetingPage,
    meta: {
      title: 'Meeting',
      requiresAuth: true,
    } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.MEETING_DETAILS,
    name: 'meeting-details',
    component: MeetingPage,
    meta: {
      title: 'Meeting',
      requiresAuth: true,
    } satisfies RouteMeta,
  },
  {
    path: '/auth/google/callback',
    name: 'oauth-callback',
    component: OAuthCallbackPage,
    meta: {
      title: 'OAuth Callback',
      allowUnauthenticated: true,
    } satisfies RouteMeta,
  },

  {
    path: ROUTE_PATHS.NOT_FOUND,
    name: 'not-found',
    component: NotFoundPage,
    meta: {
      title: 'Page Not Found',
      allowUnauthenticated: true,
    } satisfies RouteMeta,
  },
]

export const router = createRouter({
  history: createWebHistory(appEnv.BASE_URL),
  routes,
  scrollBehavior(to, _, savedPosition) {
    if (savedPosition) return savedPosition

    if (to.hash) return { el: to.hash }

    return { top: 0 }
  },
})

// Auth guards
router.beforeEach((to, from, next) => {
  const userStore = useUser()

  // Check if route requires authentication
  if (to.meta?.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'get-started' })
    return
  }

  // Check if route is guest-only (sign-in, register pages)
  if (to.meta?.guestOnly && userStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }

  // Allow route to proceed
  next()
})
