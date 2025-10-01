<script setup lang="ts">
import { useRouter } from 'vue-router'
import HeroSection from '@/shared/ui/core/HeroSection.vue'

const router = useRouter()

const handleJoinMeeting = () => {
  router.push('/meeting')
}

const handleSignIn = () => {
  router.push({ name: 'sign-in' })
}

const handleGetStarted = () => {
  router.push('/get-started')
}
</script>

<template>
  <HeroSection
    @joinMeeting="handleJoinMeeting"
    @signIn="handleSignIn"
    @getStarted="handleGetStarted"
  />
</template>
