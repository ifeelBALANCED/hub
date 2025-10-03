import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { appEnv } from '@/shared/lib/config'

interface _RouteMeta {
  layout?: unknown
  requiresAuth?: boolean
  guestOnly?: boolean
  allowUnauthenticated?: boolean
  title?: string
}

const HomePage = () => import('@/pages/Home.vue')
const AuthPage = () => import('@/pages/Auth.vue')
const DashboardPage = () => import('@/pages/Dashboard.vue')
const JoinPage = () => import('@/pages/Join.vue')
const MeetingPage = () => import('@/pages/Meeting.vue')
const NotFoundPage = () => import('@/pages/NotFound.vue')

export const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage },
  { path: '/auth', component: AuthPage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/join', component: JoinPage },
  { path: '/meeting', component: MeetingPage },
  { path: '/:pathMatch(.*)*', component: NotFoundPage },
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
