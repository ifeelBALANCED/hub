import { computed, provide, inject, type InjectionKey, ref, type Ref } from 'vue'
import { useColorMode, usePreferredDark } from '@vueuse/core'
import { THEME_STORAGE_KEY, THEME_DARK_CLASS } from '@/shared/lib/constants'

export type Theme = 'light' | 'dark' | 'system'
export type Resolved = 'light' | 'dark'

export interface ThemeContext {
  theme: Readonly<Ref<Theme>>
  actualTheme: Readonly<Ref<Resolved>>
  isDark: Readonly<Ref<boolean>>
  toggleTheme: () => void
  setTheme: (t: Theme) => void
  cycleTheme: () => void
}

export const ThemeContextKey: InjectionKey<ThemeContext> = Symbol('ThemeContext')

const CYCLE: Theme[] = ['light', 'dark', 'system']
const nextInCycle = (current: Theme): Theme | undefined => {
  const i = CYCLE.indexOf(current)
  return CYCLE[(i + 1) % CYCLE.length]
}

function useThemeCore(): ThemeContext {
  const prefersDark = typeof window !== 'undefined' ? usePreferredDark() : ref(false)

  const mode = useColorMode<'light' | 'dark' | 'auto'>({
    storageKey: THEME_STORAGE_KEY,
    selector: 'html',
    attribute: 'class',
    modes: { dark: THEME_DARK_CLASS },
    initialValue: 'auto',
    emitAuto: true,
  })

  const theme = computed<Theme>({
    get: () => (mode.value === 'auto' ? 'system' : mode.value),
    set: (v) => {
      mode.value = v === 'system' ? 'auto' : v
    },
  })

  const actualTheme = computed<Resolved>(() => {
    if (mode.value === 'dark') return 'dark'
    if (mode.value === 'light') return 'light'
    return prefersDark.value ? 'dark' : 'light'
  })

  const isDark = computed(() => actualTheme.value === 'dark')

  const toggleTheme = () => {
    if (theme.value === 'system') {
      theme.value = prefersDark.value ? 'light' : 'dark'
      return
    }
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (t: Theme) => {
    theme.value = t
  }

  const cycleTheme = () => {
    theme.value = nextInCycle(theme.value) ?? 'light'
  }

  return {
    theme,
    actualTheme,
    isDark,
    toggleTheme,
    setTheme,
    cycleTheme,
  }
}

/** Call once near app root (e.g., in App.vue setup()). */
export function createThemeProvider(): void {
  provide(ThemeContextKey, useThemeCore())
}

/** Consume anywhere below the provider. */
export function useThemeContext(): ThemeContext {
  const ctx = inject(ThemeContextKey)
  if (!ctx) throw new Error('useThemeContext must be used within a ThemeProvider')
  return ctx
}
