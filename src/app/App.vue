<script setup lang="ts">
import { createThemeProvider } from '@/shared/composables/useTheme'
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'

createThemeProvider()

const route = useRoute()

const layout = computed(() => {
  if (route.meta.layout === null) {
    return null
  }
  return route.meta.layout
})
</script>

<template>
  <div id="app" class="min-h-screen bg-background font-sans antialiased">
    <Toaster richColors :duration="2000" />
    <component v-if="layout" :is="layout">
      <router-view />
    </component>
    <router-view v-else />
  </div>
</template>
