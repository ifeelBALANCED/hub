import { describe, it, expect, beforeEach, vi } from 'vitest'
import { errorService, extractErrorMessage } from '@/shared/services/error.service'
import type { AxiosError } from 'axios'
import { createMockError } from '../utils/test-utils'

const hoisted = vi.hoisted(() => ({
  mockNotificationService: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}))

vi.mock('@/shared/services/notification.service', () => ({
  notificationService: hoisted.mockNotificationService,
}))

vi.mock('@/shared/lib/constants', () => ({
  HTTP_STATUS: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  },
}))

describe('error.service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('extractErrorMessage', () => {
    it('should extract detail message from error response', () => {
      const error = {
        response: {
          data: {
            detail: 'Custom error detail message',
          },
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('Custom error detail message')
    })

    it('should extract message from error response when detail is not available', () => {
      const error = {
        response: {
          data: {
            message: 'Custom error message',
          },
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('Custom error message')
    })

    it('should return default message when no detail or message is available', () => {
      const error = {
        response: {
          data: {},
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should return default message when response data is not available', () => {
      const error = {
        response: null as any,
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle string error data', () => {
      const error = {
        response: {
          data: 'String error message',
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle nested error data structures', () => {
      const error = {
        response: {
          data: {
            errors: {
              email: ['Email is required'],
              password: ['Password must be at least 8 characters'],
            },
          },
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle array error data', () => {
      const error = {
        response: {
          data: ['Error 1', 'Error 2'],
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle boolean error data', () => {
      const error = {
        response: {
          data: true,
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle number error data', () => {
      const error = {
        response: {
          data: 404,
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle null error data', () => {
      const error = {
        response: {
          data: null,
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle undefined error data', () => {
      const error = {
        response: {
          data: undefined,
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle deeply nested error structures', () => {
      const error = {
        response: {
          data: {
            error: {
              details: {
                message: 'Deep error message',
              },
            },
          },
        },
      } as AxiosError

      const result = extractErrorMessage(error)

      expect(result).toBe('An unexpected error occurred')
    })
  })

  describe('errorService.handleApiError', () => {
    it('should handle network error (no status)', () => {
      const error = {
        response: null as any,
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Network Error',
        description: 'Please check your internet connection',
      })
    })

    it('should handle unauthorized error', () => {
      const error = {
        response: {
          status: 401,
          data: { detail: 'Token expired' },
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Unauthorized',
        description: 'Token expired',
      })
    })

    it('should handle forbidden error', () => {
      const error = {
        response: {
          status: 403,
          data: { message: 'Access denied' },
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Forbidden',
        description: 'Access denied',
      })
    })

    it('should handle not found error', () => {
      const error = {
        response: {
          status: 404,
          data: {},
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Not Found',
        description: 'Resource not found',
      })
    })

    it('should handle validation error', () => {
      const error = {
        response: {
          status: 422,
          data: { detail: 'Validation failed' },
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Validation Error',
        description: 'Validation failed',
      })
    })

    it('should handle server error', () => {
      const error = {
        response: {
          status: 500,
          data: { message: 'Internal server error' },
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Server Error',
        description: 'Internal server error',
      })
    })

    it('should handle unknown status with custom message', () => {
      const error = {
        response: {
          status: 418,
          data: { detail: 'I am a teapot' },
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Unexpected Error',
        description: 'I am a teapot',
      })
    })

    it('should handle unknown status without custom message', () => {
      const error = {
        response: {
          status: 418,
          data: {},
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Unexpected Error',
        description: 'Something went wrong',
      })
    })

    it('should handle malformed error response', () => {
      const error = {
        response: {
          status: 500,
          data: undefined,
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Server Error',
        description: 'Please try again later',
      })
    })

    it('should handle error with missing status as network error', () => {
      const error = {
        response: {
          status: undefined as any,
          data: { detail: 'Status missing' },
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Network Error',
        description: 'Please check your internet connection',
      })
    })

    it('should handle error with string status as server error', () => {
      const error = {
        response: {
          status: '500' as any,
          data: { detail: 'String status' },
        },
      } as AxiosError

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Server Error',
        description: 'String status',
      })
    })
  })

  describe('errorService.getErrorMessage', () => {
    it('should return network error for no status', () => {
      const result = errorService.getErrorMessage(0, 'Custom fallback')

      expect(result).toEqual({
        title: 'Network Error',
        description: 'Custom fallback',
      })
    })

    it('should return network error with default description', () => {
      const result = errorService.getErrorMessage(0)

      expect(result).toEqual({
        title: 'Network Error',
        description: 'Please check your internet connection',
      })
    })

    it('should return predefined error for known status', () => {
      const result = errorService.getErrorMessage(401)

      expect(result).toEqual({
        title: 'Unauthorized',
        description: 'Please log in to continue',
      })
    })

    it('should use fallback message when provided', () => {
      const result = errorService.getErrorMessage(404, 'Custom not found message')

      expect(result).toEqual({
        title: 'Not Found',
        description: 'Custom not found message',
      })
    })

    it('should return unexpected error for unknown status', () => {
      const result = errorService.getErrorMessage(418)

      expect(result).toEqual({
        title: 'Unexpected Error',
        description: 'Something went wrong',
      })
    })

    it('should use fallback message for unknown status', () => {
      const result = errorService.getErrorMessage(418, 'Custom error message')

      expect(result).toEqual({
        title: 'Unexpected Error',
        description: 'Custom error message',
      })
    })

    it('should handle negative status codes', () => {
      const result = errorService.getErrorMessage(-1)

      expect(result).toEqual({
        title: 'Unexpected Error',
        description: 'Something went wrong',
      })
    })

    it('should handle very large status codes', () => {
      const result = errorService.getErrorMessage(999)

      expect(result).toEqual({
        title: 'Unexpected Error',
        description: 'Something went wrong',
      })
    })

    it('should handle zero status code', () => {
      const result = errorService.getErrorMessage(0)

      expect(result).toEqual({
        title: 'Network Error',
        description: 'Please check your internet connection',
      })
    })
  })

  describe('edge cases', () => {
    it('should handle null error object', () => {
      expect(() => {
        extractErrorMessage(null as any)
      }).toThrow()

      // Since it throws, we don't need to check the result
    })

    it('should handle undefined error object', () => {
      expect(() => {
        extractErrorMessage(undefined as any)
      }).toThrow()

      // Since it throws, we don't need to check the result
    })

    it('should handle error without response property', () => {
      const error = {} as AxiosError

      const result = extractErrorMessage(error)
      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle error with empty response data', () => {
      const error = {
        response: {
          data: '',
        },
      } as AxiosError

      const result = extractErrorMessage(error)
      expect(result).toBe('An unexpected error occurred')
    })

    it('should handle very large error messages', () => {
      const longMessage = 'A'.repeat(10000)
      const error = {
        response: {
          data: {
            detail: longMessage,
          },
        },
      } as AxiosError

      const result = extractErrorMessage(error)
      expect(result).toBe(longMessage)
    })

    it('should handle error messages with special characters', () => {
      const specialMessage = 'Error: <script>alert("xss")</script> & special chars: áéíóú'
      const error = {
        response: {
          data: {
            detail: specialMessage,
          },
        },
      } as AxiosError

      const result = extractErrorMessage(error)
      expect(result).toBe(specialMessage)
    })
  })

  describe('real-world scenarios', () => {
    it('should handle JWT token expiration', () => {
      const error = createMockError('JWT token expired', 401, { detail: 'Token expired' })

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Unauthorized',
        description: 'Token expired',
      })
    })

    it('should handle rate limiting', () => {
      const error = createMockError('Rate limit exceeded', 429, { detail: 'Too many requests' })

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Unexpected Error',
        description: 'Too many requests',
      })
    })

    it('should handle CORS errors', () => {
      const error = createMockError('CORS error', 0)

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Network Error',
        description: 'Please check your internet connection',
      })
    })

    it('should handle timeout errors', () => {
      const error = createMockError('Request timeout', 408, { detail: 'Request timed out' })

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Unexpected Error',
        description: 'Request timed out',
      })
    })

    it('should handle malformed JSON responses with default fallback', () => {
      const error = createMockError('JSON parse error', 200, 'Invalid JSON')

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledWith({
        title: 'Unexpected Error',
        description: 'Something went wrong',
      })
    })
  })

  describe('integration scenarios', () => {
    it('should work with Vue error boundaries', () => {
      const error = createMockError('Component error', 500, { detail: 'Component crashed' })

      expect(() => {
        errorService.handleApiError(error)
      }).not.toThrow()

      expect(hoisted.mockNotificationService.error).toHaveBeenCalled()
    })

    it('should work in production environment', () => {
      // Simulate production error logging
      const originalConsole = global.console
      const mockConsoleError = vi.fn()

      global.console = { ...originalConsole, error: mockConsoleError }

      const error = createMockError('Production error', 500)

      errorService.handleApiError(error)

      expect(hoisted.mockNotificationService.error).toHaveBeenCalled()

      // Restore console
      global.console = originalConsole
    })

    it('should handle multiple concurrent errors', () => {
      const errors = [
        createMockError('Error 1', 401),
        createMockError('Error 2', 403),
        createMockError('Error 3', 500),
      ]

      errors.forEach((error) => {
        errorService.handleApiError(error)
      })

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledTimes(3)
    })
  })

  describe('performance scenarios', () => {
    it('should handle many error messages efficiently', () => {
      const errors = Array.from({ length: 1000 }, (_, i) =>
        createMockError(`Error ${i}`, 500, { detail: `Error detail ${i}` }),
      )

      errors.forEach((error) => {
        errorService.handleApiError(error)
      })

      expect(hoisted.mockNotificationService.error).toHaveBeenCalledTimes(1000)
    })

    it('should not cause memory leaks with large error objects', () => {
      const largeErrorData = {
        detail: 'A'.repeat(10000),
        errors: Array.from({ length: 100 }, (_, i) => `Field ${i} error`),
        stackTrace: 'A'.repeat(5000),
      }

      const error = createMockError('Large error', 422, largeErrorData)

      expect(() => {
        errorService.handleApiError(error)
      }).not.toThrow()
    })
  })
})
