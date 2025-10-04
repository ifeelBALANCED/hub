import { computed, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useRouter } from 'vue-router'
import { useAuth } from './useAuth'
import { logger } from '@/shared/services/logger.service'
import {
  LoginFormSchema,
  RegisterFormSchema,
  type LoginFormValues,
  type RegisterFormValues,
  mapAuthErrorToField,
  isAuthError,
} from '@/features/auth/lib'

export type AuthMode = 'login' | 'register'

interface UseAuthFormOptions {
  mode?: AuthMode
  redirectTo?: string
  onSuccess?: (user: any) => void
  onError?: (error: Error) => void
}

const createValidationSchema = (mode: AuthMode) => {
  return toTypedSchema(mode === 'login' ? LoginFormSchema : RegisterFormSchema)
}

const handleLoginSubmit = async (formValues: LoginFormValues, auth: ReturnType<typeof useAuth>) => {
  return auth.login({
    email: formValues.email,
    password: formValues.password,
  })
}

const handleRegisterSubmit = async (
  formValues: RegisterFormValues,
  auth: ReturnType<typeof useAuth>,
) => {
  return auth.register({
    email: formValues.email,
    password: formValues.password,
    displayName: formValues.displayName,
  })
}

export const useAuthForm = (options: UseAuthFormOptions = {}) => {
  const { mode: initialMode = 'login', redirectTo = '/dashboard', onSuccess, onError } = options

  const router = useRouter()
  const auth = useAuth()
  const mode = ref<AuthMode>(initialMode)

  const validationSchema = computed(() => createValidationSchema(mode.value))

  const { handleSubmit, resetForm, setErrors, meta } = useForm({
    validationSchema,
  })

  const isLoading = computed(() =>
    mode.value === 'login' ? auth.isLoggingIn.value : auth.isRegistering.value,
  )

  const authError = computed(() =>
    mode.value === 'login' ? auth.loginError.value : auth.registerError.value,
  )

  const submitForm = async (formValues: LoginFormValues | RegisterFormValues) => {
    try {
      auth.clearErrors()

      const user =
        mode.value === 'login'
          ? await handleLoginSubmit(formValues, auth)
          : await handleRegisterSubmit(formValues as RegisterFormValues, auth)

      onSuccess?.(user)

      if (redirectTo) {
        router.push(redirectTo)
      }
    } catch (error) {
      logger.error('Auth form submission failed', error)

      if (isAuthError(error)) {
        setErrors(mapAuthErrorToField(error))
        onError?.(error)
      }
    }
  }

  const onSubmit = handleSubmit(submitForm)

  const toggleMode = () => {
    mode.value = mode.value === 'login' ? 'register' : 'login'
  }

  watch(mode, () => {
    resetForm()
  })

  return {
    mode,
    isLoading,
    isFormValid: computed(() => meta.value.valid),
    handleSubmit: onSubmit,
    meta,
    toggleMode,
    resetForm,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    authError,
  }
}
