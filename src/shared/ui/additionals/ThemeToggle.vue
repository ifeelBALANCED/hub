<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/shared/ui/additionals'
import { useThemeContext } from '@/shared/composables/useTheme'

const { actualTheme, toggleTheme } = useThemeContext()
</script>

<template>
  <Button
    variant="ghost"
    size="icon"
    @click="toggleTheme"
    class="h-9 w-9 hover:bg-accent transition-colors"
  >
    <Sun v-if="actualTheme === 'dark'" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
    <span class="sr-only">Toggle theme</span>
  </Button>
</template>
