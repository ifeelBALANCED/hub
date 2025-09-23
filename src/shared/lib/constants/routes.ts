export const ROUTE_PATHS = {
  HOME: '/',
  SIGN_IN: '/signin',
  GET_STARTED: '/get-started',
  MEETING: '/meeting',
  MEETING_DETAILS: '/meeting/:roomId',
  NOT_FOUND: '/:pathMatch(.*)*',
} as const
