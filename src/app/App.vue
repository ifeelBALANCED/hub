<script setup lang="ts">
import {} from 'vue-router'
import { computed } from 'vue'
import { useRoute, RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'

const route = useRoute()

const layout = computed(() => {
  if (route.meta.layout === null) {
    return null
  }
  return route.meta.layout
})
</script>

<template>
  <Toaster richColors :duration="2000" />
  <component v-if="layout" :is="layout">
    <router-view />
  </component>
  <router-view v-else />
</template>

<style scoped></style>
