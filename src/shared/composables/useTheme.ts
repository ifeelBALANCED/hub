import { readonly, provide, inject, type Ref, type InjectionKey, computed, watch } from 'vue'
import { useLocalStorage, useMediaQuery } from '@vueuse/core'

export type Theme = 'dark' | 'light' | 'system'

type ThemeContext = {
  theme: Readonly<Ref<Theme>>
  actualTheme: Readonly<Ref<'dark' | 'light'>>
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const THEME_STORAGE_KEY = 'hub-theme'
const ThemeContextKey: InjectionKey<ThemeContext> = Symbol('theme-context')

export function useTheme() {
  const theme = useLocalStorage<Theme>(THEME_STORAGE_KEY, 'system')

  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)')

  const actualTheme = computed(() => {
    if (theme.value === 'system') {
      return isDarkMode.value ? 'dark' : 'light'
    }
    return theme.value
  })

  watch(
    actualTheme,
    (newTheme) => {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    { immediate: true },
  )

  const toggleTheme = () => {
    const newTheme = actualTheme.value === 'light' ? 'dark' : 'light'
    theme.value = newTheme
  }

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme
  }

  return {
    theme: readonly(theme),
    actualTheme: readonly(actualTheme),
    toggleTheme,
    setTheme,
  }
}

export function createThemeProvider() {
  const { theme, actualTheme, toggleTheme, setTheme } = useTheme()

  provide(ThemeContextKey, {
    theme,
    actualTheme,
    toggleTheme,
    setTheme,
  })
}

export function useThemeContext(): ThemeContext {
  const context = inject(ThemeContextKey)

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }

  return context
}
