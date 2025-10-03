<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/additionals'
import { Video, Mic, MicOff, VideoOff } from 'lucide-vue-next'

const router = useRouter()
const meetingCode = ref('')
const isMicOn = ref(true)
const isVideoOn = ref(true)

const handleJoin = () => {
  if (meetingCode.value.trim()) {
    router.push('/meeting')
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="w-full max-w-2xl">
      <div class="mb-8 text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2 font-semibold text-2xl">
          <Video class="h-8 w-8 text-primary" />
          <span>Hub</span>
        </RouterLink>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <!-- Meeting Code -->
        <Card class="shadow-lg">
          <CardHeader>
            <CardTitle>Join Meeting</CardTitle>
            <CardDescription>Enter the meeting code to join</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="space-y-2">
              <Label for="code">Meeting Code</Label>
              <Input id="code" placeholder="abc-defg-hij" v-model="meetingCode" />
            </div>

            <Button class="w-full" @click="handleJoin" :disabled="!meetingCode.trim()">
              Join Meeting
            </Button>

            <div class="text-center">
              <RouterLink
                to="/dashboard"
                class="text-sm text-muted-foreground hover:text-foreground"
              >
                Back to Dashboard
              </RouterLink>
            </div>
          </CardContent>
        </Card>

        <!-- Preview Card -->
        <Card class="shadow-lg">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Check your settings before joining</CardDescription>
          </CardHeader>
          <CardContent class="space-y-4">
            <div class="relative aspect-video overflow-hidden rounded-lg bg-secondary">
              <div class="flex h-full items-center justify-center">
                <div v-if="isVideoOn" class="text-muted-foreground">
                  <Video class="h-12 w-12" />
                  <p class="mt-2 text-sm">Camera Preview</p>
                </div>
                <div v-else class="text-muted-foreground">
                  <VideoOff class="h-12 w-12" />
                  <p class="mt-2 text-sm">Camera Off</p>
                </div>
              </div>
            </div>

            <div class="flex justify-center gap-2">
              <Button
                :variant="isMicOn ? 'default' : 'destructive'"
                size="icon"
                @click="isMicOn = !isMicOn"
              >
                <Mic v-if="isMicOn" class="h-5 w-5" />
                <MicOff v-else class="h-5 w-5" />
              </Button>

              <Button
                :variant="isVideoOn ? 'default' : 'destructive'"
                size="icon"
                @click="isVideoOn = !isVideoOn"
              >
                <Video v-if="isVideoOn" class="h-5 w-5" />
                <VideoOff v-else class="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
