import { readonly, provide, inject, type Ref, type InjectionKey, computed, watch } from 'vue'
import { useLocalStorage, useMediaQuery } from '@vueuse/core'
import { THEME_STORAGE_KEY, THEME_DARK_CLASS } from '@/shared/lib/constants'

/**
 * Available theme options for the application.
 */
export type Theme = 'dark' | 'light' | 'system'

/**
 * Context interface for theme management.
 */
type ThemeContext = {
  theme: Readonly<Ref<Theme>>
  actualTheme: Readonly<Ref<'dark' | 'light'>>
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContextKey: InjectionKey<ThemeContext> = Symbol('theme-context')

/**
 * Provides theme management functionality with local storage persistence.
 * Automatically detects system preference and applies theme classes.
 *
 * @returns {Object} Theme context with current theme, actual theme, and control functions
 */
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
        document.documentElement.classList.add(THEME_DARK_CLASS)
      } else {
        document.documentElement.classList.remove(THEME_DARK_CLASS)
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

/**
 * Creates and provides the theme context to child components.
 * Must be called in a parent component to enable theme functionality.
 *
 * @example
 * ```vue
 * <script setup>
 * import { createThemeProvider } from '@/shared/composables/useTheme'
 *
 * createThemeProvider()
 * </script>
 * ```
 */
export function createThemeProvider() {
  const { theme, actualTheme, toggleTheme, setTheme } = useTheme()

  provide(ThemeContextKey, {
    theme,
    actualTheme,
    toggleTheme,
    setTheme,
  })
}

/**
 * Consumes the theme context from a parent provider.
 * Throws an error if used outside of a ThemeProvider.
 *
 * @returns {ThemeContext} The theme context with theme state and controls
 * @throws {Error} If used outside of a ThemeProvider
 */
export function useThemeContext(): ThemeContext {
  const context = inject(ThemeContextKey)

  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider')
  }

  return context
}
