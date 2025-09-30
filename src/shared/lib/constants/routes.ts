export const ROUTE_PATHS = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  GET_STARTED: '/get-started',
  MEETING: '/meeting',
  MEETING_DETAILS: '/meeting/:roomId',
  NOT_FOUND: '/:pathMatch(.*)*',
} as const

export const ROUTE_NAMES = {
  HOME: 'home',
  SIGN_IN: 'sign-in',
  GET_STARTED: 'get-started',
  MEETING: 'meeting',
  NOT_FOUND: 'not-found',
} as const
