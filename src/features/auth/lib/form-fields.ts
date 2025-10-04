import type { AuthMode } from '@/features/auth/composables/useAuthForm'

export interface FormFieldConfig {
  name: string
  label: string
  type: string
  placeholder: string
  visibleIn: AuthMode[]
}

export const AUTH_FORM_FIELDS: FormFieldConfig[] = [
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    visibleIn: ['login', 'register'],
  },
  {
    name: 'displayName',
    label: 'Display Name',
    type: 'text',
    placeholder: 'Enter your display name',
    visibleIn: ['register'],
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    visibleIn: ['login', 'register'],
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Confirm your password',
    visibleIn: ['register'],
  },
]

export const getFieldsForMode = (mode: AuthMode): FormFieldConfig[] => {
  return AUTH_FORM_FIELDS.filter((field) => field.visibleIn.includes(mode))
}

export const getAuthFormTitle = (mode: AuthMode): string => {
  return mode === 'login' ? 'Sign In' : 'Create Account'
}

export const getAuthFormDescription = (mode: AuthMode): string => {
  return mode === 'login'
    ? 'Enter your credentials to access your account'
    : 'Enter your information to create a new account'
}

export const getAuthFormSubmitLabel = (mode: AuthMode, isLoading: boolean): string => {
  if (isLoading) {
    return mode === 'login' ? 'Signing In...' : 'Creating Account...'
  }
  return mode === 'login' ? 'Sign In' : 'Create Account'
}

export const getAuthFormToggleLabel = (mode: AuthMode): string => {
  return mode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'
}
