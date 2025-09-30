export const QUERY_KEYS = {
  user: ['user'] as const,
  userMe: () => [...QUERY_KEYS.user, 'me'] as const,
  auth: ['auth'] as const,
  googleUrl: () => [...QUERY_KEYS.auth, 'google', 'url'] as const,
  verification: ['verification'] as const,
} as const

export const MUTATION_KEYS = {
  auth: {
    register: ['auth', 'register'] as const,
    login: ['auth', 'login'] as const,
    logout: ['auth', 'logout'] as const,
  },
  meetings: {
    create: ['meetings', 'create'] as const,
    update: ['meetings', 'update'] as const,
    delete: ['meetings', 'delete'] as const,
  },
} as const

export const STORAGE_KEYS = {
  AUTH_USER: 'auth:user',
} as const
