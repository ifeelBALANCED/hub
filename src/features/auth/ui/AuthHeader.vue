<script setup lang="ts">
type Props = {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="text-center space-y-4">
    <div class="flex justify-center">
      <div
        class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
      >
        <span class="text-primary-foreground font-bold text-2xl">H</span>
      </div>
    </div>

    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-foreground">{{ title }}</h1>
      <p v-if="subtitle" class="text-foreground-muted">{{ subtitle }}</p>
    </div>
  </div>
</template>
