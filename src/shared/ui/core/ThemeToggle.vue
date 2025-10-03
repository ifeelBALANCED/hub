<script setup lang="ts">
import { Button } from '@/shared/ui/additionals'
import { useTheme } from '@/shared/composables'
import { Moon, Sun, Monitor } from 'lucide-vue-next'

const {
  isDark,
  currentTheme,
  isSystemTheme,
  toggleTheme,
  setLightTheme,
  setDarkTheme,
  setSystemTheme,
} = useTheme()

// Enhanced toggle with cycle through themes
const cycleTheme = () => {
  if (currentTheme.value === 'light') {
    setDarkTheme()
  } else if (currentTheme.value === 'dark') {
    setSystemTheme()
  } else {
    setLightTheme()
  }
}

// Get appropriate label based on current state
const getAriaLabel = () => {
  if (isSystemTheme.value) {
    return `${isDark.value ? 'Dark' : 'Light'} mode (system preference) - Click to switch to ${isDark.value ? 'light' : 'dark'} mode`
  }
  return `${isDark.value ? 'Dark' : 'Light'} mode - Click to switch to ${isDark.value ? 'system' : 'dark'} mode`
}

// Get tooltip text
const getTooltipText = () => {
  if (isSystemTheme.value) {
    return `System (${isDark.value ? 'Dark' : 'Light'})`
  }
  return isDark.value ? 'Dark' : 'Light'
}
</script>

<template>
  <div class="relative">
    <Button
      variant="ghost"
      size="icon"
      @click="cycleTheme"
      :aria-label="getAriaLabel()"
      class="relative transition-all duration-300 hover:scale-105"
      :title="`Current theme: ${getTooltipText()}`"
    >
      <!-- Light mode icon -->
      <Sun
        class="h-5 w-5 rotate-0 scale-100 transition-all duration-300"
        :class="{
          'opacity-100': currentTheme === 'light',
          'opacity-0 rotate-90 scale-0': currentTheme !== 'light',
        }"
      />

      <!-- Dark mode icon -->
      <Moon
        class="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300"
        :class="{
          'opacity-100 rotate-0 scale-100': currentTheme === 'dark',
          'opacity-0 -rotate-90 scale-0': currentTheme !== 'dark',
        }"
      />

      <!-- System mode icon -->
      <Monitor
        class="absolute h-5 w-5 transition-all duration-300"
        :class="{
          'opacity-100 text-muted-foreground': isSystemTheme,
          'opacity-0 scale-0': !isSystemTheme,
        }"
      />
    </Button>

    <!-- Optional: Theme indicator dot -->
    <div
      class="absolute -top-1 -right-1 h-2 w-2 rounded-full border border-background transition-colors"
      :class="{
        'bg-green-500': isSystemTheme,
        'bg-blue-500': currentTheme === 'light',
        'bg-yellow-500': currentTheme === 'dark',
      }"
    />
  </div>
</template>
