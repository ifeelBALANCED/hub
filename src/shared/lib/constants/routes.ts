export const ROUTE_PATHS = {
  HOME: '/',
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  JOIN: '/join',
  MEETING: '/meeting',
  NOT_FOUND: '/:pathMatch(.*)*',
} as const

export const ROUTE_NAMES = {
  HOME: 'home',
  SIGN_IN: 'sign-in',
  GET_STARTED: 'get-started',
  MEETING: 'meeting',
  NOT_FOUND: 'not-found',
} as const
