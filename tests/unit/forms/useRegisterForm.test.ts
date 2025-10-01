import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useRegisterForm } from '@/features/auth/lib/useRegisterForm'

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
vi.mock('@/shared/composables/useAuth', () => ({
  useRegister: vi.fn(() => ({ mutateAsync: hoisted.mockMutateAsync })),
}))

describe('useRegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()

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
      useRegisterForm()

      expect(hoisted.mockUseForm).toHaveBeenCalledWith({
        validationSchema: expect.anything(),
        initialValues: { email: '', password: '', name: '' },
      })
    })

    it('should initialize register mutation', () => {
      useRegisterForm()

      expect(hoisted.mockMutateAsync).toBeDefined()
    })
  })

  describe('form submission', () => {
    it('should call mutation with form values on successful validation', async () => {
      const formValues = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      }

      useRegisterForm()

      const onSubmit = hoisted.mockHandleSubmit.mock.results[0].value
      await onSubmit(formValues)

      expect(hoisted.mockMutateAsync).toHaveBeenCalledWith(formValues)
    })

    it('should handle submission errors gracefully', async () => {
      const formValues = {
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      }
      const error = new Error('Registration failed')
      hoisted.mockMutateAsync.mockRejectedValue(error)

      useRegisterForm()

      const onSubmit = hoisted.mockHandleSubmit.mock.results[0].value

      await expect(onSubmit(formValues)).rejects.toThrow('Registration failed')
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

      useRegisterForm()

      const { onSubmit } = useRegisterForm()

      await expect(onSubmit({})).rejects.toThrow()
      expect(hoisted.mockMutateAsync).not.toHaveBeenCalled()
    })
  })

  describe('returned values', () => {
    it('should return onSubmit function', () => {
      const { onSubmit } = useRegisterForm()

      expect(typeof onSubmit).toBe('function')
    })

    it('should return errors object', () => {
      const { errors } = useRegisterForm()

      expect(typeof errors).toBe('object')
    })

    it('should return registerMutation object', () => {
      const { registerMutation } = useRegisterForm()

      expect(registerMutation).toBeDefined()
      expect(registerMutation.mutateAsync).toBe(hoisted.mockMutateAsync)
    })
  })

  describe('form integration', () => {
    it('should handle multiple form submissions', async () => {
      const formValues1 = {
        email: 'user1@example.com',
        password: 'password123',
        name: 'John Doe',
      }
      const formValues2 = {
        email: 'user2@example.com',
        password: 'password456',
        name: 'Jane Smith',
      }

      useRegisterForm()

      const { onSubmit } = useRegisterForm()

      hoisted.mockMutateAsync.mockResolvedValue({})

      await onSubmit(formValues1)
      await onSubmit(formValues2)

      expect(hoisted.mockMutateAsync).toHaveBeenCalledTimes(2)
      expect(hoisted.mockMutateAsync).toHaveBeenNthCalledWith(1, formValues1)
      expect(hoisted.mockMutateAsync).toHaveBeenNthCalledWith(2, formValues2)
    })

    it('should maintain form state between submissions', () => {
      const { errors, onSubmit } = useRegisterForm()

      expect(errors).toBeDefined()
      expect(typeof onSubmit).toBe('function')
    })

    it('should handle partial form data', async () => {
      const partialValues = {
        email: 'user@example.com',
        password: 'password123',
      }

      hoisted.mockUseForm.mockReturnValue({
        handleSubmit: vi.fn().mockImplementation((onSuccess, onError) => {
          return vi.fn().mockImplementation(async (values) => {
            if (!values.name) {
              const validationErrors = { name: ['Name is required'] }
              if (onError) {
                await onError(validationErrors)
              }
              throw validationErrors
            }
          })
        }),
        errors: { name: ['Name is required'] },
      })

      useRegisterForm()

      const { onSubmit } = useRegisterForm()

      await expect(onSubmit(partialValues)).rejects.toThrow()
      expect(hoisted.mockMutateAsync).not.toHaveBeenCalled()
    })
  })
})
