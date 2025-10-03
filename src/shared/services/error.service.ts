import type { AxiosError } from 'axios'
import type { INotificationService, NotificationOptions } from './notification.service'
import { HTTP_STATUS } from '../lib/constants'

export interface ApiErrorResponse {
  detail?: string
  message?: string
}

export interface IErrorService {
  handleApiError(error: AxiosError<ApiErrorResponse>): void
  getErrorMessage(status: number, fallbackMessage?: string): NotificationOptions
}

export class ErrorService implements IErrorService {
  private readonly errorMessages: Record<number, Omit<NotificationOptions, 'duration'>> = {
    [HTTP_STATUS.UNAUTHORIZED]: {
      title: 'Unauthorized',
      description: 'Please log in to continue',
    },
    [HTTP_STATUS.FORBIDDEN]: {
      title: 'Forbidden',
      description: "You don't have permission",
    },
    [HTTP_STATUS.NOT_FOUND]: {
      title: 'Not Found',
      description: 'Resource not found',
    },
    [HTTP_STATUS.UNPROCESSABLE_ENTITY]: {
      title: 'Validation Error',
      description: 'Please check your input',
    },
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: {
      title: 'Server Error',
      description: 'Please try again later',
    },
  }

  constructor(private readonly notificationService: INotificationService) {}

  handleApiError(error: AxiosError<ApiErrorResponse>): void {
    const status = error.response?.status
    const data = error.response?.data

    if (!status) {
      this.notificationService.error({
        title: 'Network Error',
        description: 'Please check your internet connection',
      })
      return
    }

    const errorMessage = this.getErrorMessage(status, data?.detail || data?.message)
    this.notificationService.error(errorMessage)
  }

  getErrorMessage(status: number, fallbackMessage?: string): NotificationOptions {
    const baseMessage = this.errorMessages[status]

    if (!baseMessage) {
      return {
        title: 'Unexpected Error',
        description: fallbackMessage || 'Something went wrong',
      }
    }

    return {
      ...baseMessage,
      description: fallbackMessage || baseMessage.description,
    }
  }
}
