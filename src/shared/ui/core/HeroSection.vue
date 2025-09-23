<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ArrowRight, Video, Shield, Zap } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'

const router = useRouter()

const features = [
  {
    icon: Video,
    title: 'HD Video Calls',
    description: 'Crystal clear video quality with up to 4K resolution',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'End-to-end encryption and enterprise-grade security',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Connect instantly with minimal latency worldwide',
  },
]

const handleStartMeeting = () => {
  const roomId = Math.random().toString(36).substring(2, 8)
  router.push(`/meeting/${roomId}`)
}

const handleJoinMeeting = () => {
  router.push('/meeting')
}

const goToSignIn = () => {
  router.push('/signin')
}

const goToGetStarted = () => {
  router.push('/get-started')
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="flex items-center justify-between p-6 border-b border-border">
      <div class="flex items-center space-x-2">
        <div
          class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow"
        >
          <span class="text-primary-foreground font-bold text-xl">H</span>
        </div>
        <span class="text-2xl font-semibold text-foreground">Hub</span>
      </div>

      <nav class="hidden md:flex items-center space-x-8">
        <a href="#features" class="text-foreground-muted hover:text-foreground transition-colors">
          Features
        </a>
        <a href="#pricing" class="text-foreground-muted hover:text-foreground transition-colors">
          Pricing
        </a>
        <a href="#about" class="text-foreground-muted hover:text-foreground transition-colors">
          About
        </a>
      </nav>

      <div class="flex items-center space-x-3">
        <HubButton variant="ghost" @click="goToSignIn"> Sign In </HubButton>
        <HubButton variant="hero" @click="goToGetStarted"> Get Started </HubButton>
      </div>
    </header>

    <div class="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div class="max-w-4xl mx-auto space-y-8 animate-slide-up">
        <h1 class="text-5xl md:text-7xl font-bold text-foreground leading-tight">
          Video meetings,
          <br />
          <span class="bg-gradient-primary bg-clip-text text-transparent animate-glow">
            reimagined
          </span>
        </h1>

        <p class="text-xl md:text-2xl text-foreground-muted max-w-2xl mx-auto leading-relaxed">
          Connect with your team through crystal-clear video calls, built for the modern workplace.
          Fast, secure, and beautifully simple.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <HubButton variant="hero" size="lg" class="text-lg px-8" @click="handleStartMeeting">
            Start Meeting
            <ArrowRight class="ml-2 h-5 w-5" />
          </HubButton>
          <HubButton variant="outline" size="lg" class="text-lg px-8" @click="handleJoinMeeting">
            Join Meeting
          </HubButton>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20 animate-fade-in">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-sharp transition-all duration-300 hover:scale-[1.02]"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div
            class="w-12 h-12 bg-gradient-secondary rounded-lg flex items-center justify-center mb-4"
          >
            <component :is="feature.icon" class="h-6 w-6 text-accent" />
          </div>
          <h3 class="text-lg font-semibold text-card-foreground mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-foreground-muted">
            {{ feature.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
