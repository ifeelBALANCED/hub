<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Card, Input } from '@/shared/ui/additionals'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  MessageSquare,
  Users,
  Phone,
  Settings,
  MoreVertical,
} from 'lucide-vue-next'

const router = useRouter()

const isMicOn = ref(true)
const isVideoOn = ref(true)
const isChatOpen = ref(false)
const isParticipantsOpen = ref(false)

const participants = reactive([
  { id: 1, name: 'You', isMuted: !isMicOn.value, isVideoOn: isVideoOn.value },
  { id: 2, name: 'Alice Johnson', isMuted: false, isVideoOn: true },
  { id: 3, name: 'Bob Smith', isMuted: true, isVideoOn: true },
  { id: 4, name: 'Carol Williams', isMuted: false, isVideoOn: false },
])

const handleLeave = () => {
  router.push('/dashboard')
}

const handleToggleMic = () => {
  isMicOn.value = !isMicOn.value
}

const handleToggleVideo = () => {
  isVideoOn.value = !isVideoOn.value
}

const handleToggleChat = () => {
  isChatOpen.value = !isChatOpen.value
  if (isChatOpen.value) {
    isParticipantsOpen.value = false
  }
}

const handleToggleParticipants = () => {
  isParticipantsOpen.value = !isParticipantsOpen.value
  if (isParticipantsOpen.value) {
    isChatOpen.value = false
  }
}
</script>

<template>
  <div class="flex h-screen flex-col bg-background">
    <!-- Top Bar -->
    <header class="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div class="flex items-center gap-4">
        <h1 class="font-semibold">Team Meeting</h1>
        <div
          class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
        >
          <span class="inline-block h-2 w-2 rounded-full bg-success mr-1.5"></span>
          23:45
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Settings class="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical class="h-5 w-5" />
        </Button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Video Grid -->
      <div class="flex-1 p-4">
        <div class="grid h-full gap-4 md:grid-cols-2">
          <Card
            v-for="participant in participants"
            :key="participant.id"
            class="relative overflow-hidden bg-secondary"
          >
            <div class="flex h-full items-center justify-center">
              <div v-if="participant.isVideoOn" class="text-center text-muted-foreground">
                <Video class="mx-auto h-12 w-12" />
                <p class="mt-2 text-sm">{{ participant.name }}</p>
              </div>
              <div
                v-else
                class="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground"
              >
                {{ participant.name.charAt(0) }}
              </div>
            </div>

            <div class="absolute bottom-3 left-3 flex items-center gap-2">
              <span class="rounded bg-background/80 px-2 py-1 text-xs font-medium">
                {{ participant.name }}
              </span>
              <div v-if="participant.isMuted" class="rounded bg-destructive p-1">
                <MicOff class="h-3 w-3 text-destructive-foreground" />
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Side Panel -->
      <div v-if="isChatOpen || isParticipantsOpen" class="w-80 border-l border-border bg-card">
        <!-- Chat Panel -->
        <div v-if="isChatOpen" class="flex h-full flex-col">
          <div class="border-b border-border p-4">
            <h2 class="font-semibold">Chat</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-4">
              <div class="rounded-lg bg-secondary p-3">
                <p class="text-sm font-medium">Alice Johnson</p>
                <p class="text-sm text-muted-foreground">Hello everyone!</p>
              </div>
            </div>
          </div>
          <div class="border-t border-border p-4">
            <Input type="text" placeholder="Type a message..." class="w-full" />
          </div>
        </div>

        <!-- Participants Panel -->
        <div v-if="isParticipantsOpen" class="flex h-full flex-col">
          <div class="border-b border-border p-4">
            <h2 class="font-semibold">Participants ({{ participants.length }})</h2>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-2">
              <div
                v-for="participant in participants"
                :key="participant.id"
                class="flex items-center justify-between rounded-lg p-2 hover:bg-secondary"
              >
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
                  >
                    {{ participant.name.charAt(0) }}
                  </div>
                  <span class="text-sm">{{ participant.name }}</span>
                </div>
                <MicOff v-if="participant.isMuted" class="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Toolbar -->
    <div class="flex h-20 items-center justify-center border-t border-border bg-card">
      <div class="flex items-center gap-2">
        <Button :variant="isMicOn ? 'default' : 'destructive'" size="icon" @click="handleToggleMic">
          <Mic v-if="isMicOn" class="h-5 w-5" />
          <MicOff v-else class="h-5 w-5" />
        </Button>

        <Button
          :variant="isVideoOn ? 'default' : 'destructive'"
          size="icon"
          @click="handleToggleVideo"
        >
          <Video v-if="isVideoOn" class="h-5 w-5" />
          <VideoOff v-else class="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <MonitorUp class="h-5 w-5" />
        </Button>

        <Button :variant="isChatOpen ? 'secondary' : 'ghost'" size="icon" @click="handleToggleChat">
          <MessageSquare class="h-5 w-5" />
        </Button>

        <Button
          :variant="isParticipantsOpen ? 'secondary' : 'ghost'"
          size="icon"
          @click="handleToggleParticipants"
        >
          <Users class="h-5 w-5" />
        </Button>

        <div class="mx-4 h-8 w-px bg-border" />

        <Button variant="destructive" @click="handleLeave">
          <Phone class="mr-2 h-5 w-5" />
          Leave
        </Button>
      </div>
    </div>
  </div>
</template>
