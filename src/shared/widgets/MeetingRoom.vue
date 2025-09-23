<script setup lang="ts">
import HubHeader from './Header.vue'
import VideoGrid from './VideoGrid.vue'
import MeetingControls from '@/shared/ui/core/Controls.vue'
</script>

<template>
  <div className="min-h-screen bg-background flex flex-col animate-fade-in">
    <HubHeader />
    <VideoGrid />
    <MeetingControls />
  </div>
</template>
