<template>
  <Transition
    enter-active-class="transition-opacity duration-75 ease-out"
    leave-active-class="transition-opacity duration-100 ease-in"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isActive" class="absolute inset-0 pointer-events-none rounded-lg overflow-hidden">
      <div
        class="absolute inset-0 rounded-lg border-4 animate-pulse"
        :style="{
          borderColor: ringColor,
          opacity: intensity,
          boxShadow: `0 0 ${intensity * 20}px ${ringColor}`,
          animation: `wave ${waveSpeed}s ease-in-out infinite`,
        }"
      ></div>
      <div
        class="absolute inset-0 rounded-lg border-2"
        :style="{
          borderColor: ringColor,
          opacity: intensity * 0.5,
          animation: `wave-secondary ${waveSpeed * 1.5}s ease-in-out infinite`,
        }"
      ></div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isActive: boolean
  intensity?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  intensity: 0.8,
  color: '#3b82f6',
})

const ringColor = computed(() => props.color)
const waveSpeed = computed(() => Math.max(0.5, 1.5 - props.intensity * 0.5))
</script>

<style scoped>
@keyframes wave {
  0%,
  100% {
    transform: scale(1);
    opacity: v-bind('intensity');
  }
  50% {
    transform: scale(1.02);
    opacity: calc(v-bind('intensity') * 0.6);
  }
}

@keyframes wave-secondary {
  0%,
  100% {
    transform: scale(0.98);
    opacity: calc(v-bind('intensity') * 0.5);
  }
  50% {
    transform: scale(1.04);
    opacity: calc(v-bind('intensity') * 0.2);
  }
}
</style>
