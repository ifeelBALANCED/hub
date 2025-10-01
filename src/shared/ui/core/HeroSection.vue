<script setup lang="ts">
import { Video, Shield, Zap } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'
import ThemeToggle from '@/shared/ui/additionals/ThemeToggle.vue'
import UserDropdown from '@/shared/ui/core/UserDropdown.vue'
import { CreateRoomButton } from '@/features/create-room'
import { useAuthSession } from '@/shared/composables/useAuth'

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

const authSession = useAuthSession()

const emit = defineEmits<{
  joinMeeting: []
  signIn: []
  getStarted: []
}>()
</script>

<template>
  <div class="min-h-screen bg-background">
    <header class="flex items-center justify-between p-4 md:p-6 border-b border-border">
      <div class="flex items-center space-x-2">
        <div
          class="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow"
        >
          <span class="text-primary-foreground font-bold text-xl">H</span>
        </div>
        <span class="text-2xl font-semibold text-foreground">Hub</span>
      </div>

      <nav class="hidden md:flex items-center space-x-6">
        <a href="#features" class="text-foreground-muted hover:text-foreground transition-colors">
          Features
        </a>
        <a href="#pricing" class="text-foreground-muted hover:text-foreground transition-colors">
          Pricing
        </a>
        <a href="#about" class="text-foreground-muted hover:text-foreground transition-colors">
          About
        </a>
        <div class="w-px h-6 bg-border"></div>
        <ThemeToggle />
      </nav>

      <div class="flex items-center space-x-3">
        <div v-if="!authSession.isAuthenticated" class="flex items-center space-x-2">
          <HubButton variant="ghost" @click="$emit('signIn')"> Sign In </HubButton>
          <HubButton variant="hero" @click="$emit('getStarted')"> Get Started </HubButton>
        </div>

        <UserDropdown v-if="authSession.isAuthenticated" />

        <ThemeToggle class="md:hidden" />
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
          <CreateRoomButton />
          <HubButton variant="outline" size="lg" class="text-lg px-8" @click="$emit('joinMeeting')">
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
