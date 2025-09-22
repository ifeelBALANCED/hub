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
const AboutPage = () => import('@/views/AboutView.vue')
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
    path: ROUTE_PATHS.ABOUT,
    name: 'about',
    component: AboutPage,
    meta: {
      title: 'About',
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
