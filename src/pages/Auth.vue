<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/shared/ui/additionals'
import { Video } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const isSignUp = computed(() => route.query.signup === 'true')
const isLoading = ref(false)

const handleSubmit = async (e: Event) => {
  e.preventDefault()
  isLoading.value = true

  // Simulate auth
  setTimeout(() => {
    isLoading.value = false
    router.push('/dashboard')
  }, 1000)
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <div class="mb-8 text-center">
        <RouterLink to="/" class="inline-flex items-center gap-2 font-semibold text-2xl">
          <Video class="h-8 w-8 text-primary" />
          <span>Hub</span>
        </RouterLink>
      </div>

      <Card class="shadow-lg">
        <CardHeader>
          <CardTitle>{{ isSignUp ? 'Create Account' : 'Welcome Back' }}</CardTitle>
          <CardDescription>
            {{
              isSignUp
                ? 'Enter your details to create your account'
                : 'Enter your credentials to access your account'
            }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit="handleSubmit" class="space-y-4">
            <div v-if="isSignUp" class="space-y-2">
              <Label for="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" required />
            </div>

            <div class="space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required />
            </div>

            <div class="space-y-2">
              <Label for="password">Password</Label>
              <Input id="password" type="password" required />
            </div>

            <Button type="submit" class="w-full" :disabled="isLoading">
              {{ isLoading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In' }}
            </Button>

            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <span class="w-full border-t border-border" />
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button type="button" variant="outline" class="w-full">
              <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>
          </form>

          <div class="mt-4 text-center text-sm">
            <template v-if="isSignUp">
              Already have an account?
              <RouterLink to="/auth" class="text-primary hover:underline"> Sign in </RouterLink>
            </template>
            <template v-else>
              Don't have an account?
              <RouterLink to="/auth?signup=true" class="text-primary hover:underline">
                Sign up
              </RouterLink>
            </template>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
