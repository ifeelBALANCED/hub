import { vi, expect, beforeEach } from 'vitest'
import type { Ref, ComputedRef } from 'vue'

/**
 * Common test data builders and utilities
 */
export const TestData = {
  users: {
    valid: {
      id: 1,
      email: 'user@example.com',
      name: 'Test User',
      avatar: 'https://example.com/avatar.jpg',
      role: 'user',
      isActive: true,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-01'),
    },
    admin: {
      id: 2,
      email: 'admin@example.com',
      name: 'Admin User',
      role: 'admin',
    },
  },

  forms: {
    login: {
      email: 'user@example.com',
      password: 'password123',
    },
    register: {
      email: 'newuser@example.com',
      password: 'securepass123',
      name: 'New User',
    },
  },

  errors: {
    network: new Error('Network Error'),
    validation: { email: ['Email is required'] },
    auth: { detail: 'Authentication failed' },
  },
}

/**
 * Testing utilities for Vue applications
 */

/**
 * Creates a mock ref with reactive behavior for testing
 */
export function createMockRef<T>(initialValue: T): Ref<T> & { _value: T } {
  const ref = {
    value: initialValue,
    _value: initialValue,
  } as Ref<T> & { _value: T }

  // Override the value setter to trigger localStorage writes when used with useLocalStorage
  Object.defineProperty(ref, 'value', {
    get: () => ref._value,
    set: (newValue: T) => {
      ref._value = newValue
      // This will be called by VueUse's useLocalStorage when the value changes
      return newValue
    },
    configurable: true,
  })

  return ref
}

/**
 * Creates a mock localStorage ref that simulates VueUse's useLocalStorage behavior
 */
export function createMockLocalStorageRef<T>(
  key: string,
  initialValue: T,
  mockStorage: ReturnType<typeof createMockLocalStorage>,
): Ref<T> & { _value: T } {
  const ref = createMockRef(initialValue)

  // Override the value setter to trigger localStorage writes
  const originalValue = ref.value
  Object.defineProperty(ref, 'value', {
    get: () => originalValue,
    set: (newValue: T) => {
      // Trigger localStorage write when value changes
      mockStorage.setItem(key, newValue)
      return newValue
    },
    configurable: true,
  })

  return ref
}

/**
 * Creates a mock computed ref that updates when dependencies change
 */
export function createMockComputedRef<T>(getter: () => T): ComputedRef<T> {
  return {
    value: getter(),
    effect: {
      run: vi.fn(),
      stop: vi.fn(),
    },
  } as ComputedRef<T>
}

/**
 * Creates a comprehensive mock for Vue composables
 */
export function createComposableMock<T extends Record<string, any>>(overrides: Partial<T> = {}): T {
  const baseMock = {
    // Common composable patterns
    isLoading: createMockRef(false),
    isError: createMockRef(false),
    error: createMockRef(null),
    data: createMockRef(null),
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    refetch: vi.fn(),
    reset: vi.fn(),
    // Vue reactivity
    reactive: vi.fn((obj) => obj),
    ref: vi.fn((val) => createMockRef(val)),
    computed: vi.fn((getter) => createMockComputedRef(getter)),
    watch: vi.fn(),
    watchEffect: vi.fn(),
    // Lifecycle
    onMounted: vi.fn(),
    onUnmounted: vi.fn(),
    // Dependency injection
    provide: vi.fn(),
    inject: vi.fn(),
  }

  return { ...baseMock, ...overrides } as T
}

/**
 * Creates a mock router for testing navigation
 */
export function createMockRouter(overrides: Partial<any> = {}) {
  return {
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: createMockRef({
      name: 'home',
      params: {},
      query: {},
      meta: {},
      path: '/',
      fullPath: '/',
      hash: '',
      matched: [],
    }),
    ...overrides,
  }
}

/**
 * Creates a mock query client for TanStack Query testing
 */
export function createMockQueryClient(overrides: Partial<any> = {}) {
  return {
    getQueryData: vi.fn(),
    setQueryData: vi.fn(),
    getQueriesData: vi.fn(),
    setQueriesData: vi.fn(),
    removeQueries: vi.fn(),
    resetQueries: vi.fn(),
    cancelQueries: vi.fn(),
    invalidateQueries: vi.fn(),
    refetchQueries: vi.fn(),
    fetchQuery: vi.fn(),
    prefetchQuery: vi.fn(),
    resumePausedMutations: vi.fn(),
    clear: vi.fn(),
    ...overrides,
  }
}

/**
 * Creates a mock store for Pinia testing
 */
export function createMockStore<T extends Record<string, any>>(initialState: Partial<T> = {}) {
  const state = { ...initialState }

  return {
    $state: state,
    $patch: vi.fn((updater) => {
      if (typeof updater === 'function') {
        Object.assign(state, updater(state))
      } else {
        Object.assign(state, updater)
      }
    }),
    $reset: vi.fn(() => {
      Object.keys(state).forEach((key) => {
        delete state[key as keyof T]
      })
      Object.assign(state, initialState)
    }),
    $subscribe: vi.fn(),
    $dispose: vi.fn(),
    ...state,
  }
}

