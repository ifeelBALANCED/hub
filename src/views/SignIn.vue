<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'
import Input from '@/shared/ui/additionals/Input.vue'
import Label from '@/shared/ui/additionals/Label.vue'

const router = useRouter()

const showPassword = ref(false)
const keepSignedIn = ref(false)
const formData = ref({
  email: '',
  password: '',
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  router.push('/get-started')
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const goHome = () => {
  router.push('/')
}

const goToGetStarted = () => {
  router.push('/get-started')
}

const handleForgotPassword = () => {
  console.log('Forgot password clicked')
}

const signInWithGoogle = () => {
  console.log('Sign in with Google')
}

const signInWithFacebook = () => {
  console.log('Sign in with Facebook')
}
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-6">
    <div class="w-full max-w-md space-y-8 animate-fade-in">
      <div class="text-center space-y-4">
        <HubButton variant="ghost" size="icon" class="absolute top-6 left-6" @click="goHome">
          <ArrowLeft class="h-4 w-4" />
        </HubButton>

        <div class="flex justify-center">
          <div
            class="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow"
          >
            <span class="text-primary-foreground font-bold text-2xl">H</span>
          </div>
        </div>

        <div class="space-y-2">
          <h1 class="text-3xl font-bold text-foreground">Welcome back</h1>
          <p class="text-foreground-muted">Sign in to your Hub account</p>
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-8 shadow-soft">
        <form @submit="handleSubmit" class="space-y-6">
          <div class="space-y-2">
            <Label for="email" class="text-card-foreground">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              v-model="formData.email"
              class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent"
            />
          </div>

          <div class="space-y-2">
            <Label for="password" class="text-card-foreground">Password</Label>
            <div class="relative">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                v-model="formData.password"
                class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent pr-10"
              />
              <button
                type="button"
                @click="togglePassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground transition-colors"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center space-x-2 text-sm">
              <input type="checkbox" v-model="keepSignedIn" class="rounded border-border" />
              <span class="text-foreground-muted">Keep me signed in</span>
            </label>
            <button
              type="button"
              class="text-sm text-accent hover:text-accent/80 transition-colors"
              @click="handleForgotPassword"
            >
              Forgot password?
            </button>
          </div>

          <HubButton type="submit" variant="hero" size="lg" class="w-full"> Sign In </HubButton>
        </form>

        <div class="mt-6 text-center">
          <p class="text-foreground-muted">
            Don't have an account?
            <button
              @click="goToGetStarted"
              class="text-accent hover:text-accent/80 transition-colors font-medium ml-1"
            >
              Get started
            </button>
          </p>
        </div>
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

        <div class="grid grid-cols-2 gap-3">
          <HubButton variant="outline" class="w-full" @click="signInWithGoogle">
            <svg class="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </HubButton>
          <HubButton variant="outline" class="w-full" @click="signInWithFacebook">
            <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
              />
            </svg>
            Facebook
          </HubButton>
        </div>
      </div>
    </div>
  </div>
</template>
