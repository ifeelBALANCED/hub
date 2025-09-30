import type { AxiosError } from 'axios'
import { HTTP_STATUS } from '../lib/constants'
import { notificationService } from './notification.service'

export interface ApiErrorResponse {
  detail?: string
  message?: string
}

const ERROR_MESSAGES: Record<number, { title: string; description: string }> = {
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

export function extractErrorMessage(error: AxiosError): string {
  const data = error.response?.data as any
  if (data?.detail) {
    return data.detail
  }

  if (data?.message) {
    return data.message
  }

  return 'An unexpected error occurred'
}

export const errorService = {
  handleApiError(error: AxiosError): void {
    const status = error.response?.status
    const data = error.response?.data as any

    if (!status) {
      // Network error
      notificationService.error({
        title: 'Network Error',
        description: 'Please check your internet connection',
      })
      return
    }

    const errorInfo = ERROR_MESSAGES[status]
    if (errorInfo) {
      notificationService.error({
        title: errorInfo.title,
        description: data?.detail || data?.message || errorInfo.description,
      })
    } else {
      notificationService.error({
        title: 'Unexpected Error',
        description: data?.detail || data?.message || 'Something went wrong',
      })
    }
  },

  getErrorMessage(
    status: number,
    fallbackMessage?: string,
  ): { title: string; description: string } {
    if (!status) {
      return {
        title: 'Network Error',
        description: fallbackMessage || 'Please check your internet connection',
      }
    }

    const errorInfo = ERROR_MESSAGES[status]
    if (errorInfo) {
      return {
        title: errorInfo.title,
        description: fallbackMessage || errorInfo.description,
      }
    }

    return {
      title: 'Unexpected Error',
      description: fallbackMessage || 'Something went wrong',
    }
  },
}
