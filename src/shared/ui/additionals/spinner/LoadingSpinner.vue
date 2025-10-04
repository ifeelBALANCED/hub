<script setup lang="ts">
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<LoadingSpinnerProps>(), {
  size: 'md',
})

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}
</script>

<template>
  <div
    :class="[
      'animate-spin rounded-full border-2 border-gray-300 border-t-primary',
      sizeClasses[props.size],
      props.class,
    ]"
    role="status"
    aria-label="Loading"
  >
    <span class="sr-only">Loading...</span>
  </div>
</template>
