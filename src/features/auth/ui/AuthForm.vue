<script setup lang="ts">
import { computed, watch } from 'vue'
import { useAuthForm } from '@/features/auth/composables'
import {
  getFieldsForMode,
  getAuthFormTitle,
  getAuthFormDescription,
  getAuthFormSubmitLabel,
  getAuthFormToggleLabel,
} from '@/features/auth/lib'
import { Button } from '@/shared/ui/additionals/button'
import { Input } from '@/shared/ui/additionals/input'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/ui/additionals/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/additionals/card'
import { LoadingSpinner } from '@/shared/ui/additionals/spinner'

interface AuthFormProps {
  mode?: 'login' | 'register'
  redirectUrl?: string
}

const props = withDefaults(defineProps<AuthFormProps>(), {
  mode: 'login',
})

const emit = defineEmits<{
  success: [user: any]
  error: [error: Error]
  modeChange: [mode: 'login' | 'register']
}>()

const {
  mode: currentMode,
  isLoading,
  handleSubmit,
  meta,
  toggleMode: handleToggleMode,
  resetForm,
} = useAuthForm({
  mode: props.mode,
  redirectTo: props.redirectUrl,
  onSuccess: (user) => emit('success', user),
  onError: (error) => emit('error', error),
})

const formFields = computed(() => getFieldsForMode(currentMode.value))
const formTitle = computed(() => getAuthFormTitle(currentMode.value))
const formDescription = computed(() => getAuthFormDescription(currentMode.value))
const submitLabel = computed(() => getAuthFormSubmitLabel(currentMode.value, isLoading.value))
const toggleLabel = computed(() => getAuthFormToggleLabel(currentMode.value))

const handleModeToggle = () => {
  handleToggleMode()
  emit('modeChange', currentMode.value)
}

watch(
  () => props.mode,
  (newMode) => {
    if (newMode !== currentMode.value) {
      currentMode.value = newMode
      resetForm()
    }
  },
)
</script>

<template>
  <Card class="w-full max-w-md mx-auto">
    <CardHeader class="space-y-1">
      <CardTitle class="text-2xl text-center">
        {{ formTitle }}
      </CardTitle>
      <CardDescription class="text-center">
        {{ formDescription }}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" @submit="handleSubmit">
        <FormField
          v-for="field in formFields"
          :key="field.name"
          v-slot="{ field: fieldProps, errorMessage }"
          :name="field.name"
        >
          <FormItem>
            <FormLabel :for="`auth-${field.name}`">{{ field.label }}</FormLabel>
            <FormControl>
              <Input
                :id="`auth-${field.name}`"
                v-bind="fieldProps"
                :disabled="isLoading"
                :placeholder="field.placeholder"
                :type="field.type"
                :data-testid="`auth-${field.name}-input`"
              />
            </FormControl>
            <FormMessage v-if="errorMessage" :data-testid="`auth-${field.name}-error`">
              {{ errorMessage }}
            </FormMessage>
          </FormItem>
        </FormField>

        <Button
          :disabled="!meta.valid || isLoading"
          class="w-full"
          type="submit"
          data-testid="auth-submit-button"
        >
          <LoadingSpinner
            v-if="isLoading"
            class="w-4 h-4 mr-2 animate-spin"
            data-testid="auth-loading-spinner"
          />
          {{ submitLabel }}
        </Button>

        <div class="text-center">
          <Button
            variant="link"
            type="button"
            class="text-sm text-muted-foreground hover:text-foreground"
            @click="handleModeToggle"
            data-testid="auth-toggle-mode"
          >
            {{ toggleLabel }}
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
</template>

<style scoped></style>
