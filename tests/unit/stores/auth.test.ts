import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAuthStore } from '@/shared/stores/auth'

describe('useAuthStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('store imports and basic structure', () => {
    it('should be able to import useAuthStore', async () => {
      expect(typeof useAuthStore).toBe('function')
    })

    it('should have expected function names when created', async () => {
      vi.mock('@tanstack/vue-query', () => ({
        useQueryClient: vi.fn(() => ({
          cancelQueries: vi.fn(),
          removeQueries: vi.fn(),
          clear: vi.fn(),
        })),
      }))

      vi.mock('vue-router', () => ({
        useRouter: vi.fn(() => ({
          push: vi.fn(),
        })),
      }))

      const store = useAuthStore()

      expect(typeof store.handleLoginSuccess).toBe('function')
      expect(typeof store.handleLogoutSuccess).toBe('function')
      expect(typeof store.handleAuthError).toBe('function')
      expect(typeof store.handleSessionExpiry).toBe('function')
    })
  })
})
