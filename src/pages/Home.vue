<script setup lang="ts">
import { Navbar } from '@/shared/ui/core'
import { Button, Card } from '@/shared/ui/additionals'
import { Video, Calendar, Users, Shield } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Navbar />

    <main class="flex-grow">
      <section class="container py-16 md:py-24">
        <div class="mx-auto max-w-3xl text-center">
          <h1 class="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
            Video Collaboration,
            <br />
            <span class="text-primary">Simplified</span>
          </h1>
          <p class="mb-8 text-lg text-muted-foreground md:text-xl">
            Connect with your team through high-quality video meetings. Clean, focused, and
            reliable.
          </p>

          <div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <RouterLink to="/dashboard">
              <Button variant="hero" size="lg" class="w-full sm:w-auto">
                <Video class="mr-2" />
                New Meeting
              </Button>
            </RouterLink>
            <RouterLink to="/join">
              <Button variant="outline" size="lg" class="w-full sm:w-auto"> Join with Code </Button>
            </RouterLink>
          </div>
        </div>
      </section>

      <section class="container py-12 md:py-16">
        <div class="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card class="p-6 transition-all hover:shadow-md">
            <Video class="mb-4 h-10 w-10 text-primary" />
            <h3 class="mb-2 text-xl font-semibold">High Quality Video</h3>
            <p class="text-muted-foreground">
              Crystal clear video and audio for seamless communication.
            </p>
          </Card>

          <Card class="p-6 transition-all hover:shadow-md">
            <Calendar class="mb-4 h-10 w-10 text-primary" />
            <h3 class="mb-2 text-xl font-semibold">Easy Scheduling</h3>
            <p class="text-muted-foreground">
              Schedule meetings and send invites with just a few clicks.
            </p>
          </Card>

          <Card class="p-6 transition-all hover:shadow-md">
            <Users class="mb-4 h-10 w-10 text-primary" />
            <h3 class="mb-2 text-xl font-semibold">Team Collaboration</h3>
            <p class="text-muted-foreground">Share screens, chat, and collaborate in real-time.</p>
          </Card>

          <Card class="p-6 transition-all hover:shadow-md">
            <Shield class="mb-4 h-10 w-10 text-primary" />
            <h3 class="mb-2 text-xl font-semibold">Secure & Private</h3>
            <p class="text-muted-foreground">
              End-to-end encryption keeps your conversations private.
            </p>
          </Card>
        </div>
      </section>
    </main>

    <footer class="border-t border-border bg-background">
      <div class="container py-8">
        <div class="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div class="flex items-center gap-2 font-semibold">
            <Video class="h-5 w-5 text-primary" />
            <span>Hub</span>
          </div>
          <nav class="flex gap-6 text-sm text-muted-foreground">
            <a href="#" class="hover:text-foreground transition-colors">About</a>
            <a href="#" class="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" class="hover:text-foreground transition-colors">Terms</a>
            <a href="#" class="hover:text-foreground transition-colors">Help</a>
          </nav>
        </div>
      </div>
    </footer>
  </div>
</template>
