<script setup lang="ts">
import HubHeader from './Header.vue'
import VideoGrid from './VideoGrid.vue'
import MeetingControls from '@/shared/ui/core/Controls.vue'
</script>

<template>
  <div class="h-screen bg-background flex flex-col animate-fade-in overflow-hidden">
    <div class="flex-shrink-0">
      <HubHeader />
    </div>
    <div class="flex-1 min-h-0">
      <VideoGrid />
    </div>
    <div class="flex-shrink-0">
      <MeetingControls />
    </div>
  </div>
</template>
