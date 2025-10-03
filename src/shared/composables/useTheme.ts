import { useColorMode, useMediaQuery } from '@vueuse/core'
import { computed, onMounted, watch } from 'vue'
import { THEME_STORAGE_KEY, THEME_DARK_CLASS } from '@/shared/lib/constants'

export type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const colorMode = useColorMode({
    storageKey: THEME_STORAGE_KEY,
    attribute: 'class',
    modes: {
      light: '',
      dark: THEME_DARK_CLASS,
      system: '',
    },
    initialValue: 'system' as Theme,
  })

  const isDark = computed(() => {
    if (colorMode.value === 'system') {
      return prefersDark.value
    }
    return colorMode.value === 'dark'
  })

  const currentTheme = computed(() => colorMode.value)

  const isSystemTheme = computed(() => colorMode.value === 'system')

  const toggleTheme = () => {
    if (colorMode.value === 'system') {
      colorMode.value = prefersDark.value ? 'light' : 'dark'
    } else {
      colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
    }
  }

  const setTheme = (theme: Theme) => {
    colorMode.value = theme
  }

  const setLightTheme = () => setTheme('light')

  const setDarkTheme = () => setTheme('dark')

  const setSystemTheme = () => setTheme('system')

  const applyThemeClass = () => {
    const htmlElement = document.documentElement

    htmlElement.classList.remove(THEME_DARK_CLASS)

    if (colorMode.value === 'dark') {
      htmlElement.classList.add(THEME_DARK_CLASS)
    } else if (colorMode.value === 'system' && prefersDark.value) {
      htmlElement.classList.add(THEME_DARK_CLASS)
    }
  }

  watch(colorMode, applyThemeClass)

  watch(prefersDark, applyThemeClass)

  onMounted(applyThemeClass)

  return {
    theme: colorMode,
    currentTheme,
    isDark,
    isSystemTheme,
    systemPrefersDark: prefersDark,

    toggleTheme,
    setTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,

    applyThemeClass,
  }
}
