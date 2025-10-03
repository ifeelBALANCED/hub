<script setup lang="ts">
import { Button } from '@/shared/ui/additionals'
import ThemeToggle from './ThemeToggle.vue'
import { Video } from 'lucide-vue-next'
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-14 items-center">
      <RouterLink to="/" class="flex items-center gap-2 font-semibold">
        <Video class="h-6 w-6 text-primary" />
        <span class="text-xl">Hub</span>
      </RouterLink>

      <nav class="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <RouterLink to="/auth">
          <Button variant="ghost" size="sm">Sign In</Button>
        </RouterLink>
        <RouterLink to="/auth?signup=true">
          <Button variant="default" size="sm">Sign Up</Button>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
