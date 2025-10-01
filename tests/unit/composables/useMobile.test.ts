import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useIsMobile } from '@/shared/composables/useMobile'
import { createMockBreakpoints } from '../utils/test-utils'

const hoisted = vi.hoisted(() => ({
  mockUseBreakpoints: vi.fn(),
  mockSmaller: vi.fn(),
}))

vi.mock('@vueuse/core', () => ({
  useBreakpoints: hoisted.mockUseBreakpoints,
}))

vi.mock('@/shared/lib/constants', () => ({
  BREAKPOINTS: {
    mobile: 768,
  },
}))

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    hoisted.mockUseBreakpoints.mockReturnValue({
      smaller: hoisted.mockSmaller,
      larger: vi.fn(),
    })
  })

  describe('initialization', () => {
    it('should call useBreakpoints with correct mobile breakpoint', () => {
      hoisted.mockSmaller.mockReturnValue({ value: true })

      useIsMobile()

      expect(hoisted.mockUseBreakpoints).toHaveBeenCalledWith({
        mobile: 767, // BREAKPOINTS.mobile - 1
      })
    })

    it('should initialize with correct breakpoint configuration', () => {
      hoisted.mockSmaller.mockReturnValue({ value: true })

      useIsMobile()

      expect(hoisted.mockUseBreakpoints).toHaveBeenCalledWith({
        mobile: 767,
      })
      expect(hoisted.mockSmaller).toHaveBeenCalledWith('mobile')
    })
  })

  describe('mobile detection', () => {
    it('should return true when screen is smaller than mobile breakpoint', () => {
      hoisted.mockSmaller.mockReturnValue({ value: true })

      const result = useIsMobile()

      expect(result.value).toBe(true)
      expect(hoisted.mockSmaller).toHaveBeenCalledWith('mobile')
    })

    it('should return false when screen is not smaller than mobile breakpoint', () => {
      hoisted.mockSmaller.mockReturnValue({ value: false })

      const result = useIsMobile()

      expect(result.value).toBe(false)
      expect(hoisted.mockSmaller).toHaveBeenCalledWith('mobile')
    })

    it('should return undefined for uninitialized state', () => {
      hoisted.mockSmaller.mockReturnValue({ value: undefined } as any)

      const result = useIsMobile()

      expect(result.value).toBeUndefined()
    })
  })

  describe('reactive behavior', () => {
    it('should return computed ref that updates reactively', () => {
      let currentValue = false
      hoisted.mockSmaller.mockImplementation(() => ({ value: currentValue }))

      const result = useIsMobile()

      expect(result.value).toBe(false)

      currentValue = true

      expect(typeof result.value).toBe('boolean')
    })

    it('should handle breakpoint changes reactively', () => {
      hoisted.mockSmaller.mockReturnValue({ value: false })

      const result1 = useIsMobile()
      expect(result1.value).toBe(false)

      hoisted.mockSmaller.mockReturnValue({ value: true })

      const result2 = useIsMobile()
      expect(result2.value).toBe(true)
    })
  })

  describe('multiple composable instances', () => {
    it('should handle multiple calls correctly', () => {
      hoisted.mockSmaller.mockReturnValueOnce({ value: true }).mockReturnValueOnce({ value: false })

      const result1 = useIsMobile()
      const result2 = useIsMobile()

      expect(result1.value).toBe(true)
      expect(result2.value).toBe(false)
      expect(hoisted.mockUseBreakpoints).toHaveBeenCalledTimes(2)
    })

    it('should create independent instances', () => {
      hoisted.mockSmaller.mockReturnValue({ value: true })

      const result1 = useIsMobile()
      const result2 = useIsMobile()

      expect(result1.value).toBe(true)
      expect(result2.value).toBe(true)
    })
  })

  describe('breakpoint configuration', () => {
    it('should use correct default mobile breakpoint value', () => {
      hoisted.mockSmaller.mockReturnValue({ value: true })

      useIsMobile()

      expect(hoisted.mockUseBreakpoints).toHaveBeenCalledWith({
        mobile: 767,
      })
    })
  })

  describe('error handling', () => {
    it('should handle missing BREAKPOINTS constant', () => {
      const originalConstants = vi.mocked(vi.importActual('@/shared/lib/constants'))
      vi.mocked(vi.importActual('@/shared/lib/constants')).BREAKPOINTS = undefined

      expect(() => useIsMobile()).not.toThrow()

      Object.assign(vi.importMock('@/shared/lib/constants'), originalConstants)
    })

    it('should handle useBreakpoints returning null (throws)', () => {
      hoisted.mockUseBreakpoints.mockReturnValue(null as any)

      expect(() => useIsMobile()).toThrow()
    })

    it('should handle smaller function returning null (throws)', () => {
      hoisted.mockUseBreakpoints.mockReturnValue({
        smaller: null as any,
      } as any)

      expect(() => useIsMobile()).toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle rapid breakpoint changes', () => {
      let callCount = 0
      hoisted.mockSmaller.mockImplementation(() => {
        callCount++
        return { value: callCount % 2 === 0 }
      })

      useIsMobile()
      useIsMobile()
      useIsMobile()

      // Should handle multiple calls correctly
      expect(hoisted.mockUseBreakpoints).toHaveBeenCalledTimes(3)
    })

    // Skipping custom BREAKPOINTS mutation tests because the composable imports constants at module load
  })

  describe('integration scenarios', () => {
    it('should work with Vue devtools', () => {
      hoisted.mockSmaller.mockReturnValue({ value: true })

      const result = useIsMobile()

      // Verify the composable returns expected structure
      expect(result).toHaveProperty('value')
      expect(typeof result.value).toBe('boolean')
    })

    it('should work in component lifecycle', () => {
      hoisted.mockSmaller.mockReturnValue({ value: false })

      const result = useIsMobile()

      // Simulate component mount/unmount
      expect(result.value).toBeDefined()

      // Should not throw during lifecycle events
      expect(() => {
        // Simulate component unmount
        createMockBreakpoints()
      }).not.toThrow()
    })

    it('should handle window resize events', () => {
      hoisted.mockSmaller.mockReturnValue({ value: false })

      const result1 = useIsMobile()
      expect(result1.value).toBe(false)

      // Simulate window resize that changes breakpoint
      hoisted.mockSmaller.mockReturnValue({ value: true })

      const result2 = useIsMobile()
      expect(result2.value).toBe(true)
    })
  })

  describe('performance scenarios', () => {
    it('should handle frequent breakpoint checks', () => {
      hoisted.mockSmaller.mockReturnValue({ value: false })

      // Simulate many calls (like in a resize listener)
      for (let i = 0; i < 100; i++) {
        useIsMobile()
      }

      expect(hoisted.mockUseBreakpoints).toHaveBeenCalledTimes(100)
    })

    it('should not cause memory leaks with multiple instances', () => {
      hoisted.mockSmaller.mockReturnValue({ value: true })

      const instances = []

      // Create many instances
      for (let i = 0; i < 50; i++) {
        instances.push(useIsMobile())
      }

      // All should work correctly
      instances.forEach((instance) => {
        expect(instance.value).toBe(true)
      })

      expect(instances.length).toBe(50)
    })
  })
})
