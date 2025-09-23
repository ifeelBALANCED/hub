<script setup lang="ts">
import { useRoute } from 'vue-router'
import { watchEffect } from 'vue'

const route = useRoute()

watchEffect(() => {
  console.error('404 Error: User attempted to access non-existent route:', route.path)
})
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background">
    <div class="text-center">
      <h1 class="mb-4 text-4xl font-bold text-foreground">404</h1>
      <p class="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
      <router-link to="/" class="text-primary underline hover:text-primary/80 transition-colors">
        Return to Home
      </router-link>
    </div>
  </div>
</template>
