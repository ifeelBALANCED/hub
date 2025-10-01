import { config } from '@vue/test-utils'
import { vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    currentRoute: {
      value: {
        name: 'home',
        params: {},
        query: {},
        meta: {},
      },
    },
  })),
  useRoute: vi.fn(() => ({
    name: 'home',
    params: {},
    query: {},
    meta: {},
  })),
}))

vi.mock('@vueuse/core', () => ({
  useLocalStorage: vi.fn((key, defaultValue) => ({
    value: defaultValue,
  })),
  useMediaQuery: vi.fn(() => ({
    value: false,
  })),
  useBreakpoints: vi.fn(() => ({
    smaller: vi.fn(() => true),
    larger: vi.fn(() => false),
  })),
}))

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

vi.mock('@tanstack/vue-query', () => ({
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
}))

vi.mock('@/shared/api/client', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
}))

config.global.plugins = [
  createTestingPinia({
    createSpy: vi.fn,
    initialState: {},
    stubActions: false,
  }),
]

config.global.mocks = {
  $vuetify: {
    theme: {
      dark: false,
    },
  },
}

config.global.stubs = {}

config.global.provide = {
  form: {
    register: () => {},
    unregister: () => {},
    update: () => {},
    validate: () => ({ valid: true }),
  },
}

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  })),
})

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

global.testHelpers = {
  localStorage: localStorageMock,
}
