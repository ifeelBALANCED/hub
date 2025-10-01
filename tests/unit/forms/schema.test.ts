import { describe, it, expect, vi } from 'vitest'
import { LoginFormSchema, RegisterFormSchema } from '@/features/auth/lib/schema'

// Mock constants
vi.mock('@/shared/lib/constants', () => ({
  VALIDATION: {
    EMAIL: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 254,
    },
    PASSWORD: {
      MIN_LENGTH: 8,
      MAX_LENGTH: 128,
    },
    NAME: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
    },
  },
  VALIDATION_MESSAGES: {
    EMAIL_INVALID: 'Invalid email format',
    EMAIL_REQUIRED: 'Email is required',
    EMAIL_TOO_LONG: 'Email is too long',
    PASSWORD_TOO_SHORT: 'Password is too short',
    PASSWORD_TOO_LONG: 'Password is too long',
    NAME_TOO_SHORT: 'Name is too short',
    NAME_TOO_LONG: 'Name is too long',
  },
}))

describe('LoginFormSchema', () => {
  describe('email validation', () => {
    it('should accept valid email', () => {
      const result = LoginFormSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('user@example.com')
      }
    })

    it('should reject invalid email format', () => {
      const result = LoginFormSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format')
      }
    })

    it('should reject empty email', () => {
      const result = LoginFormSchema.safeParse({
        email: '',
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format')
      }
    })

    it('should reject email that is too long', () => {
      const longEmail = `${'a'.repeat(250)}@example.com`

      const result = LoginFormSchema.safeParse({
        email: longEmail,
        password: 'password123',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is too long')
      }
    })
  })

  describe('password validation', () => {
    it('should accept valid password', () => {
      const result = LoginFormSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBe('password123')
      }
    })

    it('should reject password that is too short', () => {
      const result = LoginFormSchema.safeParse({
        email: 'user@example.com',
        password: 'short',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is too short')
      }
    })

    it('should reject password that is too long', () => {
      const longPassword = 'a'.repeat(130)

      const result = LoginFormSchema.safeParse({
        email: 'user@example.com',
        password: longPassword,
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is too long')
      }
    })
  })

  describe('complete form validation', () => {
    it('should validate complete valid form', () => {
      const result = LoginFormSchema.safeParse({
        email: 'user@example.com',
        password: 'securepassword123',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({
          email: 'user@example.com',
          password: 'securepassword123',
        })
      }
    })

    it('should reject form with multiple validation errors', () => {
      const result = LoginFormSchema.safeParse({
        email: 'invalid',
        password: 'short',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2)
        expect(result.error.issues.some((issue) => issue.message === 'Invalid email format')).toBe(
          true,
        )
        expect(result.error.issues.some((issue) => issue.message === 'Password is too short')).toBe(
          true,
        )
      }
    })
  })
})

describe('RegisterFormSchema', () => {
  describe('email validation', () => {
    it('should accept valid email', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.email).toBe('user@example.com')
      }
    })

    it('should reject invalid email format', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'invalid-email',
        password: 'password123',
        name: 'John Doe',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format')
      }
    })

    it('should reject empty email', () => {
      const result = RegisterFormSchema.safeParse({
        email: '',
        password: 'password123',
        name: 'John Doe',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email format')
      }
    })
  })

  describe('password validation', () => {
    it('should accept valid password', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.password).toBe('password123')
      }
    })

    it('should reject password that is too short', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'user@example.com',
        password: 'short',
        name: 'John Doe',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is too short')
      }
    })
  })

  describe('name validation', () => {
    it('should accept valid name', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        name: 'John Doe',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.name).toBe('John Doe')
      }
    })

    it('should reject empty name', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        name: '',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is too short')
      }
    })

    it('should reject name that is too long', () => {
      const longName = 'a'.repeat(105)

      const result = RegisterFormSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        name: longName,
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is too long')
      }
    })
  })

  describe('complete form validation', () => {
    it('should validate complete valid form', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'user@example.com',
        password: 'securepassword123',
        name: 'John Doe',
      })

      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual({
          email: 'user@example.com',
          password: 'securepassword123',
          name: 'John Doe',
        })
      }
    })

    it('should reject form with multiple validation errors', () => {
      const result = RegisterFormSchema.safeParse({
        email: 'invalid',
        password: 'short',
        name: '',
      })

      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues).toHaveLength(3)
        expect(result.error.issues.some((issue) => issue.message === 'Invalid email format')).toBe(
          true,
        )
        expect(result.error.issues.some((issue) => issue.message === 'Password is too short')).toBe(
          true,
        )
        expect(result.error.issues.some((issue) => issue.message === 'Name is too short')).toBe(
          true,
        )
      }
    })
  })
})
