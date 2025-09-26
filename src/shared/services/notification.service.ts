import { toast } from 'vue-sonner'
import { TOAST_DURATION } from '../lib/constants'

export interface NotificationOptions {
  title: string
  description?: string
  duration?: number
}

export interface INotificationService {
  success(options: NotificationOptions): void
  error(options: NotificationOptions): void
  info(options: NotificationOptions): void
  warning(options: NotificationOptions): void
}

export class NotificationService implements INotificationService {
  success(options: NotificationOptions): void {
    toast.success(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.MEDIUM,
    })
  }

  error(options: NotificationOptions): void {
    toast.error(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.LONG,
    })
  }

  info(options: NotificationOptions): void {
    toast.info(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.MEDIUM,
    })
  }

  warning(options: NotificationOptions): void {
    toast.warning(options.title, {
      description: options.description,
      duration: options.duration ?? TOAST_DURATION.MEDIUM,
    })
  }
}

export const notificationService = new NotificationService()
