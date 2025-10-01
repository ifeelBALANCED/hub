import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useLoginForm } from '@/features/auth/lib/useLoginForm'

const hoisted = vi.hoisted(() => ({
  mockUseForm: vi.fn(),
  mockHandleSubmit: vi.fn(),
  mockMutateAsync: vi.fn(),
}))

vi.mock('vee-validate', () => ({
  useForm: hoisted.mockUseForm,
}))
vi.mock('@vee-validate/zod', () => ({
  toTypedSchema: vi.fn().mockReturnValue({}),
}))
vi.mock('@/features/auth/lib/schema')
vi.mock('@/shared/composables/useAuth', () => {
  const mockUseLogin = vi.fn(() => ({ mutateAsync: hoisted.mockMutateAsync }))
  // expose in hoisted for assertions
  // @ts-expect-error attach for tests
  hoisted.mockUseLogin = mockUseLogin
  return { useLogin: mockUseLogin }
})

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    // Setup mocks
    hoisted.mockUseForm.mockReturnValue({
      handleSubmit: hoisted.mockHandleSubmit,
      errors: {},
    })

    hoisted.mockHandleSubmit.mockImplementation((callback) => {
      return vi.fn().mockImplementation(async (values) => {
        await callback(values)
      })
    })
  })

  describe('form setup', () => {
    it('should initialize form with correct schema', () => {
      useLoginForm()

      expect(hoisted.mockUseForm).toHaveBeenCalledWith({
        validationSchema: expect.anything(),
        initialValues: { email: '', password: '' },
      })
    })

    it('should initialize login mutation', () => {
      useLoginForm()

      // @ts-expect-error from hoisted
      expect(hoisted.mockUseLogin).toHaveBeenCalled()
    })
  })

  describe('form submission', () => {
    it('should call mutation with form values on successful validation', async () => {
      const formValues = { email: 'user@example.com', password: 'password123' }

      useLoginForm()

      const { onSubmit } = useLoginForm()
      await onSubmit(formValues)

      expect(hoisted.mockMutateAsync).toHaveBeenCalledWith(formValues)
    })

    it('should handle submission errors gracefully', async () => {
      const formValues = { email: 'user@example.com', password: 'password123' }
      const error = new Error('Login failed')

      hoisted.mockMutateAsync.mockRejectedValue(error)

      useLoginForm()

      const onSubmit = hoisted.mockHandleSubmit.mock.results[0].value

      await expect(onSubmit(formValues)).rejects.toThrow('Login failed')
    })

    it('should not call mutation if validation fails', async () => {
      hoisted.mockUseForm.mockReturnValue({
        handleSubmit: vi.fn().mockImplementation((_onSuccess) => {
          return vi.fn().mockImplementation(async (_values) => {
            const validationErrors = { email: ['Email is required'] }
            throw validationErrors
          })
        }),
        errors: { email: ['Email is required'] },
      })

      useLoginForm()

      const { onSubmit } = useLoginForm()

      await expect(onSubmit({})).rejects.toThrow()
      expect(hoisted.mockMutateAsync).not.toHaveBeenCalled()
    })
  })

  describe('returned values', () => {
    it('should return onSubmit function', () => {
      const { onSubmit } = useLoginForm()

      expect(typeof onSubmit).toBe('function')
    })

    it('should return errors object', () => {
      const { errors } = useLoginForm()

      expect(typeof errors).toBe('object')
    })

    it('should return loginMutation object', () => {
      const { loginMutation } = useLoginForm()

      expect(loginMutation).toBeDefined()
      expect(loginMutation.mutateAsync).toBe(hoisted.mockMutateAsync)
    })
  })

  describe('form integration', () => {
    it('should handle multiple form submissions', async () => {
      const formValues1 = { email: 'user1@example.com', password: 'password123' }
      const formValues2 = { email: 'user2@example.com', password: 'password456' }

      useLoginForm()

      const { onSubmit } = useLoginForm()

      hoisted.mockMutateAsync.mockResolvedValue({})

      await onSubmit(formValues1)
      await onSubmit(formValues2)

      expect(hoisted.mockMutateAsync).toHaveBeenCalledTimes(2)
      expect(hoisted.mockMutateAsync).toHaveBeenNthCalledWith(1, formValues1)
      expect(hoisted.mockMutateAsync).toHaveBeenNthCalledWith(2, formValues2)
    })

    it('should maintain form state between submissions', () => {
      const { errors, onSubmit } = useLoginForm()

      expect(errors).toBeDefined()
      expect(typeof onSubmit).toBe('function')
    })
  })
})
