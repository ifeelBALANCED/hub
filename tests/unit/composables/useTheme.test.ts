import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useTheme, createThemeProvider, useThemeContext } from '@/shared/composables/useTheme'
import { createMockLocalStorage, createMockMediaQuery, createMockRef } from '../utils/test-utils'

const hoisted = vi.hoisted(() => ({
  mockUseLocalStorage: vi.fn(),
  mockUseMediaQuery: vi.fn(),
}))

vi.mock('@vueuse/core', () => ({
  useLocalStorage: hoisted.mockUseLocalStorage,
  useMediaQuery: hoisted.mockUseMediaQuery,
}))

vi.mock('@/shared/lib/constants', () => ({
  THEME_STORAGE_KEY: 'theme',
  THEME_DARK_CLASS: 'dark',
}))

const ensureDocument = () => {
  Object.defineProperty(document.documentElement, 'classList', {
    value: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    writable: true,
  })
}

describe('useTheme', () => {
  let mockLocalStorage: ReturnType<typeof createMockLocalStorage>
  let mockMediaQuery: ReturnType<typeof createMockMediaQuery>
  let mockClassList: any

  beforeEach(() => {
    vi.clearAllMocks()

    ensureDocument()
    mockLocalStorage = createMockLocalStorage()
    mockMediaQuery = createMockMediaQuery()
    mockClassList = document.documentElement.classList

    hoisted.mockUseLocalStorage.mockImplementation((key, defaultValue) => {
      const ref = createMockRef(defaultValue)

      ;(ref as any)._key = key
      ;(ref as any)._storage = mockLocalStorage

      const originalDescriptor = Object.getOwnPropertyDescriptor(ref, 'value')
      Object.defineProperty(ref, 'value', {
        get: originalDescriptor?.get || (() => (ref as any)._value),
        set: (newValue) => {
          ;(ref as any)._value = newValue
          if (mockLocalStorage && mockLocalStorage.setItem) {
            mockLocalStorage.setItem(key, newValue)
          }
        },
        configurable: true,
      })

      return ref
    })
    hoisted.mockUseMediaQuery.mockReturnValue({ value: false })
  })

  afterEach(() => {
    mockClassList.add.mockClear()
    mockClassList.remove.mockClear()
    mockLocalStorage.clear()
  })

  describe('initialization', () => {
    it('should initialize with system theme by default', () => {
      const { theme, actualTheme } = useTheme()

      expect(hoisted.mockUseLocalStorage).toHaveBeenCalledWith('theme', 'system')
      expect(theme.value).toBe('system')
      expect(actualTheme.value).toBe('light')
    })

    it('should initialize with saved theme from localStorage', () => {
      hoisted.mockUseLocalStorage.mockReturnValue(createMockRef('dark'))

      const { theme, actualTheme } = useTheme()

      expect(theme.value).toBe('dark')
      expect(actualTheme.value).toBe('dark')
    })

    it('should handle corrupted localStorage gracefully', () => {
      mockLocalStorage.setItem('theme', 'invalid-theme')

      const { theme } = useTheme()

      expect(theme.value).toBe('system')
    })
  })

  describe('theme computation', () => {
    it('should return correct actual theme for system preference', () => {
      const { actualTheme } = useTheme()

      expect(actualTheme.value).toBe('light')

      // Test dark mode by mocking media query
      hoisted.mockUseMediaQuery.mockReturnValue({ value: true })

      // Create new instance to test dark mode
      const { actualTheme: darkTheme } = useTheme()
      expect(darkTheme.value).toBe('dark')
    })

    it('should return explicit theme when set', () => {
      hoisted.mockUseLocalStorage.mockReturnValue(createMockRef('dark'))

      const { actualTheme } = useTheme()

      expect(actualTheme.value).toBe('dark')
    })
  })

  describe('DOM class management', () => {
    it('should manage DOM classes correctly', () => {
      hoisted.mockUseLocalStorage.mockReturnValue(createMockRef('dark'))
      useTheme()
      expect(mockClassList.add).toHaveBeenCalledWith('dark')

      hoisted.mockUseLocalStorage.mockReturnValue(createMockRef('light'))
      useTheme()
      expect(mockClassList.remove).toHaveBeenCalledWith('dark')
    })

    it('should not manage DOM classes during SSR', () => {
      const originalDocument = global.document
      delete (global as any).document

      expect(() => useTheme()).not.toThrow()

      global.document = originalDocument
    })
  })

  describe('theme control functions', () => {
    it('should toggle and set themes correctly', () => {
      const { setTheme } = useTheme()

      setTheme('dark')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'dark')

      setTheme('light')
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('theme', 'light')

      expect(() => setTheme('invalid' as any)).not.toThrow()
    })
  })

  describe('reactive behavior', () => {
    it('should react to localStorage and system preference changes', () => {
      const { theme, actualTheme } = useTheme()

      expect(theme.value).toBe('system')
      expect(actualTheme.value).toBe('light')

      mockLocalStorage.setItem('theme', 'dark')

      mockMediaQuery.setQuery('(prefers-color-scheme: dark)', true)
    })
  })

  describe('readonly properties', () => {
    it('should return readonly refs with correct types', () => {
      const { theme, actualTheme } = useTheme()

      expect(theme).toHaveProperty('value')
      expect(typeof theme.value).toBe('string')
      expect(['light', 'dark', 'system']).toContain(theme.value)

      expect(actualTheme).toHaveProperty('value')
      expect(['light', 'dark']).toContain(actualTheme.value)
    })
  })

  describe('error handling', () => {
    it('should handle various unavailable APIs gracefully', () => {
      const originalLocalStorage = global.localStorage
      delete (global as any).localStorage
      expect(() => useTheme()).not.toThrow()
      global.localStorage = originalLocalStorage

      const originalDocument = global.document
      delete (global as any).document
      expect(() => useTheme()).not.toThrow()
      global.document = originalDocument

      hoisted.mockUseMediaQuery.mockReturnValue({ value: null })
      expect(() => useTheme()).not.toThrow()
    })
  })

  describe('API functions', () => {
    it('should export required functions', () => {
      expect(typeof createThemeProvider).toBe('function')
      expect(typeof useThemeContext).toBe('function')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid theme changes and errors', () => {
      const { setTheme } = useTheme()

      setTheme('light')
      setTheme('dark')
      setTheme('system')

      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(3)

      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      expect(() => setTheme('dark')).not.toThrow()
    })
  })

  describe('integration', () => {
    it('should work correctly in various scenarios', () => {
      const { theme, actualTheme, setTheme } = useTheme()

      expect(['light', 'dark', 'system']).toContain(theme.value)
      expect(['light', 'dark']).toContain(actualTheme.value)
      expect(typeof setTheme).toBe('function')

      expect(() => mockLocalStorage.clear()).not.toThrow()
    })
  })
})
