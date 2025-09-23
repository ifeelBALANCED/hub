import { useBreakpoints } from '@vueuse/core'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const breakpoints = useBreakpoints({
    mobile: MOBILE_BREAKPOINT - 1,
  })

  return breakpoints.smaller('mobile')
}
