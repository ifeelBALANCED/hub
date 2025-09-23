<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'
import HubButton from '@/shared/ui/core/HubButton.vue'
import Input from '@/shared/ui/additionals/Input.vue'
import Label from '@/shared/ui/additionals/Label.vue'

const router = useRouter()

const showPassword = ref(false)
const step = ref(1)
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  company: '',
  teamSize: '',
  useCase: '',
})

const passwordStrength = computed(() => {
  return formData.value.password.length >= 8
    ? 'strong'
    : formData.value.password.length >= 6
      ? 'medium'
      : 'weak'
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  if (step.value < 2) {
    step.value = step.value + 1
  } else {
    router.push('/meeting')
  }
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const goHome = () => {
  router.push('/')
}

const goToSignIn = () => {
  router.push('/signin')
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
          <h1 class="text-3xl font-bold text-foreground">
            {{ step === 1 ? 'Create your account' : 'Tell us about yourself' }}
          </h1>
          <p class="text-foreground-muted">
            {{ step === 1 ? 'Start your journey with Hub' : 'Help us personalize your experience' }}
          </p>
        </div>

        <div class="flex items-center justify-center space-x-2">
          <div
            :class="`w-2 h-2 rounded-full ${step >= 1 ? 'bg-accent' : 'bg-border'} transition-colors`"
          />
          <div
            :class="`w-2 h-2 rounded-full ${step >= 2 ? 'bg-accent' : 'bg-border'} transition-colors`"
          />
        </div>
      </div>

      <div class="bg-card border border-border rounded-xl p-8 shadow-soft">
        <form @submit="handleSubmit" class="space-y-6">
          <template v-if="step === 1">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="firstName" class="text-card-foreground">First name</Label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  v-model="formData.firstName"
                  class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent"
                />
              </div>
              <div class="space-y-2">
                <Label for="lastName" class="text-card-foreground">Last name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  v-model="formData.lastName"
                  class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent"
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email" class="text-card-foreground">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
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
                  placeholder="Create a strong password"
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

              <div v-if="formData.password" class="space-y-2">
                <div class="flex space-x-1">
                  <div
                    :class="`h-1 flex-1 rounded ${passwordStrength === 'weak' ? 'bg-destructive' : 'bg-border'}`"
                  />
                  <div
                    :class="`h-1 flex-1 rounded ${passwordStrength === 'medium' ? 'bg-warning' : passwordStrength === 'strong' ? 'bg-success' : 'bg-border'}`"
                  />
                  <div
                    :class="`h-1 flex-1 rounded ${passwordStrength === 'strong' ? 'bg-success' : 'bg-border'}`"
                  />
                </div>
                <p class="text-xs text-foreground-muted">
                  Password strength:
                  <span
                    :class="`font-medium ${
                      passwordStrength === 'weak'
                        ? 'text-destructive'
                        : passwordStrength === 'medium'
                          ? 'text-warning'
                          : 'text-success'
                    }`"
                  >
                    {{
                      passwordStrength === 'weak'
                        ? 'Weak'
                        : passwordStrength === 'medium'
                          ? 'Medium'
                          : 'Strong'
                    }}
                  </span>
                </p>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="space-y-2">
              <Label for="company" class="text-card-foreground">Company name</Label>
              <Input
                id="company"
                type="text"
                placeholder="Your company"
                v-model="formData.company"
                class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent"
              />
            </div>

            <div class="space-y-2">
              <Label for="teamSize" class="text-card-foreground">Team size</Label>
              <select
                id="teamSize"
                v-model="formData.teamSize"
                class="w-full p-2 bg-background-secondary border border-border rounded-md text-foreground focus:border-accent focus:outline-none"
              >
                <option value="">Select team size</option>
                <option value="1-5">1-5 people</option>
                <option value="6-20">6-20 people</option>
                <option value="21-50">21-50 people</option>
                <option value="51-200">51-200 people</option>
                <option value="200+">200+ people</option>
              </select>
            </div>

            <div class="space-y-2">
              <Label for="useCase" class="text-card-foreground">Primary use case</Label>
              <select
                id="useCase"
                v-model="formData.useCase"
                class="w-full p-2 bg-background-secondary border border-border rounded-md text-foreground focus:border-accent focus:outline-none"
              >
                <option value="">Select use case</option>
                <option value="team-meetings">Team meetings</option>
                <option value="client-calls">Client calls</option>
                <option value="webinars">Webinars</option>
                <option value="training">Training sessions</option>
                <option value="other">Other</option>
              </select>
            </div>
          </template>

          <HubButton type="submit" variant="hero" size="lg" class="w-full">
            {{ step === 1 ? 'Continue' : 'Create Account' }}
          </HubButton>
        </form>

        <template v-if="step === 1">
          <div class="mt-6 text-center">
            <p class="text-foreground-muted">
              Already have an account?
              <button
                @click="goToSignIn"
                class="text-accent hover:text-accent/80 transition-colors font-medium ml-1"
              >
                Sign in
              </button>
            </p>
          </div>

          <div class="space-y-4 mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-border" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-card px-4 text-foreground-muted">Or continue with</span>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <HubButton variant="outline" class="w-full">
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
              <HubButton variant="outline" class="w-full">
                <svg class="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
                Facebook
              </HubButton>
            </div>
          </div>
        </template>
      </div>

      <div v-if="step === 2" class="text-center">
        <p class="text-sm text-foreground-muted">
          By creating an account, you agree to our
          <a href="#" class="text-accent hover:text-accent/80 transition-colors ml-1">
            Terms of Service
          </a>
          and
          <a href="#" class="text-accent hover:text-accent/80 transition-colors ml-1">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
