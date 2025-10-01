import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  useAuthSession,
  useLogin,
  useLogout,
  useRegister,
  useGoogleAuth,
  useGoogleAuthUrl,
  useLinkGoogleAccount,
} from '@/shared/composables/useAuth'

vi.mock('@tanstack/vue-query', () => ({
  useQuery: vi.fn(() => ({
    data: vi.fn(() => ({ id: 1, email: 'test@example.com' })),
    isLoading: { value: false },
    isRefetching: { value: false },
  })),
  useMutation: vi.fn(() => ({
    mutate: vi.fn(),
    mutateAsync: vi.fn().mockResolvedValue({}),
  })),
  useQueryClient: vi.fn(() => ({
    invalidateQueries: vi.fn(),
    setQueryData: vi.fn(),
  })),
}))

vi.mock('@vueuse/core', () => ({
  useStorage: vi.fn(() => ({ value: null })),
}))

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
  })),
}))

vi.mock('@/shared/api/client', () => ({
  getRequestUserMeGet: vi.fn().mockResolvedValue({ id: 1, email: 'test@example.com' }),
  loginAuthLoginPost: vi.fn().mockResolvedValue({}),
  logoutAuthLogoutPost: vi.fn().mockResolvedValue({}),
  registerAuthRegisterPost: vi.fn().mockResolvedValue({}),
  googleOauthAuthGooglePost: vi.fn().mockResolvedValue({}),
  getGoogleAuthUrlAuthGoogleUrlGet: vi.fn().mockResolvedValue({}),
  linkAccountToGoogleAuthGoogleLinkPost: vi.fn().mockResolvedValue({}),
}))

vi.mock('@/shared/services', () => ({
  notificationService: {
    success: vi.fn(),
    error: vi.fn(),
  },
  extractErrorMessage: vi.fn(() => 'Test error message'),
}))

describe('useAuth composables', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
  })

  describe('composable imports and basic functionality', () => {
    it('should be able to import all auth composables', async () => {
      expect(typeof useAuthSession).toBe('function')
      expect(typeof useLogin).toBe('function')
      expect(typeof useLogout).toBe('function')
      expect(typeof useRegister).toBe('function')
      expect(typeof useGoogleAuth).toBe('function')
      expect(typeof useGoogleAuthUrl).toBe('function')
      expect(typeof useLinkGoogleAccount).toBe('function')
    })

    it('useAuthSession should return expected structure', async () => {
      const result = useAuthSession()

      expect(result).toHaveProperty('user')
      expect(result).toHaveProperty('isAuthenticated')
      expect(result).toHaveProperty('isAuthenticating')
    })

    it('useRegister should return mutation object', async () => {
      const registerMutation = useRegister()

      expect(typeof registerMutation.mutate).toBe('function')
      expect(typeof registerMutation.mutateAsync).toBe('function')
    })

    it('useLogin should return mutation object', async () => {
      const loginMutation = useLogin()

      expect(typeof loginMutation.mutate).toBe('function')
      expect(typeof loginMutation.mutateAsync).toBe('function')
    })

    it('useLogout should return mutation object', async () => {
      const logoutMutation = useLogout()

      expect(typeof logoutMutation.mutate).toBe('function')
      expect(typeof logoutMutation.mutateAsync).toBe('function')
    })
  })
})