/**
 * Creates a mock localStorage for testing persistence
 */
export function createMockLocalStorage() {
  const storage: Record<string, string> = {}

  return {
    getItem: vi.fn((key: string) => storage[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      storage[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete storage[key]
    }),
    clear: vi.fn(() => {
      Object.keys(storage).forEach((key) => delete storage[key])
    }),
    key: vi.fn((index: number) => Object.keys(storage)[index] || null),
    get length() {
      return Object.keys(storage).length
    },
  }
}

/**
 * Creates a mock media query for testing theme-related functionality
 */
export function createMockMediaQuery() {
  const queries = new Map<string, boolean>()

  return {
    getQuery: vi.fn((query: string) => queries.get(query) ?? false),
    setQuery: vi.fn((query: string, matches: boolean) => {
      queries.set(query, matches)
    }),
    value: false,
    matches: false,
    media: '',
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }
}

/**
 * Creates a mock breakpoints object for testing responsive behavior
 */
export function createMockBreakpoints() {
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
  }

  return {
    smaller: vi.fn((breakpoint: string) => ({
      value: breakpoint === 'mobile' ? true : false,
    })),
    larger: vi.fn((breakpoint: string) => ({
      value: breakpoint === 'mobile' ? false : true,
    })),
    between: vi.fn(),
    current: vi.fn(),
    ...breakpoints,
  }
}

/**
 * Creates a mock error object for testing error handling
 */
export function createMockError(message: string, status?: number, data?: any): any {
  const error = new Error(message) as any

  error.response = {
    status,
    data: data || { detail: message },
  }

  error.message = message
  error.name = 'AxiosError'

  return error
}

/**
 * Creates a mock ref with reactive behavior for testing

/**
 * Common assertion helpers for tests
 */
export const TestAssertions = {
  /**
   * Asserts that a composable returns expected structure
   */
  expectComposableStructure: (result: any, expectedKeys: string[]) => {
    expectedKeys.forEach((key) => {
      expect(result).toHaveProperty(key)
    })
  },

  /**
   * Asserts that a function is callable and returns expected type
   */
  expectFunction: (fn: any, expectedReturnType?: string) => {
    expect(typeof fn).toBe('function')
    if (expectedReturnType) {
      const result = fn()
      expect(typeof result).toBe(expectedReturnType)
    }
  },

  /**
   * Asserts that a mutation object has expected methods
   */
  expectMutationObject: (mutation: any) => {
    expect(typeof mutation.mutate).toBe('function')
    expect(typeof mutation.mutateAsync).toBe('function')
  },

  /**
   * Asserts that an error was thrown with expected message
   */
  expectError: async (fn: () => Promise<any>, expectedMessage?: string) => {
    await expect(fn()).rejects.toThrow(expectedMessage)
  },

  /**
   * Asserts that a notification was called with expected parameters
   */
  expectNotification: (mockNotification: any, type: string, expected: any) => {
    expect(mockNotification[type]).toHaveBeenCalledWith(expected.title, expected)
  },
}

/**
 * Test setup helpers
 */
export const TestSetup = {
  /**
   * Sets up a test environment with Pinia and common mocks
   */
  setupTestEnvironment: () => {
    beforeEach(() => {
      vi.clearAllMocks()
      // Pinia setup is handled in individual test files
    })
  },

  /**
   * Creates a test context with common mocks
   */
  createTestContext: () => {
    return {
      localStorage: createMockLocalStorage(),
      router: createMockRouter(),
    }
  },
}

/**
 * Mock factories for common scenarios
 */
export const MockFactories = {
  /**
   * Creates a mock for VueUse composables
   */
  vueUse: (overrides: Partial<any> = {}) => ({
    useLocalStorage: vi.fn((key, defaultValue) => createMockRef(defaultValue)),
    useMediaQuery: vi.fn(() => ({ value: false })),
    useBreakpoints: vi.fn(() => ({
      smaller: vi.fn(() => true),
      larger: vi.fn(() => false),
    })),
    ...overrides,
  }),

  /**
   * Creates a mock for TanStack Query
   */
  vueQuery: (overrides: Partial<any> = {}) => ({
    useQuery: vi.fn(() => ({
      data: vi.fn(() => ({})),
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
    ...overrides,
  }),

  /**
   * Creates a mock for Vue Router
   */
  vueRouter: (overrides: Partial<any> = {}) => ({
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      go: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      currentRoute: createMockRef({
        name: 'home',
        params: {},
        query: {},
        meta: {},
        path: '/',
        fullPath: '/',
        hash: '',
        matched: [],
      }),
    })),
    useRoute: vi.fn(() => ({
      name: 'home',
      params: {},
      query: {},
      meta: {},
    })),
    ...overrides,
  }),

  /**
   * Creates a mock for notification services
   */
  notifications: (overrides: Partial<any> = {}) => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
    notificationService: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
    },
    ...overrides,
  }),
}
