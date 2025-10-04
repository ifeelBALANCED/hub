<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button, Card, CardContent } from '@/shared/ui/additionals'
import LoadingSpinner from '@/shared/ui/additionals/spinner/LoadingSpinner.vue'
import ThemeToggle from '@/shared/ui/core/ThemeToggle.vue'
import { useAuthGuard, useAuthUtils } from '@/features/auth/composables'
import { useGetV1Meetings } from '@/shared/api/client'
import { Video, Calendar, Clock, Users, Plus, LogOut } from 'lucide-vue-next'
import { usePagination } from '@/shared/composables/usePagination'

const authGuard = useAuthGuard({
  mode: 'requireAuth',
  redirectTo: '/auth',
})

const authUtils = useAuthUtils()

const handleLogout = () => {
  authUtils.clearAuth()
}

const limit = ref(10)

const meetingsQuery = useGetV1Meetings(
  computed(() => ({ limit: limit.value })),
  {
    query: {
      enabled: computed(() => !authGuard.isLoading.value),
      placeholderData: (prev) => prev,
    },
  },
)

const meetings = computed(() => meetingsQuery.data.value?.meetings || [])
const total = computed(() => meetings.value.length)
const { page, pageCount, start, end, next, prev, setPage } = usePagination({
  total,
  pageSize: limit,
})
const pagedMeetings = computed(() => meetings.value.slice(start.value, end.value))
</script>

<template>
  <div class="min-h-screen bg-background">
    <div v-if="authGuard.isLoading.value" class="flex min-h-screen items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Main content when auth is ready -->
    <div v-else>
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
            <Button variant="ghost" size="icon" @click="handleLogout" title="Logout">
              <LogOut class="h-5 w-5" />
            </Button>
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

        <div>
          <h2 class="mb-4 text-2xl font-semibold">Your Meetings</h2>

          <div v-if="meetingsQuery.isLoading.value" class="py-8 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>

          <div v-else-if="meetings.length === 0" class="text-muted-foreground py-8">
            No meetings yet.
          </div>

          <div v-else class="space-y-3">
            <Card v-for="m in pagedMeetings" :key="m.id" class="transition-all hover:shadow-md">
              <CardContent class="flex items-center justify-between p-4">
                <div class="flex items-center gap-4">
                  <div class="rounded-lg bg-secondary p-3">
                    <Video class="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 class="font-semibold">{{ m.title || 'Untitled' }}</h3>
                    <div class="flex items-center gap-3 text-sm text-muted-foreground">
                      <span class="flex items-center gap-1">
                        <Clock class="h-4 w-4" />
                        {{ m.scheduledAt || m.createdAt || 'Instant' }}
                      </span>
                      <span v-if="m.code" class="flex items-center gap-1">
                        <Users class="h-4 w-4" />
                        Code: {{ m.code }}
                      </span>
                    </div>
                  </div>
                </div>

                <RouterLink to="/meeting">
                  <Button>Join</Button>
                </RouterLink>
              </CardContent>
            </Card>
            <div class="flex items-center justify-between pt-4">
              <div class="text-sm text-muted-foreground">Page {{ page }} of {{ pageCount }}</div>
              <div class="flex gap-2">
                <Button variant="outline" :disabled="page <= 1" @click="prev()">Prev</Button>
                <Button variant="outline" :disabled="page >= pageCount" @click="next()"
                  >Next</Button
                >
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
