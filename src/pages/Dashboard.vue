<script setup lang="ts">
import { Button, Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/additionals'
import ThemeToggle from '@/shared/ui/core/ThemeToggle.vue'
import { Video, Calendar, Clock, Users, Plus } from 'lucide-vue-next'

const upcomingMeetings = [
  { id: 1, title: 'Team Standup', time: '10:00 AM', participants: 5, date: 'Today' },
  { id: 2, title: 'Client Presentation', time: '2:00 PM', participants: 8, date: 'Today' },
  { id: 3, title: 'Design Review', time: '11:00 AM', participants: 4, date: 'Tomorrow' },
]
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <header class="border-b border-border bg-card">
      <div class="container flex h-14 items-center justify-between">
        <RouterLink to="/" class="flex items-center gap-2 font-semibold">
          <Video class="h-6 w-6 text-primary" />
          <span class="text-xl">Hub</span>
        </RouterLink>

        <nav class="flex items-center gap-6">
          <RouterLink to="/dashboard" class="text-sm font-medium text-foreground">
            Dashboard
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Meetings
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Recordings
          </RouterLink>
          <RouterLink
            to="/dashboard"
            class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </RouterLink>
        </nav>

        <div class="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Users class="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>

    <main class="container py-8">
      <!-- Quick Actions -->
      <div class="mb-8">
        <h1 class="mb-6 text-3xl font-bold">Welcome back</h1>

        <div class="grid gap-4 md:grid-cols-3">
          <RouterLink to="/meeting">
            <Card class="cursor-pointer transition-all hover:shadow-md">
              <CardContent class="flex items-center gap-4 p-6">
                <div class="rounded-lg bg-primary p-3">
                  <Video class="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 class="font-semibold">New Meeting</h3>
                  <p class="text-sm text-muted-foreground">Start an instant meeting</p>
                </div>
              </CardContent>
            </Card>
          </RouterLink>

          <RouterLink to="/join">
            <Card class="cursor-pointer transition-all hover:shadow-md">
              <CardContent class="flex items-center gap-4 p-6">
                <div class="rounded-lg bg-secondary p-3">
                  <Plus class="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 class="font-semibold">Join with Code</h3>
                  <p class="text-sm text-muted-foreground">Enter meeting code</p>
                </div>
              </CardContent>
            </Card>
          </RouterLink>

          <Card class="cursor-pointer transition-all hover:shadow-md">
            <CardContent class="flex items-center gap-4 p-6">
              <div class="rounded-lg bg-secondary p-3">
                <Calendar class="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <h3 class="font-semibold">Schedule</h3>
                <p class="text-sm text-muted-foreground">Plan for later</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Upcoming Meetings -->
      <div>
        <h2 class="mb-4 text-2xl font-semibold">Upcoming Meetings</h2>

        <div class="space-y-3">
          <Card
            v-for="meeting in upcomingMeetings"
            :key="meeting.id"
            class="transition-all hover:shadow-md"
          >
            <CardContent class="flex items-center justify-between p-4">
              <div class="flex items-center gap-4">
                <div class="rounded-lg bg-secondary p-3">
                  <Video class="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <h3 class="font-semibold">{{ meeting.title }}</h3>
                  <div class="flex items-center gap-3 text-sm text-muted-foreground">
                    <span class="flex items-center gap-1">
                      <Clock class="h-4 w-4" />
                      {{ meeting.date }} at {{ meeting.time }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Users class="h-4 w-4" />
                      {{ meeting.participants }} participants
                    </span>
                  </div>
                </div>
              </div>

              <RouterLink to="/meeting">
                <Button>Join</Button>
              </RouterLink>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  </div>
</template>
