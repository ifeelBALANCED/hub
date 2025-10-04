import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { appEnv } from '@/shared/lib/config'
import { ROUTE_PATHS } from '@/shared/lib/constants'
import { authGuard } from '@/shared/lib/router'

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
  { path: ROUTE_PATHS.HOME, name: 'home', component: HomePage },
  { path: ROUTE_PATHS.AUTH, name: 'auth', component: AuthPage, meta: { guestOnly: true } },
  {
    path: ROUTE_PATHS.DASHBOARD,
    name: 'dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true },
  },
  { path: ROUTE_PATHS.JOIN, name: 'join', component: JoinPage, meta: { requiresAuth: true } },
  {
    path: ROUTE_PATHS.MEETING,
    name: 'meeting',
    component: MeetingPage,
    meta: { requiresAuth: true },
  },
  { path: ROUTE_PATHS.NOT_FOUND, name: 'not-found', component: NotFoundPage },
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

router.beforeEach(authGuard)
