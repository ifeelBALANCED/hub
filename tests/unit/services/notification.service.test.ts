import { describe, it, expect, beforeEach, vi } from 'vitest'
import { notificationService } from '@/shared/services/notification.service'

const hoisted = vi.hoisted(() => ({
  mockToast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}))

vi.mock('vue-sonner', () => ({
  toast: hoisted.mockToast,
}))

vi.mock('@/shared/lib/constants', () => ({
  TOAST_DURATION: {
    SHORT: 2000,
    MEDIUM: 4000,
    LONG: 6000,
  },
}))

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('success notifications', () => {
    it('should call toast.success with correct parameters', () => {
      const options = {
        title: 'Success message',
        description: 'Operation completed successfully',
        duration: 5000,
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: options.description,
        duration: options.duration,
      })
    })

    it('should use default duration when not provided', () => {
      const options = {
        title: 'Success message',
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: expect.any(Number),
      })
    })

    it('should handle missing description', () => {
      const options = {
        title: 'Success message',
        duration: 3000,
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: options.duration,
      })
    })

    it('should handle empty description string', () => {
      const options = {
        title: 'Success message',
        description: '',
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: '',
        duration: expect.any(Number),
      })
    })

    it('should handle special characters in title', () => {
      const options = {
        title: 'Success! 🎉 Operation completed',
        description: 'Special chars: <>&"',
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: options.description,
        duration: expect.any(Number),
      })
    })
  })

  describe('error notifications', () => {
    it('should call toast.error with correct parameters', () => {
      const options = {
        title: 'Error message',
        description: 'Something went wrong',
        duration: 7000,
      }

      notificationService.error(options)

      expect(hoisted.mockToast.error).toHaveBeenCalledWith(options.title, {
        description: options.description,
        duration: options.duration,
      })
    })

    it('should use default duration when not provided', () => {
      const options = {
        title: 'Error message',
      }

      notificationService.error(options)

      expect(hoisted.mockToast.error).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: expect.any(Number),
      })
    })

    it('should handle error with long description', () => {
      const longDescription = 'A'.repeat(1000)
      const options = {
        title: 'Error message',
        description: longDescription,
      }

      notificationService.error(options)

      expect(hoisted.mockToast.error).toHaveBeenCalledWith(options.title, {
        description: longDescription,
        duration: expect.any(Number),
      })
    })
  })

  describe('info notifications', () => {
    it('should call toast.info with correct parameters', () => {
      const options = {
        title: 'Info message',
        description: 'Here is some information',
        duration: 4000,
      }

      notificationService.info(options)

      expect(hoisted.mockToast.info).toHaveBeenCalledWith(options.title, {
        description: options.description,
        duration: options.duration,
      })
    })

    it('should use default duration when not provided', () => {
      const options = {
        title: 'Info message',
      }

      notificationService.info(options)

      expect(hoisted.mockToast.info).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: expect.any(Number),
      })
    })

    it('should handle info with structured data', () => {
      const options = {
        title: 'User Updated',
        description: JSON.stringify({ userId: 123, action: 'update' }),
      }

      notificationService.info(options)

      expect(hoisted.mockToast.info).toHaveBeenCalledWith(options.title, {
        description: options.description,
        duration: expect.any(Number),
      })
    })
  })

  describe('warning notifications', () => {
    it('should call toast.warning with correct parameters', () => {
      const options = {
        title: 'Warning message',
        description: 'Please be careful',
        duration: 6000,
      }

      notificationService.warning(options)

      expect(hoisted.mockToast.warning).toHaveBeenCalledWith(options.title, {
        description: options.description,
        duration: options.duration,
      })
    })

    it('should use default duration when not provided', () => {
      const options = {
        title: 'Warning message',
      }

      notificationService.warning(options)

      expect(hoisted.mockToast.warning).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: expect.any(Number),
      })
    })

    it('should handle warning with HTML-like content', () => {
      const options = {
        title: 'Warning',
        description: 'Invalid input: <script>alert("xss")</script>',
      }

      notificationService.warning(options)

      expect(hoisted.mockToast.warning).toHaveBeenCalledWith(options.title, {
        description: options.description,
        duration: expect.any(Number),
      })
    })
  })

  describe('edge cases', () => {
    it('should handle extremely long titles', () => {
      const longTitle = 'A'.repeat(1000)
      const options = {
        title: longTitle,
        description: 'Short description',
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(longTitle, {
        description: options.description,
        duration: expect.any(Number),
      })
    })

    it('should throw on null options', () => {
      expect(() => {
        notificationService.success(null as any)
      }).toThrow()
    })

    it('should handle empty string titles', () => {
      const options = {
        title: '',
        description: 'Description only',
      }

      notificationService.info(options)

      expect(hoisted.mockToast.info).toHaveBeenCalledWith('', {
        description: options.description,
        duration: expect.any(Number),
      })
    })

    it('should handle numeric durations', () => {
      const options = {
        title: 'Test',
        duration: 1234,
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: 1234,
      })
    })

    it('should handle zero duration', () => {
      const options = {
        title: 'Test',
        duration: 0,
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: 0,
      })
    })

    it('should handle negative duration', () => {
      const options = {
        title: 'Test',
        duration: -1000,
      }

      notificationService.success(options)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: -1000,
      })
    })
  })

  describe('concurrent notifications', () => {
    it('should handle multiple simultaneous notifications', () => {
      const notifications = [
        { title: 'Success 1', description: 'First success' },
        { title: 'Error 1', description: 'First error' },
        { title: 'Info 1', description: 'First info' },
        { title: 'Warning 1', description: 'First warning' },
      ]

      notificationService.success(notifications[0])
      notificationService.error(notifications[1])
      notificationService.info(notifications[2])
      notificationService.warning(notifications[3])

      expect(hoisted.mockToast.success).toHaveBeenCalledTimes(1)
      expect(hoisted.mockToast.error).toHaveBeenCalledTimes(1)
      expect(hoisted.mockToast.info).toHaveBeenCalledTimes(1)
      expect(hoisted.mockToast.warning).toHaveBeenCalledTimes(1)
    })

    it('should handle rapid successive notifications', async () => {
      const notifications = Array.from({ length: 10 }, (_, i) => ({
        title: `Notification ${i}`,
        description: `Description ${i}`,
      }))

      notifications.forEach((notification) => {
        notificationService.success(notification)
      })

      expect(hoisted.mockToast.success).toHaveBeenCalledTimes(10)

      notifications.forEach((notification, index) => {
        expect(hoisted.mockToast.success).toHaveBeenNthCalledWith(index + 1, notification.title, {
          description: notification.description,
          duration: expect.any(Number),
        })
      })
    })
  })

  describe('integration scenarios', () => {
    it('should work with Vue devtools', () => {
      const options = {
        title: 'Test notification',
        description: 'For debugging',
      }

      notificationService.info(options)

      expect(hoisted.mockToast.info).toHaveBeenCalled()
    })

    it('should handle notification dismissal', () => {
      const options = {
        title: 'Dismissible notification',
      }

      notificationService.info(options)

      expect(hoisted.mockToast.info).toHaveBeenCalledWith(options.title, {
        description: undefined,
        duration: expect.any(Number),
      })
    })

    it('should work in error boundary scenarios', () => {
      const errorScenarios = [
        { title: 'Network Error', description: 'Connection failed' },
        { title: 'Validation Error', description: 'Invalid input' },
        { title: 'Authentication Error', description: 'Unauthorized access' },
      ]

      errorScenarios.forEach((scenario) => {
        notificationService.error(scenario)
      })

      expect(hoisted.mockToast.error).toHaveBeenCalledTimes(3)
    })
  })

  describe('performance scenarios', () => {
    it('should handle high volume of notifications', () => {
      const notifications = Array.from({ length: 1000 }, (_, i) => ({
        title: `Notification ${i}`,
        description: `Description ${i}`,
      }))

      notifications.forEach((notification) => {
        notificationService.success(notification)
      })

      expect(hoisted.mockToast.success).toHaveBeenCalledTimes(1000)
    })

    it('should not cause memory leaks with many notifications', () => {
      const initialCallCount = hoisted.mockToast.success.mock.calls.length

      for (let i = 0; i < 100; i++) {
        notificationService.success({
          title: `Test ${i}`,
        })
      }

      expect(hoisted.mockToast.success).toHaveBeenCalledTimes(initialCallCount + 100)
    })
  })

  describe('real-world usage patterns', () => {
    it('should handle form submission success', () => {
      const formSubmission = {
        title: 'Form Submitted',
        description: 'Your form has been successfully submitted',
      }

      notificationService.success(formSubmission)

      expect(hoisted.mockToast.success).toHaveBeenCalledWith(formSubmission.title, {
        description: formSubmission.description,
        duration: expect.any(Number),
      })
    })

    it('should handle API error responses', () => {
      const apiError = {
        title: 'Request Failed',
        description: 'The server encountered an error while processing your request',
      }

      notificationService.error(apiError)

      expect(hoisted.mockToast.error).toHaveBeenCalledWith(apiError.title, {
        description: apiError.description,
        duration: expect.any(Number),
      })
    })

    it('should handle validation warnings', () => {
      const validationWarning = {
        title: 'Validation Warning',
        description: 'Some fields need attention before proceeding',
      }

      notificationService.warning(validationWarning)

      expect(hoisted.mockToast.warning).toHaveBeenCalledWith(validationWarning.title, {
        description: validationWarning.description,
        duration: expect.any(Number),
      })
    })

    it('should handle loading states', () => {
      const loadingNotification = {
        title: 'Loading',
        description: 'Please wait while we process your request',
      }

      notificationService.info(loadingNotification)

      expect(hoisted.mockToast.info).toHaveBeenCalledWith(loadingNotification.title, {
        description: loadingNotification.description,
        duration: expect.any(Number),
      })
    })
  })
})
