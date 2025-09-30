<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
import { useLoginForm } from '@/features/auth/lib/useLoginForm'
import Label from '@/shared/ui/additionals/Label.vue'
import HubButton from '@/shared/ui/core/HubButton.vue'
import Input from '@/shared/ui/additionals/Input.vue'

const { onSubmit, loginMutation } = useLoginForm()
</script>

<template>
  <form @submit.prevent="onSubmit" class="space-y-6">
    <div class="space-y-2">
      <Label for="email" class="text-sm font-medium text-card-foreground">Email</Label>
      <Field v-slot="{ field }" name="email">
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          v-bind="field"
          class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </Field>
      <ErrorMessage name="email" class="text-sm text-destructive" />
    </div>

    <div class="space-y-2">
      <Label for="password" class="text-sm font-medium text-card-foreground">Password</Label>
      <Field v-slot="{ field }" name="password">
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          v-bind="field"
          class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </Field>
      <ErrorMessage name="password" class="text-sm text-destructive" />
    </div>

    <HubButton
      type="submit"
      :disabled="loginMutation.isPending.value"
      class="w-full h-11 text-base font-medium"
      variant="hero"
    >
      <span v-if="loginMutation.isPending.value" class="animate-pulse">Signing In...</span>
      <span v-else>Sign In</span>
    </HubButton>
  </form>
</template>

<style scoped></style>
