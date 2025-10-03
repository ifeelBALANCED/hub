<script setup lang="ts">
import { Button } from '@/shared/ui/additionals'
import { useThemeContext } from '@/shared/composables/useTheme'
import { Moon, Sun, Monitor } from 'lucide-vue-next'

const { theme, cycleTheme } = useThemeContext()
</script>

<template>
  <div class="relative">
    <Button
      variant="ghost"
      size="icon"
      @click="cycleTheme"
      class="relative transition-all duration-300 hover:scale-105"
    >
      <Sun
        class="h-5 w-5 rotate-0 scale-100 transition-all duration-300"
        :class="{
          'opacity-100': theme === 'light',
          'opacity-0 rotate-90 scale-0': theme !== 'light',
        }"
      />

      <Moon
        class="absolute h-5 w-5 rotate-90 scale-0 transition-all duration-300"
        :class="{
          'opacity-100 rotate-0 scale-100': theme === 'dark',
          'opacity-0 -rotate-90 scale-0': theme !== 'dark',
        }"
      />

      <Monitor
        class="absolute h-5 w-5 transition-all duration-300"
        :class="{
          'opacity-100 text-muted-foreground': theme === 'system',
          'opacity-0 scale-0': theme !== 'system',
        }"
      />
    </Button>

    <div
      class="absolute -top-1 -right-1 h-2 w-2 rounded-full border border-background transition-colors"
      :class="{
        'bg-green-500': theme === 'system',
        'bg-blue-500': theme === 'light',
        'bg-yellow-500': theme === 'dark',
      }"
    />
  </div>
</template>
