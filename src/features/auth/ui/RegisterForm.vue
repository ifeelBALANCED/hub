<script setup lang="ts">
import { Form as VeeForm, Field, ErrorMessage } from 'vee-validate'
import { useRegisterForm } from '@/features/auth/lib/useRegisterForm'
import Label from '@/shared/ui/additionals/Label.vue'
import HubButton from '@/shared/ui/core/HubButton.vue'
import Input from '@/shared/ui/additionals/Input.vue'

const { onSubmit, registerMutation } = useRegisterForm()
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
      <Label for="name" class="text-sm font-medium text-card-foreground">Name</Label>
      <Field v-slot="{ field }" name="name">
        <Input
          id="name"
          type="text"
          placeholder="Enter your name"
          v-bind="field"
          class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </Field>
      <ErrorMessage name="name" class="text-sm text-destructive" />
    </div>

    <div class="space-y-2">
      <Label for="password" class="text-sm font-medium text-card-foreground">Password</Label>
      <Field v-slot="{ field }" name="password">
        <Input
          id="password"
          type="password"
          placeholder="Create a password"
          v-bind="field"
          class="bg-background-secondary border-border text-foreground placeholder:text-foreground-muted focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </Field>
      <ErrorMessage name="password" class="text-sm text-destructive" />
    </div>

    <HubButton
      type="submit"
      :disabled="registerMutation.isPending.value"
      class="w-full h-11 text-base font-medium"
      variant="hero"
    >
      <span v-if="registerMutation.isPending.value" class="animate-pulse">Creating...</span>
      <span v-else>Create Account</span>
    </HubButton>
  </form>
</template>

<style scoped></style>
