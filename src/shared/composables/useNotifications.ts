import { notificationService } from '@/shared/services/notification.service'

export interface NotificationOptions {
  title: string
  description?: string
  duration?: number
}

export const useNotifications = () => {
  const showSuccess = (options: NotificationOptions) => {
    notificationService.success(options)
  }

  const showError = (options: NotificationOptions) => {
    notificationService.error(options)
  }

  const showInfo = (options: NotificationOptions) => {
    notificationService.info(options)
  }

  const showWarning = (options: NotificationOptions) => {
    notificationService.warning(options)
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
