<script setup lang="ts">
import { useRouter } from 'vue-router'
import AuthHeader from '@/features/auth/ui/AuthHeader.vue'
import LoginForm from '@/features/auth/ui/LoginForm.vue'
import SocialAuth from '@/features/auth/ui/SocialAuth.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goToGetStarted = () => {
  router.push('/get-started')
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6 relative">
    <button
      @click="goHome"
      class="absolute top-6 left-6 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card transition-colors"
    >
      <svg class="w-5 h-5 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <div class="w-full max-w-md space-y-8 animate-fade-in">
      <AuthHeader title="Welcome back" subtitle="Sign in to your Hub account" />

      <div class="bg-card border border-border rounded-xl p-8 shadow-soft">
        <LoginForm />
      </div>

      <div class="text-center">
        <p class="text-foreground-muted">
          Don't have an account?
          <button
            type="button"
            @click="goToGetStarted"
            class="text-accent hover:text-accent/80 transition-colors font-medium ml-1"
          >
            Get Started
          </button>
        </p>
      </div>

      <div class="space-y-4">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-background px-4 text-foreground-muted">Or continue with</span>
          </div>
        </div>
        <SocialAuth />
      </div>
    </div>
  </div>
</template>
