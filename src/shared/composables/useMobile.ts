import { useBreakpoints } from '@vueuse/core'
import { BREAKPOINTS } from '@/shared/lib/constants'

/**
 * Determines if the current screen size is considered mobile.
 * Uses responsive breakpoints to detect mobile viewport.
 *
 * @returns {ComputedRef<boolean>} True if screen width is below mobile breakpoint
 */
export function useIsMobile() {
  const breakpoints = useBreakpoints({
    mobile: BREAKPOINTS.mobile - 1,
  })

  return breakpoints.smaller('mobile')
}
