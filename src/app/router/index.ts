import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { appEnv } from '@/shared/lib/config'
import { ROUTE_PATHS } from '@/shared/lib/constants'

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
const MeetingPage = () => import('@/views/MeetingView.vue')
const NotFoundPage = () => import('@/views/NotFound.vue')

export const routes: RouteRecordRaw[] = [
  {
    path: ROUTE_PATHS.HOME,
    name: 'home',
    component: HomePage,
    meta: {
      title: 'Welcome',
    } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.SIGN_IN,
    name: 'sign-in',
    component: SignInPage,
    meta: {
      title: 'Sign In',
    } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.GET_STARTED,
    name: 'get-started',
    component: GetStartedPage,
    meta: {
      title: 'Get Started',
    } satisfies RouteMeta,
  },
  {
    path: ROUTE_PATHS.MEETING,
    name: 'meeting',
    component: MeetingPage,
    meta: {
      title: 'Meeting',
    } satisfies RouteMeta,
  },

  {
    path: ROUTE_PATHS.NOT_FOUND,
    name: 'not-found',
    component: NotFoundPage,
    meta: {
      title: 'Page Not Found',
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
